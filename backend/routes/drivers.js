const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../config/database');
const { verifyToken } = require('./auth');

const router = express.Router();

const DRIVER_AREAS = [
  'Scheme33',
  'Malir 15',
  'Quadabad',
  'Shahrae faisal',
  'Tariq Road',
  'North Nazimabad',
];

const COMPLETION_DISTANCE_KM = 0.2;

const completionStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = './uploads/completions';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const completionUpload = multer({
  storage: completionStorage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed'));
  },
});

const toRadians = (value) => (value * Math.PI) / 180;

const haversineDistanceKm = (lat1, lon1, lat2, lon2) => {
  const radiusKm = 6371;
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return radiusKm * c;
};

// Register driver
router.post('/register', async (req, res) => {
  try {
    const { name, email = '', phone, area, password } = req.body;

    if (!name || !phone || !area || !password) {
      return res.status(400).json({ error: 'Name, phone, area, and password are required' });
    }

    if (!DRIVER_AREAS.includes(area)) {
      return res.status(400).json({ error: 'Invalid area selection' });
    }

    const [existingDrivers] = await db.query(
      'SELECT user_id FROM user WHERE phone = ? AND role = ? LIMIT 1',
      [phone, 'driver']
    );

    if (existingDrivers.length > 0) {
      return res.status(409).json({ error: 'Driver with this phone already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      `INSERT INTO user (name, email, phone, password_hash, role, area, created_at, status)
       VALUES (?, ?, ?, ?, 'driver', ?, NOW(), 1)`,
      [name, email || '', phone, passwordHash, area]
    );

    res.status(201).json({
      message: 'Driver registered successfully',
      driver_id: result.insertId,
    });
  } catch (error) {
    console.error('Driver register error:', error);
    res.status(500).json({ error: 'Driver registration failed', message: error.message });
  }
});

// Driver login
router.post('/login', async (req, res) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({ error: 'Phone and password are required' });
    }

    const [drivers] = await db.query(
      'SELECT * FROM user WHERE phone = ? AND role = ? AND status = 1',
      [phone, 'driver']
    );

    if (drivers.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const driver = drivers[0];
    const isValidPassword = await bcrypt.compare(password, driver.password_hash);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      {
        user_id: driver.user_id,
        email: driver.email,
        role: driver.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        user_id: driver.user_id,
        name: driver.name,
        email: driver.email,
        role: driver.role,
        phone: driver.phone,
        area: driver.area,
      },
    });
  } catch (error) {
    console.error('Driver login error:', error);
    res.status(500).json({ error: 'Login failed', message: error.message });
  }
});

// Admin: list drivers
router.get('/', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const [drivers] = await db.query(
      `SELECT user_id, name, email, phone, area, role, created_at, status
       FROM user
       WHERE role = 'driver'
       ORDER BY created_at DESC`
    );

    res.json({ drivers });
  } catch (error) {
    console.error('Get drivers error:', error);
    res.status(500).json({ error: 'Failed to fetch drivers', message: error.message });
  }
});

// Driver: list assignments
router.get('/assignments', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'driver') {
      return res.status(403).json({ error: 'Driver access required' });
    }

    const [assignments] = await db.query(
      `SELECT
        ct.task_id,
        ct.report_id,
        ct.assigned_at,
        ct.due_date,
        ct.completion_status,
        ct.completed_at,
        ct.completion_image_url,
        ct.completion_latitude,
        ct.completion_longitude,
        ct.completion_location,
        ct.completion_verified,
        ct.pickup_report_status,
        ct.pickup_report_action_at,
        ct.pickup_report_action_by,
        r.image_url,
        r.location,
        r.latitude,
        r.longitude,
        r.status,
        r.submitted_at,
        ai.waste_type,
        ai.severity_level
       FROM cleanup_tasks ct
       JOIN reports r ON ct.report_id = r.report_id
       LEFT JOIN ai_classification ai ON r.report_id = ai.report_id
       WHERE ct.driver_user_id = ?
       ORDER BY ct.assigned_at DESC`,
      [req.user.user_id]
    );

    res.json({ assignments });
  } catch (error) {
    console.error('Get assignments error:', error);
    res.status(500).json({ error: 'Failed to fetch assignments', message: error.message });
  }
});

// Driver: complete assignment
router.post('/assignments/:taskId/complete', verifyToken, completionUpload.single('image'), async (req, res) => {
  try {
    if (req.user.role !== 'driver') {
      return res.status(403).json({ error: 'Driver access required' });
    }

    const taskId = req.params.taskId;
    const { latitude, longitude, location } = req.body;

    if (!req.file || !latitude || !longitude) {
      return res.status(400).json({ error: 'Image, latitude, and longitude are required' });
    }

    const [tasks] = await db.query(
      `SELECT ct.task_id, ct.report_id, ct.driver_user_id, ct.completion_status,
              r.latitude as report_latitude, r.longitude as report_longitude
       FROM cleanup_tasks ct
       JOIN reports r ON ct.report_id = r.report_id
       WHERE ct.task_id = ?`,
      [taskId]
    );

    if (tasks.length === 0) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    const task = tasks[0];

    if (task.driver_user_id !== req.user.user_id) {
      return res.status(403).json({ error: 'This assignment is not assigned to you' });
    }

    if (task.completion_status === 'COMPLETED') {
      return res.status(400).json({ error: 'Assignment already completed' });
    }

    const reportLat = Number(task.report_latitude);
    const reportLon = Number(task.report_longitude);
    const completionLat = Number(latitude);
    const completionLon = Number(longitude);

    if ([reportLat, reportLon, completionLat, completionLon].some((value) => Number.isNaN(value))) {
      return res.status(400).json({ error: 'Invalid latitude or longitude values' });
    }

    const distanceKm = haversineDistanceKm(reportLat, reportLon, completionLat, completionLon);
    if (distanceKm > COMPLETION_DISTANCE_KM) {
      return res.status(400).json({
        error: 'Completion location does not match report location',
        distance_km: Number(distanceKm.toFixed(3)),
        max_distance_km: COMPLETION_DISTANCE_KM,
      });
    }

    const completionImageUrl = `/uploads/completions/${req.file.filename}`;
    const normalizedLocation = String(location || '').trim() || `${completionLat}, ${completionLon}`;

    await db.query(
      `UPDATE cleanup_tasks
       SET completion_status = 'COMPLETED',
           completed_at = NOW(),
           completion_image_url = ?,
           completion_latitude = ?,
           completion_longitude = ?,
           completion_location = ?,
           completion_verified = 1,
           pickup_report_status = 'waiting',
           pickup_report_action_at = NULL,
           pickup_report_action_by = NULL
       WHERE task_id = ?`,
      [completionImageUrl, completionLat, completionLon, normalizedLocation, taskId]
    );

    await db.query(
      `UPDATE reports
       SET status = 'completed',
           status_updated_at = NOW()
       WHERE report_id = ?`,
      [task.report_id]
    );

    await db.query(
      `INSERT INTO system_logs (user_id, action_type, description, created_at)
       VALUES (?, 'TASK_COMPLETE', 'Cleanup task completed by driver', NOW())`,
      [req.user.user_id]
    );

    res.json({ message: 'Assignment completed successfully' });
  } catch (error) {
    console.error('Complete assignment error:', error);
    res.status(500).json({ error: 'Failed to complete assignment', message: error.message });
  }
});

module.exports = router;
