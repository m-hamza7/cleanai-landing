const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../config/database');
const { verifyToken } = require('./auth');
const { getDrivingRoute, getOptimizedTrip } = require('../services/osrm');

const router = express.Router();

let driverRoutesSchemaEnsured = false;
let driverRoutesSchemaEnsuringPromise = null;

async function ensureDriverRoutesSchema() {
  if (driverRoutesSchemaEnsured) return;

  if (driverRoutesSchemaEnsuringPromise) {
    await driverRoutesSchemaEnsuringPromise;
    return;
  }

  driverRoutesSchemaEnsuringPromise = (async () => {
    await db.query(`
      CREATE TABLE IF NOT EXISTS driver_routes (
        route_id           SERIAL PRIMARY KEY,
        driver_user_id     INTEGER      NOT NULL REFERENCES users(user_id),
        route_type         VARCHAR(20)  NOT NULL,
        task_ids           JSONB        NOT NULL DEFAULT '[]',
        origin_lat         FLOAT        NOT NULL,
        origin_lng         FLOAT        NOT NULL,
        destination_lat    FLOAT        NOT NULL,
        destination_lng    FLOAT        NOT NULL,
        ordered_stops      JSONB        NOT NULL DEFAULT '[]',
        geometry           JSONB,
        distance_meters    FLOAT        NOT NULL DEFAULT 0,
        duration_seconds   FLOAT        NOT NULL DEFAULT 0,
        status             VARCHAR(20)  NOT NULL DEFAULT 'planned',
        started_at         TIMESTAMP,
        completed_at       TIMESTAMP,
        created_at         TIMESTAMP    NOT NULL DEFAULT NOW()
      )
    `);
    await db.query(
      `CREATE INDEX IF NOT EXISTS idx_driver_routes_driver ON driver_routes(driver_user_id)`
    );
    await db.query(
      `CREATE INDEX IF NOT EXISTS idx_driver_routes_status ON driver_routes(status)`
    );
    driverRoutesSchemaEnsured = true;
  })();

  try {
    await driverRoutesSchemaEnsuringPromise;
  } finally {
    driverRoutesSchemaEnsuringPromise = null;
  }
}

