const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');
const db = require('../config/database');
const { verifyToken } = require('./auth');

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:5001';
let reportSchemaEnsured = false;
let reportSchemaEnsuringPromise = null;

// Ensure any columns added after initial schema creation exist (PostgreSQL version)
async function ensureReportWorkflowSchema() {
  if (reportSchemaEnsured) return;

  if (reportSchemaEnsuringPromise) {
    await reportSchemaEnsuringPromise;
    return;
  }

  reportSchemaEnsuringPromise = (async () => {
    const [columns] = await db.query(
      `SELECT column_name
       FROM information_schema.columns
       WHERE table_schema = 'public' AND table_name = 'reports'`
    );
    const columnNames = new Set(columns.map((col) => col.column_name));

    if (!columnNames.has('rejection_reason')) {
      await db.query('ALTER TABLE reports ADD COLUMN IF NOT EXISTS rejection_reason TEXT');
    }
    if (!columnNames.has('pickup_scheduled_at')) {
      await db.query('ALTER TABLE reports ADD COLUMN IF NOT EXISTS pickup_scheduled_at TIMESTAMP');
    }
    if (!columnNames.has('status_updated_at')) {
      await db.query('ALTER TABLE reports ADD COLUMN IF NOT EXISTS status_updated_at TIMESTAMP');
    }
    if (!columnNames.has('location')) {
      await db.query('ALTER TABLE reports ADD COLUMN IF NOT EXISTS location VARCHAR(512)');
    }

    reportSchemaEnsured = true;
  })();

  try {
    await reportSchemaEnsuringPromise;
  } finally {
    reportSchemaEnsuringPromise = null;
  }
}

// Normalise any datetime string to "YYYY-MM-DD HH:MM:SS" (also accepted by PostgreSQL)
function toDateTimeString(input) {
  if (input === null || input === undefined) return null;

  const value = String(input).trim();
  if (!value) return null;

  const sqlDateTimePattern = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}(:\d{2})?$/;
  const normalizedInput =
    sqlDateTimePattern.test(value) && value.length === 16 ? `${value}:00` : value;
  const parseValue = sqlDateTimePattern.test(normalizedInput)
    ? normalizedInput.replace(' ', 'T')
    : normalizedInput;

  const parsed = new Date(parseValue);
  if (Number.isNaN(parsed.getTime())) return null;

  const pad2 = (n) => String(n).padStart(2, '0');
  return `${parsed.getFullYear()}-${pad2(parsed.getMonth() + 1)}-${pad2(parsed.getDate())} ${pad2(parsed.getHours())}:${pad2(parsed.getMinutes())}:${pad2(parsed.getSeconds())}`;
}

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = './uploads/reports';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype && extname) return cb(null, true);
    cb(new Error('Only image files are allowed'));
  }
});

// Helper: call AI classification service
async function classifyImage(imagePath) {
  try {
    const absolutePath = path.resolve(imagePath);
    if (!fs.existsSync(absolutePath)) {
      throw new Error(`Image not found on backend: ${absolutePath}`);
    }

    console.log(`🧠 Sending image to AI service: ${absolutePath}`);

    const formData = new FormData();
    formData.append('image', fs.createReadStream(absolutePath));

    const response = await axios.post(`${AI_SERVICE_URL}/classify`, formData, {
      headers: formData.getHeaders(),
      timeout: 60000,
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
    });

    const data = response.data;
    console.log(`✅ AI classification: ${data.waste_type} (${(data.confidence * 100).toFixed(1)}%) severity=${data.severity_level}`);
    return data;
  } catch (error) {
    const errMsg = error.response?.data?.error || error.message;
    console.error('⚠️  AI classification failed:', errMsg);
    return null;
  }
}

