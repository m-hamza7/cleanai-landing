-- ============================================================
-- CleanAI – PostgreSQL Schema for Supabase
-- ============================================================
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor).
-- Table "user" is renamed to "users" (reserved word in PostgreSQL).
-- ============================================================

-- Users (citizens, admins, drivers)
CREATE TABLE IF NOT EXISTS users (
  user_id    SERIAL PRIMARY KEY,
  name       VARCHAR(50)  NOT NULL,
  email      VARCHAR(50)  NOT NULL UNIQUE,
  phone      VARCHAR(50)  NOT NULL,
  password_hash VARCHAR(256) NOT NULL,
  role       VARCHAR(10)  NOT NULL,
  area       VARCHAR(100),
  created_at TIMESTAMP    NOT NULL DEFAULT NOW(),
  status     BOOLEAN      NOT NULL DEFAULT TRUE
);

-- Waste reports submitted by citizens
CREATE TABLE IF NOT EXISTS reports (
  report_id          SERIAL PRIMARY KEY,
  user_id            INTEGER      NOT NULL REFERENCES users(user_id),
  image_url          VARCHAR(512) NOT NULL,
  location           VARCHAR(512),
  latitude           FLOAT        NOT NULL,
  longitude          FLOAT        NOT NULL,
  gps_accuracy       FLOAT        NOT NULL DEFAULT 0,
  submitted_at       TIMESTAMP    NOT NULL DEFAULT NOW(),
  status             VARCHAR(256) NOT NULL DEFAULT 'pending',
  rejection_reason   TEXT,
  pickup_scheduled_at TIMESTAMP,
  status_updated_at  TIMESTAMP
);

-- AI waste classification results
CREATE TABLE IF NOT EXISTS ai_classification (
  classification_id SERIAL PRIMARY KEY,
  report_id         INTEGER     NOT NULL REFERENCES reports(report_id),
  waste_type        VARCHAR(50),
  severity_level    VARCHAR(50) NOT NULL,
  confidence_score  FLOAT       DEFAULT 0,
  processed_at      TIMESTAMP
);

-- Driver cleanup task assignments
CREATE TABLE IF NOT EXISTS cleanup_tasks (
  task_id                  SERIAL PRIMARY KEY,
  report_id                INTEGER      NOT NULL REFERENCES reports(report_id),
  driver_user_id           INTEGER      REFERENCES users(user_id),
  assigned_to              VARCHAR(256),
  assigned_at              TIMESTAMP,
  due_date                 TIMESTAMP,
  completion_status        VARCHAR(20)  NOT NULL DEFAULT 'TASK DUE',
  completed_at             TIMESTAMP,
  completion_image_url     VARCHAR(512),
  completion_latitude      FLOAT,
  completion_longitude     FLOAT,
  completion_location      VARCHAR(512),
  completion_verified      BOOLEAN      DEFAULT FALSE,
  pickup_report_status     VARCHAR(20),
  pickup_report_action_at  TIMESTAMP,
  pickup_report_action_by  INTEGER
);

-- User notifications / alerts
CREATE TABLE IF NOT EXISTS alerts (
  alert_id        SERIAL PRIMARY KEY,
  user_id         INTEGER     NOT NULL REFERENCES users(user_id),
  report_id       INTEGER     NOT NULL REFERENCES reports(report_id),
  alert_type      VARCHAR(50) NOT NULL,
  message         VARCHAR(255) NOT NULL,
  delivery_method VARCHAR(50) NOT NULL,
  triggered_at    TIMESTAMP   NOT NULL DEFAULT NOW()
);

-- Geospatial zone definitions (future feature)
CREATE TABLE IF NOT EXISTS geospatial_zones (
  zone_id    SERIAL PRIMARY KEY,
  zone_name  VARCHAR(50) NOT NULL,
  zone_type  VARCHAR(50) NOT NULL,
  created_at TIMESTAMP   NOT NULL DEFAULT NOW()
);

-- Satellite image verification records (future feature)
CREATE TABLE IF NOT EXISTS satellite_verification (
  verification_id     SERIAL PRIMARY KEY,
  report_id           INTEGER      NOT NULL REFERENCES reports(report_id),
  satellite_image_url VARCHAR(512) NOT NULL,
  match_status        BOOLEAN      NOT NULL DEFAULT FALSE,
  verified_at         TIMESTAMP    NOT NULL DEFAULT NOW()
);

-- Audit / activity log
CREATE TABLE IF NOT EXISTS system_logs (
  log_id      SERIAL PRIMARY KEY,
  user_id     INTEGER     NOT NULL REFERENCES users(user_id),
  action_type VARCHAR(50) NOT NULL,
  description VARCHAR(255) NOT NULL,
  created_at  TIMESTAMP   NOT NULL DEFAULT NOW()
);

-- Driver planned routes + basic trip log (ELD)
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
);

CREATE INDEX IF NOT EXISTS idx_driver_routes_driver ON driver_routes(driver_user_id);
CREATE INDEX IF NOT EXISTS idx_driver_routes_status ON driver_routes(status);

-- ============================================================
-- Seed data – demo accounts
-- Passwords (bcrypt hash corresponds to):
--   hamza@cleanai.com  → "hamza"  (citizen)
--   admin@cleanai.com  → "admin123" (admin)
--   saad@cleanai.com   → "saad"   (citizen)
--   omer@cleanai.com   → "omer"   (citizen)
--   twellic@cleanai.com → "tyrell" (citizen)
--   ali@cleanai.com    → "ali"    (citizen)
-- ============================================================
INSERT INTO users (user_id, name, email, phone, password_hash, role, created_at, status) VALUES
(1, 'Hamza Ahmed',   'hamza@cleanai.com',   '+923001234567', '$2b$10$Sdt6ib.Ymvn4G5sM.HlwtummVkeQl7Nul4UXylD5VemtvgdJzixPS', 'citizen', '2026-02-05 18:35:18', TRUE),
(2, 'Admin User',    'admin@cleanai.com',   '+923009999999', '$2b$10$Cee6IVMinV4gGPWZ2XSh6uiK4BMfn4ipVyH/LsXmJn/J22KpV7ROK', 'admin',   '2026-02-05 18:35:18', TRUE),
(3, 'Saad Arshad',   'saad@cleanai.com',    '03362144060',   '$2b$10$i9U3EZozepvpgmBnwHjngeCzUnza0r.N3fcCBwCWRGHk/Vu0rM.36', 'citizen', '2026-02-19 21:22:01', TRUE),
(4, 'Omer Khan',     'omer@cleanai.com',    '03362144060',   '$2b$10$rwyh83kOZZX9HBhJbi/q3ei9tQYt1BKlMhzxGlKft2gnDRMEEAYsO', 'citizen', '2026-02-19 21:30:26', TRUE),
(5, 'Tyrell Welick', 'twellic@cleanai.com', '03483883336',   '$2b$10$CB41NS2GGMNMltn9ds1C5uSFCp2yQ.z7yQKVuzD9gRhgbMq00/1rW', 'citizen', '2026-02-20 16:43:36', TRUE),
(6, 'Ali',           'ali@cleanai.com',     '03324523786',   '$2b$10$Kne2iIi5TCtL4gb1eQGdZeoZk6HJ5QUNw4igLM0514RdrpjxHH0Lm', 'citizen', '2026-02-22 12:30:51', TRUE)
ON CONFLICT (user_id) DO NOTHING;

-- Advance the sequence past the seeded IDs so new inserts don't collide
SELECT setval('users_user_id_seq', (SELECT MAX(user_id) FROM users));
