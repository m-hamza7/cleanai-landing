# 🏗️ CleanAI System Architecture

## 📐 Current Architecture (Prototype)

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (Next.js 14)                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Homepage   │  │  Login Page  │  │ User Dashboard│          │
│  │      /       │  │    /login    │  │/user-dashboard│          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐                             │
│  │Admin Dashboard│ │Research Papers│                            │
│  │  /dashboard  │  │/research-papers│                           │
│  └──────────────┘  └──────────────┘                             │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│                    COMPONENT LIBRARY                             │
│  ┌────────────────────────────────────────────────────┐         │
│  │  shadcn/ui + Radix UI + Tailwind CSS              │         │
│  │  - Cards, Buttons, Forms, Badges, Alerts          │         │
│  │  - Navigation, Dialogs, Tooltips                   │         │
│  └────────────────────────────────────────────────────┘         │
├─────────────────────────────────────────────────────────────────┤
│                    STATE MANAGEMENT                              │
│  ┌────────────────────────────────────────────────────┐         │
│  │  React useState + useEffect                        │         │
│  │  - Form states                                      │         │
│  │  - Upload states                                    │         │
│  │  - Report states                                    │         │
│  └────────────────────────────────────────────────────┘         │
├─────────────────────────────────────────────────────────────────┤
│                    DATA PERSISTENCE                              │
│  ┌────────────────────────────────────────────────────┐         │
│  │  Browser localStorage (Prototype)                  │         │
│  │  Keys:                                             │         │
│  │  - user: { username, role }                        │         │
│  │  - wasteReports: WasteReport[]                     │         │
│  │  - adminWasteReports: WasteReport[]                │         │
│  └────────────────────────────────────────────────────┘         │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Production Architecture (Planned)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              CLIENT LAYER                                │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐         │
│  │   Web App       │  │  Mobile App     │  │   Admin Panel   │         │
│  │  (Next.js)      │  │ (React Native)  │  │    (Next.js)    │         │
│  │                 │  │                 │  │                 │         │
│  │  - Homepage     │  │  - Camera       │  │  - Dashboard    │         │
│  │  - Login        │  │  - GPS Auto     │  │  - Reports      │         │
│  │  - Upload       │  │  - Push Notify  │  │  - Analytics    │         │
│  │  - Track        │  │  - Offline Mode │  │  - Fleet Mgmt   │         │
│  └────────┬────────┘  └────────┬────────┘  └────────┬────────┘         │
│           │                    │                     │                  │
│           └────────────────────┼─────────────────────┘                  │
│                                │                                        │
├────────────────────────────────┼────────────────────────────────────────┤
│                                │     API GATEWAY                        │
│                        ┌───────┴───────┐                                │
│                        │  Load Balancer │                               │
│                        │    (Nginx)     │                               │
│                        └───────┬───────┘                                │
├────────────────────────────────┼────────────────────────────────────────┤
│                                │     BACKEND LAYER                      │
│                        ┌───────┴───────┐                                │
│                        │   REST API     │                               │
│                        │  (FastAPI /    │                               │
│                        │   Node.js)     │                               │
│                        └───────┬───────┘                                │
│                                │                                        │
│           ┌────────────────────┼────────────────────┐                   │
│           │                    │                    │                   │
│  ┌────────┴────────┐  ┌────────┴────────┐  ┌───────┴──────┐            │
│  │  Auth Service   │  │  Report Service │  │  AI Service  │            │
│  │                 │  │                 │  │              │            │
│  │  - JWT tokens   │  │  - CRUD ops     │  │  - YOLOv8    │            │
│  │  - OAuth        │  │  - Status mgmt  │  │  - R-CNN     │            │
│  │  - RBAC         │  │  - Validation   │  │  - Detection │            │
│  └─────────────────┘  └─────────────────┘  └──────────────┘            │
│                                                                          │
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────┐            │
│  │  Fleet Service  │  │  Notify Service │  │  GPS Service │            │
│  │                 │  │                 │  │              │            │
│  │  - Routing      │  │  - Push (FCM)   │  │  - Geocoding │            │
│  │  - Optimization │  │  - Email (SES)  │  │  - Reverse   │            │
│  │  - Tracking     │  │  - SMS (Twilio) │  │  - Maps API  │            │
│  └─────────────────┘  └─────────────────┘  └──────────────┘            │
│                                                                          │
├──────────────────────────────────────────────────────────────────────────┤
│                           DATA LAYER                                     │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────┐            │
│  │   PostgreSQL    │  │     Redis       │  │   MongoDB    │            │
│  │                 │  │                 │  │              │            │
│  │  - Users        │  │  - Sessions     │  │  - Logs      │            │
│  │  - Reports      │  │  - Cache        │  │  - Analytics │            │
│  │  - Fleet        │  │  - Queue        │  │  - Metrics   │            │
│  │  - Locations    │  │  - Real-time    │  │              │            │
│  └─────────────────┘  └─────────────────┘  └──────────────┘            │
│                                                                          │
│  ┌─────────────────────────────────────────────────────┐                │
│  │              Cloud Storage (AWS S3)                 │                │
│  │  - Uploaded images                                  │                │
│  │  - Before/after photos                              │                │
│  │  - AI model weights                                 │                │
│  │  - Backups                                          │                │
│  └─────────────────────────────────────────────────────┘                │
│                                                                          │
├──────────────────────────────────────────────────────────────────────────┤
│                        INTEGRATION LAYER                                 │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────┐            │
│  │  Satellite API  │  │   Weather API   │  │  Maps API    │            │
│  │  (Sentinel)     │  │  (OpenWeather)  │  │  (Google)    │            │
│  └─────────────────┘  └─────────────────┘  └──────────────┘            │
│                                                                          │
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────┐            │
│  │  SMS Gateway    │  │  Email Service  │  │  Analytics   │            │
│  │  (Twilio)       │  │  (SendGrid)     │  │  (Mixpanel)  │            │
│  └─────────────────┘  └─────────────────┘  └──────────────┘            │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Data Flow Diagrams

