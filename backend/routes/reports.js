const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../config/database');
const { verifyToken } = require('./auth');

// AI Classification Service URL
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:5001';

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
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Helper: call AI classification service
async function classifyImage(imagePath) {
  try {
    const absolutePath = path.resolve(imagePath);
    console.log(`🧠 Sending image to AI service: ${absolutePath}`);

    const response = await fetch(`${AI_SERVICE_URL}/classify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image_path: absolutePath }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || `AI service returned ${response.status}`);
    }

    const data = await response.json();
    console.log(`✅ AI classification: ${data.waste_type} (${(data.confidence * 100).toFixed(1)}%) severity=${data.severity_level}`);
    return data;
  } catch (error) {
    console.error('⚠️  AI classification failed:', error.message);
    return null; // non-blocking — report is still saved
  }
}

// Create new report
router.post('/', verifyToken, upload.single('image'), async (req, res) => {
  try {
    const { latitude, longitude, gps_accuracy } = req.body;
    const user_id = req.user.user_id;

    // Validate input
    if (!req.file || !latitude || !longitude) {
      return res.status(400).json({ error: 'Image, latitude, and longitude are required' });
    }

    const image_url = `/uploads/reports/${req.file.filename}`;

    // Insert report
    const [result] = await db.query(
      `INSERT INTO reports (user_id, image_url, latitude, longitude, gps_accuracy, submitted_at, status) 
       VALUES (?, ?, ?, ?, ?, NOW(), 'submitted')`,
      [user_id, image_url, latitude, longitude, gps_accuracy || 0]
    );

    const report_id = result.insertId;

    // ── AI Classification (non-blocking for the response) ──────
    let aiResult = null;
    const imageDiskPath = `.${image_url}`; // e.g. ./uploads/reports/xxx.jpg
    aiResult = await classifyImage(imageDiskPath);

    if (aiResult && aiResult.waste_type && aiResult.waste_type !== 'Unknown') {
      await db.query(
        `INSERT INTO ai_classification (report_id, waste_type, severity_level, confidence_score, processed_at) 
         VALUES (?, ?, ?, ?, NOW())`,
        [report_id, aiResult.waste_type, aiResult.severity_level, aiResult.confidence]
      );
      console.log(`📝 AI classification saved for report #${report_id}`);
    }

    // Log action
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
        r.report_id, r.user_id, r.image_url, r.latitude, r.longitude, 
        r.gps_accuracy, r.submitted_at, r.status,
        u.name as user_name, u.email as user_email,
        ai.waste_type, ai.severity_level, ai.confidence_score,
        ct.assigned_to, ct.completion_status, ct.completed_at
      FROM reports r
      LEFT JOIN user u ON r.user_id = u.user_id
      LEFT JOIN ai_classification ai ON r.report_id = ai.report_id
      LEFT JOIN cleanup_tasks ct ON r.report_id = ct.report_id
    `;

    const params = [];

    // Filter by user if not admin
    if (role !== 'admin') {
      query += ' WHERE r.user_id = ?';
      params.push(user_id);
    }

    // Filter by status if provided
    if (status) {
      query += role === 'admin' ? ' WHERE r.status = ?' : ' AND r.status = ?';
      params.push(status);
    }

    query += ' ORDER BY r.submitted_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const [reports] = await db.query(query, params);

    res.json({
      reports,
      count: reports.length
    });

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
        ct.assigned_to, ct.completion_status, ct.completed_at
      FROM reports r
      LEFT JOIN user u ON r.user_id = u.user_id
      LEFT JOIN ai_classification ai ON r.report_id = ai.report_id
      LEFT JOIN cleanup_tasks ct ON r.report_id = ct.report_id
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
    const { status } = req.body;

    const validStatuses = ['submitted', 'dispatched', 'resolved', 'rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    await db.query(
      'UPDATE reports SET status = ? WHERE report_id = ?',
      [status, report_id]
    );

    // Log action
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

// Add AI classification to report
router.post('/:id/classify', verifyToken, async (req, res) => {
  try {
    const report_id = req.params.id;
    const { waste_type, severity_level, confidence_score } = req.body;

    const [result] = await db.query(
      `INSERT INTO ai_classification (report_id, waste_type, severity_level, confidence_score, processed_at) 
       VALUES (?, ?, ?, ?, NOW())`,
      [report_id, waste_type, severity_level, confidence_score || 0]
    );

    res.status(201).json({
      message: 'AI classification added successfully',
      classification_id: result.insertId
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

    // Get image URL to delete file
    const [reports] = await db.query('SELECT image_url FROM reports WHERE report_id = ?', [report_id]);
    
    if (reports.length > 0) {
      const imagePath = `.${reports[0].image_url}`;
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    // Delete report (cascading deletes will handle related records)
    await db.query('DELETE FROM reports WHERE report_id = ?', [report_id]);

    res.json({ message: 'Report deleted successfully' });

  } catch (error) {
    console.error('Delete report error:', error);
    res.status(500).json({ error: 'Failed to delete report', message: error.message });
  }
});

module.exports = router;
