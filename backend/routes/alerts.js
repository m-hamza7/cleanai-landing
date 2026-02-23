const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { verifyToken } = require('./auth');

// Get all alerts for a user
router.get('/', verifyToken, async (req, res) => {
  try {
    const user_id = req.user.user_id;

    const [alerts] = await db.query(
      `SELECT a.*, r.image_url, r.latitude, r.longitude 
       FROM alerts a
       LEFT JOIN reports r ON a.report_id = r.report_id
       WHERE a.user_id = ?
       ORDER BY a.triggered_at DESC
       LIMIT 50`,
      [user_id]
    );

    res.json({ alerts });

  } catch (error) {
    console.error('Get alerts error:', error);
    res.status(500).json({ error: 'Failed to fetch alerts', message: error.message });
  }
});

// Create new alert
router.post('/', verifyToken, async (req, res) => {
  try {
    const { user_id, report_id, alert_type, message, delivery_method } = req.body;

    const [result] = await db.query(
      `INSERT INTO alerts (user_id, report_id, alert_type, message, delivery_method, triggered_at) 
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [user_id, report_id, alert_type, message, delivery_method]
    );

    res.status(201).json({
      message: 'Alert created successfully',
      alert_id: result.insertId
    });

  } catch (error) {
    console.error('Create alert error:', error);
    res.status(500).json({ error: 'Failed to create alert', message: error.message });
  }
});

module.exports = router;