// Create new report
router.post('/', verifyToken, upload.single('image'), async (req, res) => {
  try {
    const { latitude, longitude, gps_accuracy, location } = req.body;
    const user_id = req.user.user_id;

    if (!req.file || !latitude || !longitude) {
      return res.status(400).json({ error: 'Image, latitude, and longitude are required' });
    }

    const image_url = `/uploads/reports/${req.file.filename}`;
    const normalizedLocation = String(location || '').trim() || `${latitude}, ${longitude}`;

    const [reportRows] = await db.query(
      `INSERT INTO reports (user_id, image_url, location, latitude, longitude, gps_accuracy, submitted_at, status, status_updated_at) 
       VALUES (?, ?, ?, ?, ?, ?, NOW(), 'pending', NOW()) RETURNING report_id`,
      [user_id, image_url, normalizedLocation, latitude, longitude, gps_accuracy || 0]
    );

    const report_id = reportRows[0].report_id;

    // AI Classification (non-blocking for the response)
    let aiResult = null;
    const imageDiskPath = `.${image_url}`;
    aiResult = await classifyImage(imageDiskPath);

    if (aiResult && aiResult.waste_type && aiResult.waste_type !== 'Unknown') {
      await db.query(
        `INSERT INTO ai_classification (report_id, waste_type, severity_level, confidence_score, processed_at) 
         VALUES (?, ?, ?, ?, NOW())`,
        [report_id, aiResult.waste_type, aiResult.severity_level, aiResult.confidence]
      );
      console.log(`📝 AI classification saved for report #${report_id}`);
    }

    await db.query(
      `INSERT INTO system_logs (user_id, action_type, description, created_at) 
       VALUES (?, 'REPORT_SUBMIT', 'New waste report submitted', NOW())`,
      [user_id]
    );

    res.status(201).json({
      message: 'Report submitted successfully',
      report_id,
      image_url,
      ai_classification: aiResult ? {
        waste_type: aiResult.waste_type,
        confidence: aiResult.confidence,
        severity_level: aiResult.severity_level,
        num_detections: aiResult.num_detections,
        all_types: aiResult.all_types
      } : null
    });

  } catch (error) {
    console.error('Create report error:', error);
    res.status(500).json({ error: 'Failed to create report', message: error.message });
  }
});

// Get all reports (admin) or user's reports
router.get('/', verifyToken, async (req, res) => {
  try {
    const { role, user_id } = req.user;
    const { status, limit = 50, offset = 0 } = req.query;

    let query = `
      SELECT 
        r.report_id, r.user_id, r.image_url, r.location, r.latitude, r.longitude, 
        r.gps_accuracy, r.submitted_at, r.status, r.rejection_reason, r.pickup_scheduled_at, r.status_updated_at,
        u.name as user_name, u.email as user_email,
        ai.waste_type, ai.severity_level, ai.confidence_score,
        ct.assigned_to, ct.driver_user_id, ct.completion_status, ct.completed_at,
        ct.completion_image_url, ct.completion_latitude, ct.completion_longitude,
        ct.completion_location, ct.completion_verified, ct.pickup_report_status,
        ct.pickup_report_action_at, ct.pickup_report_action_by,
        d.name as driver_name, d.phone as driver_phone, d.area as driver_area
      FROM reports r
      LEFT JOIN users u ON r.user_id = u.user_id
      LEFT JOIN ai_classification ai ON r.report_id = ai.report_id
      LEFT JOIN cleanup_tasks ct ON r.report_id = ct.report_id
      LEFT JOIN users d ON ct.driver_user_id = d.user_id
    `;

    const params = [];

    if (role !== 'admin') {
      query += ' WHERE r.user_id = ?';
      params.push(user_id);
    }

    if (status) {
      query += role === 'admin' ? ' WHERE r.status = ?' : ' AND r.status = ?';
      params.push(status);
    }

    query += ' ORDER BY r.submitted_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const [reports] = await db.query(query, params);

    res.json({ reports, count: reports.length });

  } catch (error) {
    console.error('Get reports error:', error);
    res.status(500).json({ error: 'Failed to fetch reports', message: error.message });
  }
});

// Get single report by ID
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const report_id = req.params.id;

    const [reports] = await db.query(
      `SELECT 
        r.*, 
        u.name as user_name, u.email as user_email,
        ai.waste_type, ai.severity_level, ai.confidence_score, ai.processed_at,
        ct.assigned_to, ct.driver_user_id, ct.completion_status, ct.completed_at,
        ct.completion_image_url, ct.completion_latitude, ct.completion_longitude,
        ct.completion_location, ct.completion_verified, ct.pickup_report_status,
        ct.pickup_report_action_at, ct.pickup_report_action_by,
        d.name as driver_name, d.phone as driver_phone, d.area as driver_area
      FROM reports r
      LEFT JOIN users u ON r.user_id = u.user_id
      LEFT JOIN ai_classification ai ON r.report_id = ai.report_id
      LEFT JOIN cleanup_tasks ct ON r.report_id = ct.report_id
      LEFT JOIN users d ON ct.driver_user_id = d.user_id
      WHERE r.report_id = ?`,
      [report_id]
    );

    if (reports.length === 0) {
      return res.status(404).json({ error: 'Report not found' });
    }

    res.json(reports[0]);

  } catch (error) {
    console.error('Get report error:', error);
    res.status(500).json({ error: 'Failed to fetch report', message: error.message });
  }
});