### User Report Submission Flow

```
┌──────────┐
│  Citizen │
└────┬─────┘
     │ 1. Open app
     ▼
┌─────────────────┐
│  Login Page     │
│  Authenticate   │
└────┬────────────┘
     │ 2. Login successful
     ▼
┌─────────────────┐
│ User Dashboard  │
│                 │
│ ┌─────────────┐ │
│ │Upload Image │ │◄─── 3. Select image from device
│ └─────────────┘ │
│                 │
│ ┌─────────────┐ │
│ │Select Type  │ │◄─── 4. Choose waste category
│ └─────────────┘ │
│                 │
│ ┌─────────────┐ │
│ │Enter Loc    │ │◄─── 5. Input location (or auto-GPS)
│ └─────────────┘ │
│                 │
│ ┌─────────────┐ │
│ │Add Details  │ │◄─── 6. Optional description
│ └─────────────┘ │
└────┬────────────┘
     │ 7. Submit report
     ▼
┌─────────────────┐
│   Backend API   │
│                 │
│  - Validate     │
│  - Store image  │
│  - Save data    │
│  - Run AI       │◄─── [Future: YOLOv8 analysis]
└────┬────────────┘
     │ 8. Confirmation
     ▼
┌─────────────────┐
│   Database      │
│                 │
│  INSERT report  │
│  UPDATE user    │
│  NOTIFY admins  │
└────┬────────────┘
     │ 9. Real-time update
     ▼
┌─────────────────┐
│ Admin Dashboard │
│                 │
│  New report     │
│  appears!       │
└─────────────────┘
```

### Admin Response Flow

```
┌──────────┐
│  Admin   │
└────┬─────┘
     │ 1. Views dashboard
     ▼
┌─────────────────────┐
│ Citizen Reports     │
│ Panel               │
│                     │
│ ┌─────────────────┐ │
│ │ Report #12345   │ │
│ │ Status: NEW     │ │
│ │ [Dispatch Team] │ │◄─── 2. Click action
│ └─────────────────┘ │
└────┬────────────────┘
     │ 3. Update status
     ▼
┌─────────────────────┐
│   Backend API       │
│                     │
│  - Validate admin   │
│  - Update status    │
│  - Assign fleet     │
│  - Notify citizen   │
└────┬────────────────┘
     │ 4. Update DB
     ▼
┌─────────────────────┐
│   Database          │
│                     │
│  UPDATE status      │
│  INSERT event log   │
│  TRIGGER notification│
└────┬────────────────┘
     │ 5. Notify fleet & citizen
     ├────────────────────┬──────────────┐
     ▼                    ▼              ▼
┌─────────┐      ┌──────────────┐   ┌─────────┐
│ Fleet   │      │   Citizen    │   │  Logs   │
│ Truck #2│      │   App        │   │ Archive │
│ Assigned│      │   Updated    │   │  Event  │
└─────────┘      └──────────────┘   └─────────┘
```

---

## 🧩 Component Architecture

### Frontend Component Hierarchy

