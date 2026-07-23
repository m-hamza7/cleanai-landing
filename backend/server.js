const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS – allow all origins in development; restrict to FRONTEND_URL in production
const corsOptions = process.env.FRONTEND_URL
  ? {
      origin: [process.env.FRONTEND_URL, /\.vercel\.app$/],
      credentials: true,
    }
  : {};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// Import routes
const authRoutes = require('./routes/auth');
const reportRoutes = require('./routes/reports');
const userRoutes = require('./routes/users');
const alertRoutes = require('./routes/alerts');
const driverRoutes = require('./routes/drivers');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/users', userRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/drivers', driverRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'CleanAI Backend API is running',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: err.message 
  });
});

async function startServer() {
  try {
    if (typeof reportRoutes.ensureReportWorkflowSchema === 'function') {
      await reportRoutes.ensureReportWorkflowSchema();
      console.log('✅ Report workflow schema migration checked on startup');
    }

    if (typeof driverRoutes.ensureDriverRoutesSchema === 'function') {
      await driverRoutes.ensureDriverRoutesSchema();
      console.log('✅ Driver routes schema migration checked on startup');
    }

    app.listen(PORT, () => {
      console.log(`\n🚀 CleanAI Backend Server running on port ${PORT}`);
      console.log(`📊 API Endpoints:`);
      console.log(`   Health:   /api/health`);
      console.log(`   Auth:     /api/auth/*`);
      console.log(`   Reports:  /api/reports/*`);
      console.log(`   Users:    /api/users/*`);
      console.log(`   Alerts:   /api/alerts/*`);
      console.log(`   Drivers:  /api/drivers/*`);
      console.log(`   Routes:   /api/drivers/routes/*`);
      console.log(`   OSRM:     ${process.env.OSRM_BASE_URL || 'https://router.project-osrm.org'}\n`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
}

startServer();

module.exports = app;
