const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { verifyToken } = require('./auth');

// Get all users (admin only)
router.get('/', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const [users] = await db.query(
      'SELECT user_id, name, email, phone, role, created_at, status FROM user ORDER BY created_at DESC'
    );

    res.json({ users });

  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to fetch users', message: error.message });
  }
});

// Get user statistics
router.get('/:id/stats', verifyToken, async (req, res) => {
  try {
    const user_id = req.params.id;

    // Check permission
    if (req.user.role !== 'admin' && req.user.user_id != user_id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const [stats] = await db.query(
      `SELECT 
        COUNT(r.report_id) as total_reports,
        COUNT(CASE WHEN r.status = 'submitted' THEN 1 END) as submitted_reports,
        COUNT(CASE WHEN r.status = 'resolved' THEN 1 END) as resolved_reports
      FROM reports r
      WHERE r.user_id = ?`,
      [user_id]
    );

    res.json(stats[0]);

  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({ error: 'Failed to fetch user statistics', message: error.message });
  }
});

module.exports = router;