```
App (Root)
│
├── Layout
│   ├── Navigation
│   │   ├── Logo
│   │   ├── NavLinks
│   │   └── AuthButtons
│   │
│   └── Footer
│
├── Pages
│   │
│   ├── HomePage
│   │   ├── HeroSection
│   │   ├── ProblemIdentificationSection
│   │   ├── FeaturesSection
│   │   ├── WorkflowSection
│   │   ├── TechnologySection
│   │   └── ImpactSection
│   │
│   ├── LoginPage
│   │   └── LoginForm
│   │       ├── Input (Username)
│   │       ├── Input (Password)
│   │       ├── Button (Submit)
│   │       └── Alert (Errors)
│   │
│   ├── UserDashboardPage
│   │   ├── Header
│   │   │   ├── Logo
│   │   │   ├── UserInfo
│   │   │   └── LogoutButton
│   │   │
│   │   ├── ReportForm
│   │   │   ├── ImageUpload
│   │   │   │   ├── DropZone
│   │   │   │   └── ImagePreview
│   │   │   ├── WasteTypeSelect
│   │   │   ├── LocationInput
│   │   │   ├── DescriptionTextarea
│   │   │   └── SubmitButton
│   │   │
│   │   └── ReportsSidebar
│   │       ├── ReportsHeader
│   │       └── ReportsList
│   │           └── ReportCard[]
│   │
│   ├── AdminDashboardPage
│   │   ├── DashboardHeader
│   │   ├── StatsOverview
│   │   │   └── StatCard[] (x4)
│   │   ├── WasteDetectionMap
│   │   ├── AlertsPanel
│   │   ├── FleetManagement
│   │   ├── FloodRiskAssessment
│   │   └── UserReportsPanel ⭐ NEW
│   │       ├── ReportsHeader
│   │       └── ReportsList
│   │           └── UserReportCard[]
│   │               ├── ReportImage
│   │               ├── ReportDetails
│   │               ├── StatusBadge
│   │               └── ActionButtons
│   │
│   └── ResearchPapersPage
│       └── PapersList
│
└── UI Components Library
    ├── Button
    ├── Card
    ├── Badge
    ├── Input
    ├── Select
    ├── Textarea
    ├── Alert
    ├── Dialog
    ├── ScrollArea
    └── [30+ more components]
```

---

## 🗄️ Database Schema (Production)

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'citizen',
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_login TIMESTAMP,
  is_active BOOLEAN DEFAULT true,
  reports_submitted INTEGER DEFAULT 0,
  reports_resolved INTEGER DEFAULT 0
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
```

### Reports Table
```sql
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  image_url VARCHAR(500) NOT NULL,
  image_key VARCHAR(255) NOT NULL,
  waste_type VARCHAR(50) NOT NULL,
  ai_detected_type VARCHAR(50),
  ai_confidence DECIMAL(5,2),
  location_lat DECIMAL(10,8) NOT NULL,
  location_lng DECIMAL(11,8) NOT NULL,
  location_address TEXT NOT NULL,
  location_city VARCHAR(100),
  location_country VARCHAR(100) DEFAULT 'Pakistan',
  description TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'submitted',
  priority VARCHAR(10) DEFAULT 'medium',
  dispatched_to UUID REFERENCES fleet(id),
  dispatched_at TIMESTAMP,
  resolved_at TIMESTAMP,
  resolved_by UUID REFERENCES users(id),
  verification_image_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_reports_user_id ON reports(user_id);