function parseJsonField(value, fallback) {
  if (value == null) return fallback;
  if (typeof value === 'object') return value;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function mapDriverRouteRow(row) {
  return {
    ...row,
    task_ids: parseJsonField(row.task_ids, []),
    ordered_stops: parseJsonField(row.ordered_stops, []),
    geometry: parseJsonField(row.geometry, null),
    distance_meters: Number(row.distance_meters) || 0,
    duration_seconds: Number(row.duration_seconds) || 0,
    origin_lat: Number(row.origin_lat),
    origin_lng: Number(row.origin_lng),
    destination_lat: Number(row.destination_lat),
    destination_lng: Number(row.destination_lng),
  };
}

async function insertDriverRoute(payload) {
  const [rows] = await db.query(
    `INSERT INTO driver_routes (
      driver_user_id, route_type, task_ids, origin_lat, origin_lng,
      destination_lat, destination_lng, ordered_stops, geometry,
      distance_meters, duration_seconds, status, created_at
    ) VALUES (?, ?, ?::jsonb, ?, ?, ?, ?, ?::jsonb, ?::jsonb, ?, ?, 'planned', NOW())
    RETURNING *`,
    [
      payload.driver_user_id,
      payload.route_type,
      JSON.stringify(payload.task_ids),
      payload.origin_lat,
      payload.origin_lng,
      payload.destination_lat,
      payload.destination_lng,
      JSON.stringify(payload.ordered_stops),
      JSON.stringify(payload.geometry),
      payload.distance_meters,
      payload.duration_seconds,
    ]
  );
  return mapDriverRouteRow(rows[0]);
}

async function fetchActiveAssignmentStops(driverUserId, taskIdsFilter = null) {
  let sql = `
    SELECT
      ct.task_id,
      ct.report_id,
      ct.completion_status,
      ct.completed_at,
      r.latitude,
      r.longitude,
      r.location
    FROM cleanup_tasks ct
    JOIN reports r ON ct.report_id = r.report_id
    WHERE ct.driver_user_id = ?
  `;
  const params = [driverUserId];

  if (Array.isArray(taskIdsFilter) && taskIdsFilter.length > 0) {
    const placeholders = taskIdsFilter.map(() => '?').join(', ');
    sql += ` AND ct.task_id IN (${placeholders})`;
    params.push(...taskIdsFilter);
  }

  sql += ' ORDER BY ct.assigned_at ASC';

  const [rows] = await db.query(sql, params);

  return rows.filter((row) => {
    const status = String(row.completion_status || '').trim().toUpperCase();
    if (status === 'COMPLETED' || status === 'COMPLETE') return false;
    if (row.completed_at) return false;
    const lat = Number(row.latitude);
    const lng = Number(row.longitude);
    return !Number.isNaN(lat) && !Number.isNaN(lng);
  });
}

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
    if (mimetype && extname) return cb(null, true);
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
      `SELECT user_id FROM users WHERE phone = ? AND role = 'driver' LIMIT 1`,
      [phone]
    );

    if (existingDrivers.length > 0) {
      return res.status(409).json({ error: 'Driver with this phone already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const [rows] = await db.query(
      `INSERT INTO users (name, email, phone, password_hash, role, area, created_at, status)
       VALUES (?, ?, ?, ?, 'driver', ?, NOW(), TRUE) RETURNING user_id`,
      [name, email || '', phone, passwordHash, area]
    );

    res.status(201).json({
      message: 'Driver registered successfully',
      driver_id: rows[0].user_id,
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
      `SELECT * FROM users WHERE phone = ? AND role = 'driver' AND status = TRUE`,
      [phone]
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
       FROM users
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

    if ([reportLat, reportLon, completionLat, completionLon].some((v) => Number.isNaN(v))) {
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
           completion_verified = TRUE,
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

// Driver: plan single-task route from current location
router.post('/routes/single', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'driver') {
      return res.status(403).json({ error: 'Driver access required' });
    }

    const taskId = Number(req.body.task_id);
    const originLat = Number(req.body.origin_lat);
    const originLng = Number(req.body.origin_lng);

    if (!taskId || Number.isNaN(originLat) || Number.isNaN(originLng)) {
      return res.status(400).json({ error: 'task_id, origin_lat, and origin_lng are required' });
    }

    const stops = await fetchActiveAssignmentStops(req.user.user_id, [taskId]);
    if (stops.length === 0) {
      return res.status(404).json({ error: 'Active assignment not found for this task' });
    }

    const stop = stops[0];
    const destLat = Number(stop.latitude);
    const destLng = Number(stop.longitude);

    const osrm = await getDrivingRoute(
      { lat: originLat, lng: originLng },
      { lat: destLat, lng: destLng }
    );

    const orderedStops = [
      {
        task_id: stop.task_id,
        report_id: stop.report_id,
        lat: destLat,
        lng: destLng,
        location: stop.location || null,
        order: 1,
      },
    ];

    const route = await insertDriverRoute({
      driver_user_id: req.user.user_id,
      route_type: 'single',
      task_ids: [stop.task_id],
      origin_lat: originLat,
      origin_lng: originLng,
      destination_lat: destLat,
      destination_lng: destLng,
      ordered_stops: orderedStops,
      geometry: { type: 'LineString', coordinates: osrm.geometry },
      distance_meters: osrm.distance,
      duration_seconds: osrm.duration,
    });

    await db.query(
      `INSERT INTO system_logs (user_id, action_type, description, created_at)
       VALUES (?, 'ROUTE_PLAN_SINGLE', ?, NOW())`,
      [req.user.user_id, `Planned single route for task ${stop.task_id}`]
    );

    res.status(201).json({ route });
  } catch (error) {
    console.error('Plan single route error:', error);
    res.status(500).json({
      error: 'Failed to plan route',
      message: error.message,
    });
  }
});

// Driver: plan multi-stop optimized route for active pickups
router.post('/routes/multi', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'driver') {
      return res.status(403).json({ error: 'Driver access required' });
    }

    const originLat = Number(req.body.origin_lat);
    const originLng = Number(req.body.origin_lng);
    const requestedTaskIds = Array.isArray(req.body.task_ids)
      ? req.body.task_ids.map(Number).filter((id) => !Number.isNaN(id))
      : null;

    if (Number.isNaN(originLat) || Number.isNaN(originLng)) {
      return res.status(400).json({ error: 'origin_lat and origin_lng are required' });
    }

    const stops = await fetchActiveAssignmentStops(req.user.user_id, requestedTaskIds);
    if (stops.length === 0) {
      return res.status(400).json({ error: 'No active assignments available to route' });
    }

    if (stops.length === 1) {
      const only = stops[0];
      const destLat = Number(only.latitude);
      const destLng = Number(only.longitude);
      const osrm = await getDrivingRoute(
        { lat: originLat, lng: originLng },
        { lat: destLat, lng: destLng }
      );

      const orderedStops = [
        {
          task_id: only.task_id,
          report_id: only.report_id,
          lat: destLat,
          lng: destLng,
          location: only.location || null,
          order: 1,
        },
      ];

      const route = await insertDriverRoute({
        driver_user_id: req.user.user_id,
        route_type: 'multi',
        task_ids: [only.task_id],
        origin_lat: originLat,
        origin_lng: originLng,
        destination_lat: destLat,
        destination_lng: destLng,
        ordered_stops: orderedStops,
        geometry: { type: 'LineString', coordinates: osrm.geometry },
        distance_meters: osrm.distance,
        duration_seconds: osrm.duration,
      });

      return res.status(201).json({ route });
    }

    const stopCoords = stops.map((s) => ({
      lat: Number(s.latitude),
      lng: Number(s.longitude),
    }));

    const osrm = await getOptimizedTrip(
      { lat: originLat, lng: originLng },
      stopCoords
    );

    const orderedStops = (osrm.stop_order || stops.map((_, i) => i)).map((stopIndex, orderIdx) => {
      const stop = stops[stopIndex];
      return {
        task_id: stop.task_id,
        report_id: stop.report_id,
        lat: Number(stop.latitude),
        lng: Number(stop.longitude),
        location: stop.location || null,
        order: orderIdx + 1,
      };
    });

    const lastStop = orderedStops[orderedStops.length - 1];

    const route = await insertDriverRoute({
      driver_user_id: req.user.user_id,
      route_type: 'multi',
      task_ids: orderedStops.map((s) => s.task_id),
      origin_lat: originLat,
      origin_lng: originLng,
      destination_lat: lastStop.lat,
      destination_lng: lastStop.lng,
      ordered_stops: orderedStops,
      geometry: { type: 'LineString', coordinates: osrm.geometry },
      distance_meters: osrm.distance,
      duration_seconds: osrm.duration,
    });

    await db.query(
      `INSERT INTO system_logs (user_id, action_type, description, created_at)
       VALUES (?, 'ROUTE_PLAN_MULTI', ?, NOW())`,
      [req.user.user_id, `Planned multi route covering ${orderedStops.length} stops`]
    );

    res.status(201).json({ route });
  } catch (error) {
    console.error('Plan multi route error:', error);
    res.status(500).json({
      error: 'Failed to plan multi-stop route',
      message: error.message,
    });
  }
});

