# CleanAI Backend API

## 🚀 Quick Start

### Prerequisites
1. **XAMPP** - MySQL database server
2. **Node.js** (v16 or higher)
3. **npm** (comes with Node.js)

### Setup Steps

#### 1. Start XAMPP MySQL
- Open XAMPP Control Panel
- Click **Start** button next to MySQL
- Wait for the green indicator showing MySQL is running

#### 2. Configure Database
- Open browser and go to: `http://localhost/phpmyadmin`
- Your database `cleanai_db` should already exist with these tables:
  - `user` - User authentication
  - `reports` - Waste reports
  - `ai_classification` - AI detection results
  - `satellite_verification` - Satellite data
  - `cleanup_tasks` - Task management
  - `alerts` - Notifications
  - `system_logs` - Activity logs
  - `geospatial_zones` - Geographic zones

#### 3. Check Database Credentials
Edit `.env` file if needed:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=           # Leave empty for default XAMPP setup
DB_NAME=cleanai_db
DB_PORT=3306
```

#### 4. Install Dependencies (Already Done ✅)
```bash
npm install
```

#### 5. Start Backend Server
```bash
npm start           # Production mode
npm run dev         # Development mode with auto-restart
```

Server will run on: **http://localhost:5000**

---

## 📡 API Endpoints

### Authentication (`/api/auth`)
- **POST** `/api/auth/register` - Register new user
- **POST** `/api/auth/login` - Login user (returns JWT token)
- **GET** `/api/auth/me` - Get current user info (protected)

### Reports (`/api/reports`)
- **POST** `/api/reports` - Create waste report (with image upload)
- **GET** `/api/reports` - List reports (filtered by role)
- **GET** `/api/reports/:id` - Get single report
- **PATCH** `/api/reports/:id/status` - Update report status (admin)
- **POST** `/api/reports/:id/classify` - Add AI classification
- **DELETE** `/api/reports/:id` - Delete report (admin)

### Users (`/api/users`)
- **GET** `/api/users` - List all users (admin only)
- **GET** `/api/users/:id/stats` - User statistics

### Alerts (`/api/alerts`)
- **GET** `/api/alerts` - Get user alerts
- **POST** `/api/alerts` - Create new alert

### Health Check
- **GET** `/api/health` - Server status

---

## 🧪 Testing the API

### Test Database Connection
```bash
node test-db.js
```

### Test API with cURL

#### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"testuser\",\"email\":\"test@example.com\",\"password\":\"password123\",\"full_name\":\"Test User\",\"phone\":\"+923001234567\",\"address\":\"Test Address\"}"
```

#### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"hamza\",\"password\":\"hamza\"}"
```

#### Create Report (with authentication)
```bash
curl -X POST http://localhost:5000/api/reports \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "waste_type=plastic" \
  -F "location=Karachi University" \
  -F "latitude=24.9470" \
  -F "longitude=67.1388" \
  -F "description=Plastic bottles near gate" \
  -F "image=@path/to/image.jpg"
```

---

## 🔧 Troubleshooting

### Database Connection Failed
**Error:** `Access denied for user 'root'@'localhost'`

**Solutions:**
1. Make sure XAMPP MySQL is running (green in XAMPP Control Panel)
2. Check if database password is set in XAMPP:
   - Open phpMyAdmin: `http://localhost/phpmyadmin`
   - If it asks for password, update `DB_PASSWORD` in `.env` file
3. Verify database name `cleanai_db` exists in phpMyAdmin

### Port 5000 Already in Use
**Error:** `EADDRINUSE: address already in use :::5000`

**Solutions:**
1. Stop other server running on port 5000
2. Or change `PORT` in `.env` file to another port (e.g., 5001)

### Module Not Found
**Error:** `Cannot find module 'express'`

**Solution:**
```bash
npm install
```

---

## 📁 Project Structure

```
backend/
├── config/
│   └── database.js          # MySQL connection pool
├── routes/
│   ├── auth.js              # Authentication endpoints
│   ├── reports.js           # Waste reports CRUD + file upload
│   ├── users.js             # User management
│   └── alerts.js            # Notifications
├── uploads/                 # Image storage
│   └── reports/
├── .env                     # Environment variables
├── package.json            # Dependencies
├── server.js               # Express app entry point
└── README.md               # This file
```

---

## 🔐 Security Features

- **JWT Authentication** - Secure token-based auth
- **Password Hashing** - bcrypt with 10 salt rounds
- **Role-Based Access Control** - Admin vs Citizen permissions
- **File Upload Validation** - Size limits (10MB) and type checking
- **SQL Injection Protection** - Parameterized queries with mysql2
- **CORS Enabled** - Cross-origin requests allowed for frontend

---

## 🎯 Next Steps

1. ✅ Backend API is running
2. 🔄 **Connect Frontend** - Update frontend to use API instead of localStorage
3. 🤖 **Integrate YOLO Model** - Add AI waste detection service
4. 📱 **Add GPS** - Browser geolocation in frontend
5. ⚡ **Real-time Updates** - WebSocket support with Socket.IO
6. 🚀 **Deploy** - Docker + Cloud hosting

---

## 📞 Support

If you encounter issues:
1. Check XAMPP MySQL status
2. Review `.env` file configuration
3. Check terminal logs for specific error messages
4. Verify all npm dependencies are installed

---

**Version:** 1.0.0  
**Last Updated:** February 2026