CREATE INDEX idx_reports_status ON reports(status);
CREATE INDEX idx_reports_created_at ON reports(created_at DESC);
CREATE INDEX idx_reports_location ON reports USING GIST (
  ll_to_earth(location_lat, location_lng)
);
```

### Fleet Table
```sql
CREATE TABLE fleet (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_number VARCHAR(20) UNIQUE NOT NULL,
  driver_id UUID REFERENCES users(id),
  driver_name VARCHAR(100),
  current_lat DECIMAL(10,8),
  current_lng DECIMAL(11,8),
  status VARCHAR(20) DEFAULT 'idle',
  capacity INTEGER DEFAULT 100,
  current_load INTEGER DEFAULT 0,
  last_updated TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_fleet_status ON fleet(status);
CREATE INDEX idx_fleet_driver ON fleet(driver_id);
```

### Events Log Table
```sql
CREATE TABLE event_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID REFERENCES reports(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  event_type VARCHAR(50) NOT NULL,
  old_status VARCHAR(20),
  new_status VARCHAR(20),
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_event_logs_report_id ON event_logs(report_id);
CREATE INDEX idx_event_logs_event_type ON event_logs(event_type);
CREATE INDEX idx_event_logs_created_at ON event_logs(created_at DESC);
```

---

## 🔐 Security Architecture

### Authentication Flow
```
┌─────────┐
│  Client │
└────┬────┘
     │ 1. POST /api/auth/login
     │    { username, password }
     ▼
┌─────────────────┐
│   Auth API      │
│                 │
│  - Validate     │
│  - Check bcrypt │
│  - Generate JWT │
└────┬────────────┘
     │ 2. Return tokens
     │    { accessToken, refreshToken }
     ▼
┌─────────┐
│  Client │
│  Stores │
│  in     │
│  Memory │
└────┬────┘
     │ 3. Subsequent requests
     │    Authorization: Bearer <token>
     ▼
┌─────────────────┐
│  Protected API  │
│                 │
│  - Verify JWT   │
│  - Check expiry │
│  - Extract user │
└─────────────────┘
```

### Security Layers
1. **HTTPS/TLS**: All traffic encrypted
2. **JWT Tokens**: Stateless authentication
3. **CORS**: Cross-origin restrictions
4. **Rate Limiting**: Prevent abuse
5. **Input Validation**: Sanitize all inputs
6. **SQL Injection**: Parameterized queries
7. **XSS Protection**: Content Security Policy
8. **CSRF Tokens**: State-changing operations
9. **File Upload**: Type & size validation
10. **Role-Based Access**: Admin/User permissions

---

## 📡 API Endpoints (Production)

### Authentication
```
POST   /api/auth/register       - Register new user
POST   /api/auth/login          - Login and get tokens
POST   /api/auth/logout         - Invalidate tokens
POST   /api/auth/refresh        - Refresh access token
GET    /api/auth/me             - Get current user
PUT    /api/auth/password       - Change password
```

### Reports
```
POST   /api/reports             - Create new report
GET    /api/reports             - Get all reports (admin)
GET    /api/reports/:id         - Get specific report
GET    /api/reports/user/:id    - Get user's reports
PUT    /api/reports/:id         - Update report
PATCH  /api/reports/:id/status  - Update status only
DELETE /api/reports/:id         - Delete report (admin)
GET    /api/reports/nearby      - Get reports near location
```

### AI Analysis
```
POST   /api/ai/analyze          - Analyze image
POST   /api/ai/verify           - Verify waste type
GET    /api/ai/stats            - AI performance stats
```

### Fleet Management
```
GET    /api/fleet               - Get all vehicles
GET    /api/fleet/:id           - Get specific vehicle
PUT    /api/fleet/:id/location  - Update GPS location
PATCH  /api/fleet/:id/assign    - Assign to report
GET    /api/fleet/route         - Get optimized route
```

### Notifications
```
POST   /api/notify/push         - Send push notification
POST   /api/notify/email        - Send email
POST   /api/notify/sms          - Send SMS
GET    /api/notify/history      - Get notification history
```

---

## 🚀 Deployment Architecture

### Development
```
Local Machine
├── Next.js Dev Server (Port 3000)
├── Hot Module Replacement
└── localStorage (data)
```

### Staging
```
AWS EC2 / DigitalOcean
├── Next.js (PM2)
├── PostgreSQL (RDS)
├── Redis (ElastiCache)
├── S3 (Image Storage)
└── CloudFront (CDN)
```

### Production
```
                    ┌──────────────────┐
                    │   CloudFlare     │
                    │   (CDN + DDoS)   │
                    └────────┬─────────┘
                             │
                    ┌────────┴─────────┐
                    │  Load Balancer   │
                    │     (ALB)        │
                    └────────┬─────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
   ┌────┴─────┐         ┌────┴─────┐        ┌────┴─────┐
   │  Web #1  │         │  Web #2  │        │  Web #3  │
   │ Next.js  │         │ Next.js  │        │ Next.js  │
   └────┬─────┘         └────┬─────┘        └────┬─────┘
        │                    │                    │
        └────────────────────┼────────────────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
   ┌────┴─────┐         ┌────┴─────┐        ┌────┴─────┐
   │  API #1  │         │  API #2  │        │  API #3  │
   │ FastAPI  │         │ FastAPI  │        │ FastAPI  │
   └────┬─────┘         └────┬─────┘        └────┬─────┘
        │                    │                    │
        └────────────────────┼────────────────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
   ┌────┴─────────┐     ┌────┴──────┐      ┌────┴────┐
   │ PostgreSQL   │     │   Redis   │      │   S3    │
   │    (RDS)     │     │ (Elasticach│      │ (Images)│
   │  Primary +   │     │  Cluster)  │      │         │
   │  Replicas    │     │            │      │         │
   └──────────────┘     └────────────┘      └─────────┘
```

---

## 📊 Performance Metrics

### Target Performance
- **Page Load**: < 2 seconds
- **API Response**: < 200ms (p95)
- **Image Upload**: < 3 seconds
- **AI Analysis**: < 1 second
- **Database Query**: < 50ms
- **Uptime**: 99.9%

### Monitoring
- **APM**: New Relic / Datadog
- **Logs**: ELK Stack (Elasticsearch, Logstash, Kibana)
- **Errors**: Sentry
- **Analytics**: Google Analytics / Mixpanel
- **Infrastructure**: CloudWatch / Prometheus

---

**This architecture supports scalability from prototype to production! 🏗️✨**