// Update report status (admin only)
router.patch('/:id/status', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const report_id = req.params.id;
    const { status, rejection_reason, pickup_scheduled_at, driver_id } = req.body;

    const validStatuses = ['pending', 'received', 'rejected', 'scheduled_for_pickup', 'completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    if (status === 'rejected' && (!rejection_reason || !String(rejection_reason).trim())) {
      return res.status(400).json({ error: 'Rejection reason is required for rejected status' });
    }

    let normalizedPickupSchedule = null;
    let selectedDriver = null;

    if (status === 'scheduled_for_pickup') {
      if (!pickup_scheduled_at) {
        return res.status(400).json({ error: 'pickup_scheduled_at is required for scheduled_for_pickup status' });
      }
      if (!driver_id) {
        return res.status(400).json({ error: 'driver_id is required for scheduled_for_pickup status' });
      }

      normalizedPickupSchedule = toDateTimeString(pickup_scheduled_at);
      if (!normalizedPickupSchedule) {
        return res.status(400).json({ error: 'pickup_scheduled_at must be a valid datetime' });
      }

      const scheduledDate = new Date(normalizedPickupSchedule.replace(' ', 'T'));
      if (Number.isNaN(scheduledDate.getTime())) {
        return res.status(400).json({ error: 'pickup_scheduled_at must be a valid datetime' });
      }

      if (scheduledDate <= new Date()) {
        return res.status(400).json({ error: 'pickup_scheduled_at must be in the future' });
      }

      const [drivers] = await db.query(
        `SELECT user_id, name FROM users WHERE user_id = ? AND role = 'driver' AND status = TRUE`,
        [driver_id]
      );

      if (drivers.length === 0) {
        return res.status(404).json({ error: 'Selected driver not found' });
      }

      selectedDriver = drivers[0];
    }

    await db.query(
      `UPDATE reports 
       SET status = ?, 
           rejection_reason = ?, 
           pickup_scheduled_at = ?,
           status_updated_at = NOW()
       WHERE report_id = ?`,
      [
        status,
        status === 'rejected' ? String(rejection_reason).trim() : null,
        status === 'scheduled_for_pickup' ? normalizedPickupSchedule : null,
        report_id
      ]
    );

    if (status === 'scheduled_for_pickup') {
      const [existingTasks] = await db.query(
        'SELECT task_id FROM cleanup_tasks WHERE report_id = ? LIMIT 1',
        [report_id]
      );

      if (existingTasks.length > 0) {
        await db.query(
          `UPDATE cleanup_tasks
           SET driver_user_id = ?,
               assigned_to = ?,
               assigned_at = NOW(),
               due_date = ?,
               completion_status = 'TASK DUE',
               completed_at = NULL,
               completion_image_url = NULL,
               completion_latitude = NULL,
               completion_longitude = NULL,
               completion_location = NULL,
               completion_verified = FALSE,
               pickup_report_status = NULL,
               pickup_report_action_at = NULL,
               pickup_report_action_by = NULL
           WHERE report_id = ?`,
          [driver_id, selectedDriver?.name || '', normalizedPickupSchedule, report_id]
        );
      } else {
        await db.query(
          `INSERT INTO cleanup_tasks (report_id, assigned_to, driver_user_id, assigned_at, due_date, completion_status)
           VALUES (?, ?, ?, NOW(), ?, 'TASK DUE')`,
          [report_id, selectedDriver?.name || '', driver_id, normalizedPickupSchedule]
        );
      }
    }

    await db.query(
      `INSERT INTO system_logs (user_id, action_type, description, created_at) 
       VALUES (?, 'STATUS_UPDATE', 'Report status updated to ${status}', NOW())`,
      [req.user.user_id]
    );

    res.json({ message: 'Status updated successfully', status });

  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ error: 'Failed to update status', message: error.message });
  }
});