// Driver: list own routes
router.get('/routes/mine', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'driver') {
      return res.status(403).json({ error: 'Driver access required' });
    }

    const [rows] = await db.query(
      `SELECT * FROM driver_routes
       WHERE driver_user_id = ?
       ORDER BY created_at DESC
       LIMIT 50`,
      [req.user.user_id]
    );

    res.json({ routes: rows.map(mapDriverRouteRow) });
  } catch (error) {
    console.error('Get my routes error:', error);
    res.status(500).json({ error: 'Failed to fetch routes', message: error.message });
  }
});

// Admin: list all driver routes
router.get('/routes', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const [rows] = await db.query(
      `SELECT
        dr.*,
        u.name as driver_name,
        u.phone as driver_phone,
        u.area as driver_area
       FROM driver_routes dr
       JOIN users u ON dr.driver_user_id = u.user_id
       ORDER BY dr.created_at DESC
       LIMIT 200`
    );

    res.json({ routes: rows.map(mapDriverRouteRow) });
  } catch (error) {
    console.error('Get all routes error:', error);
    res.status(500).json({ error: 'Failed to fetch routes', message: error.message });
  }
});

// Driver: start trip log
router.post('/routes/:routeId/start', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'driver') {
      return res.status(403).json({ error: 'Driver access required' });
    }

    const routeId = Number(req.params.routeId);
    const [rows] = await db.query(
      `SELECT * FROM driver_routes WHERE route_id = ?`,
      [routeId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Route not found' });
    }

    const existing = rows[0];
    if (existing.driver_user_id !== req.user.user_id) {
      return res.status(403).json({ error: 'This route does not belong to you' });
    }

    if (existing.status === 'completed' || existing.status === 'cancelled') {
      return res.status(400).json({ error: `Cannot start a ${existing.status} route` });
    }

    const [updated] = await db.query(
      `UPDATE driver_routes
       SET status = 'started', started_at = COALESCE(started_at, NOW())
       WHERE route_id = ?
       RETURNING *`,
      [routeId]
    );

    await db.query(
      `INSERT INTO system_logs (user_id, action_type, description, created_at)
       VALUES (?, 'ROUTE_START', ?, NOW())`,
      [req.user.user_id, `Started route ${routeId}`]
    );

    res.json({ route: mapDriverRouteRow(updated[0]) });
  } catch (error) {
    console.error('Start route error:', error);
    res.status(500).json({ error: 'Failed to start route', message: error.message });
  }
});

// Driver: complete trip log
router.post('/routes/:routeId/complete', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'driver') {
      return res.status(403).json({ error: 'Driver access required' });
    }

    const routeId = Number(req.params.routeId);
    const [rows] = await db.query(
      `SELECT * FROM driver_routes WHERE route_id = ?`,
      [routeId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Route not found' });
    }

    const existing = rows[0];
    if (existing.driver_user_id !== req.user.user_id) {
      return res.status(403).json({ error: 'This route does not belong to you' });
    }

    if (existing.status === 'cancelled') {
      return res.status(400).json({ error: 'Cannot complete a cancelled route' });
    }

    const [updated] = await db.query(
      `UPDATE driver_routes
       SET status = 'completed',
           started_at = COALESCE(started_at, NOW()),
           completed_at = NOW()
       WHERE route_id = ?
       RETURNING *`,
      [routeId]
    );

    await db.query(
      `INSERT INTO system_logs (user_id, action_type, description, created_at)
       VALUES (?, 'ROUTE_COMPLETE', ?, NOW())`,
      [req.user.user_id, `Completed route ${routeId}`]
    );

    res.json({ route: mapDriverRouteRow(updated[0]) });
  } catch (error) {
    console.error('Complete route error:', error);
    res.status(500).json({ error: 'Failed to complete route', message: error.message });
  }
});

router.ensureDriverRoutesSchema = ensureDriverRoutesSchema;

module.exports = router;