// User confirmation for pickup report
router.post('/:id/pickup-report', verifyToken, async (req, res) => {
  try {
    const report_id = req.params.id;
    const { action } = req.body;

    if (!['confirm', 'reject'].includes(String(action))) {
      return res.status(400).json({ error: 'Invalid action' });
    }

    const [reports] = await db.query(
      `SELECT r.report_id, r.user_id, ct.task_id, ct.pickup_report_status
       FROM reports r
       LEFT JOIN cleanup_tasks ct ON r.report_id = ct.report_id
       WHERE r.report_id = ?`,
      [report_id]
    );

    if (reports.length === 0) {
      return res.status(404).json({ error: 'Report not found' });
    }

    const report = reports[0];
    if (req.user.user_id !== report.user_id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (!report.task_id) {
      return res.status(400).json({ error: 'No pickup report available' });
    }

    if (report.pickup_report_status && report.pickup_report_status !== 'waiting') {
      return res.status(400).json({ error: 'Pickup report already processed' });
    }

    if (action === 'confirm') {
      await db.query(
        `UPDATE cleanup_tasks
         SET pickup_report_status = 'confirmed',
             pickup_report_action_at = NOW(),
             pickup_report_action_by = ?
         WHERE report_id = ?`,
        [req.user.user_id, report_id]
      );

      await db.query(
        `INSERT INTO system_logs (user_id, action_type, description, created_at)
         VALUES (?, 'PICKUP_CONFIRM', 'User confirmed pickup report', NOW())`,
        [req.user.user_id]
      );

      return res.json({ message: 'Pickup report confirmed' });
    }

    await db.query(
      `UPDATE cleanup_tasks
       SET pickup_report_status = 'rejected',
           pickup_report_action_at = NOW(),
           pickup_report_action_by = ?,
           completion_status = 'REASSIGNED',
           completion_verified = FALSE,
           driver_user_id = NULL,
           assigned_to = NULL,
           assigned_at = NULL,
           due_date = NULL
       WHERE report_id = ?`,
      [req.user.user_id, report_id]
    );

    await db.query(
      `UPDATE reports
       SET status = 'scheduled_for_pickup',
           pickup_scheduled_at = NULL,
           status_updated_at = NOW()
       WHERE report_id = ?`,
      [report_id]
    );

    await db.query(
      `INSERT INTO system_logs (user_id, action_type, description, created_at)
       VALUES (?, 'PICKUP_REJECT', 'User rejected pickup report', NOW())`,
      [req.user.user_id]
    );

    res.json({ message: 'Pickup report rejected and reassigned' });
  } catch (error) {
    console.error('Pickup report action error:', error);
    res.status(500).json({ error: 'Failed to process pickup report', message: error.message });
  }
});

// Add AI classification to report
router.post('/:id/classify', verifyToken, async (req, res) => {
  try {
    const report_id = req.params.id;
    const { waste_type, severity_level, confidence_score } = req.body;

    const [rows] = await db.query(
      `INSERT INTO ai_classification (report_id, waste_type, severity_level, confidence_score, processed_at) 
       VALUES (?, ?, ?, ?, NOW()) RETURNING classification_id`,
      [report_id, waste_type, severity_level, confidence_score || 0]
    );

    res.status(201).json({
      message: 'AI classification added successfully',
      classification_id: rows[0].classification_id
    });

  } catch (error) {
    console.error('Add classification error:', error);
    res.status(500).json({ error: 'Failed to add classification', message: error.message });
  }
});

// Delete report (admin only)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const report_id = req.params.id;

    const [reports] = await db.query('SELECT image_url FROM reports WHERE report_id = ?', [report_id]);

    if (reports.length > 0) {
      const imagePath = `.${reports[0].image_url}`;
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await db.query('DELETE FROM reports WHERE report_id = ?', [report_id]);

    res.json({ message: 'Report deleted successfully' });

  } catch (error) {
    console.error('Delete report error:', error);
    res.status(500).json({ error: 'Failed to delete report', message: error.message });
  }
});

router.ensureReportWorkflowSchema = ensureReportWorkflowSchema;

module.exports = router;
