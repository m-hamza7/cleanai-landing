-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 12, 2026 at 01:04 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `clean_ai`
--

-- --------------------------------------------------------

--
-- Table structure for table `ai_classification`
--

CREATE TABLE `ai_classification` (
  `classification_id` int(15) NOT NULL,
  `report_id` int(15) NOT NULL,
  `waste_type` varchar(50) DEFAULT NULL,
  `severity_level` varchar(50) NOT NULL,
  `confidence_score` float DEFAULT 0,
  `processed_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ai_classification`
--

INSERT INTO `ai_classification` (`classification_id`, `report_id`, `waste_type`, `severity_level`, `confidence_score`, `processed_at`) VALUES
(1, 7, 'PLASTIC', 'high', 0.445, '2026-02-20 16:24:40'),
(2, 8, 'PLASTIC', 'high', 0.445, '2026-02-20 16:36:21'),
(3, 9, 'METAL', 'medium', 0.4378, '2026-02-20 16:42:25'),
(4, 10, 'PLASTIC', 'high', 0.445, '2026-02-20 16:44:05'),
(5, 11, 'METAL', 'medium', 0.4378, '2026-02-20 16:44:44'),
(6, 12, 'METAL', 'medium', 0.5089, '2026-02-20 16:51:35'),
(7, 13, 'PLASTIC', 'high', 0.445, '2026-02-22 12:31:25'),
(8, 14, 'METAL', 'medium', 0.4378, '2026-02-22 12:31:46'),
(9, 15, 'PLASTIC', 'high', 0.445, '2026-02-23 20:19:34'),
(10, 19, 'PLASTIC', 'high', 0.445, '2026-02-27 20:51:57'),
(11, 20, 'METAL', 'medium', 0.4378, '2026-02-27 20:52:18'),
(12, 21, 'METAL', 'medium', 0.4378, '2026-04-11 23:00:29'),
(13, 23, 'METAL', 'medium', 0.7074, '2026-04-11 23:28:54'),
(14, 24, 'METAL', 'medium', 0.7074, '2026-04-11 23:30:39'),
(15, 25, 'PLASTIC', 'low', 0.4862, '2026-04-11 23:38:02'),
(16, 26, 'PLASTIC', 'low', 0.6757, '2026-04-11 23:54:31'),
(17, 27, 'Bottle', 'medium', 0.8994, '2026-04-11 23:54:50');

-- --------------------------------------------------------

--
-- Table structure for table `alerts`
--

CREATE TABLE `alerts` (
  `alert_id` int(15) NOT NULL,
  `user_id` int(15) NOT NULL,
  `report_id` int(15) NOT NULL,
  `alert_type` varchar(50) NOT NULL,
  `message` varchar(50) NOT NULL,
  `delivery_method` varchar(50) NOT NULL,
  `triggered_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cleanup_tasks`
--

CREATE TABLE `cleanup_tasks` (
  `task_id` int(15) NOT NULL,
  `report_id` int(15) NOT NULL,
  `assigned_to` varchar(256) NOT NULL,
  `assigned_at` datetime DEFAULT NULL,
  `due_date` datetime NOT NULL,
  `completion_status` varchar(8) NOT NULL DEFAULT 'TASK DUE',
  `completed_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `geospatial_zones`
--

CREATE TABLE `geospatial_zones` (
  `zone_id` int(15) NOT NULL,
  `zone_name` varchar(50) NOT NULL,
  `zone_type` varchar(50) NOT NULL,
  `geom` geometry DEFAULT NULL,
  `created_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `reports`
--

CREATE TABLE `reports` (
  `report_id` int(15) NOT NULL,
  `user_id` int(15) NOT NULL,
  `image_url` varchar(100) NOT NULL,
  `latitude` float NOT NULL,
  `longitude` float NOT NULL,
  `gps_accuracy` float NOT NULL,
  `submitted_at` datetime NOT NULL,
  `status` varchar(256) NOT NULL DEFAULT 'pending',
  `rejection_reason` text DEFAULT NULL,
  `pickup_scheduled_at` datetime DEFAULT NULL,
  `status_updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `reports`
--

INSERT INTO `reports` (`report_id`, `user_id`, `image_url`, `latitude`, `longitude`, `gps_accuracy`, `submitted_at`, `status`, `rejection_reason`, `pickup_scheduled_at`, `status_updated_at`) VALUES
(1, 1, '/uploads/reports/1770319986131-467911570.jpg', 12322, 123421, 0, '2026-02-06 00:33:10', 'submitted', NULL, NULL, NULL),
(2, 3, '/uploads/reports/1771518206088-884964362.png', 24.9499, 67.1284, 0, '2026-02-19 21:23:26', 'submitted', NULL, NULL, NULL),
(3, 3, '/uploads/reports/1771518323417-129083404.png', 24.95, 67.1284, 0, '2026-02-19 21:25:23', 'submitted', NULL, NULL, NULL),
(4, 4, '/uploads/reports/1771518665095-711742098.jpeg', 24.9501, 67.1283, 0, '2026-02-19 21:31:05', 'submitted', NULL, NULL, NULL),
(5, 4, '/uploads/reports/1771586460962-591864700.jpeg', 24.95, 67.1284, 0, '2026-02-20 16:21:00', 'submitted', NULL, NULL, NULL),
(6, 4, '/uploads/reports/1771586563188-215895178.jpeg', 24.9501, 67.1282, 0, '2026-02-20 16:22:43', 'submitted', NULL, NULL, NULL),
(7, 4, '/uploads/reports/1771586679595-611055842.jpeg', 24.92, 67.08, 0, '2026-02-20 16:24:39', 'submitted', NULL, NULL, NULL),
(8, 1, '/uploads/reports/1771587381182-610973384.jpeg', 24.95, 67.1283, 0, '2026-02-20 16:36:21', 'submitted', NULL, NULL, NULL),
(9, 1, '/uploads/reports/1771587745284-358917637.jpeg', 24.9501, 67.1282, 0, '2026-02-20 16:42:25', 'submitted', NULL, NULL, NULL),
(10, 5, '/uploads/reports/1771587845025-899400488.jpeg', 24.9502, 67.1283, 0, '2026-02-20 16:44:05', 'submitted', NULL, NULL, NULL),
(11, 5, '/uploads/reports/1771587883873-185794302.jpeg', 24.9502, 67.1283, 0, '2026-02-20 16:44:43', 'submitted', NULL, NULL, NULL),
(12, 1, '/uploads/reports/1771588294309-215754389.jpg', 24.9501, 67.1283, 0, '2026-02-20 16:51:35', 'submitted', NULL, NULL, NULL),
(13, 6, '/uploads/reports/1771745483917-290215118.jpeg', 24.9501, 67.1283, 0, '2026-02-22 12:31:23', 'submitted', NULL, NULL, NULL),
(14, 6, '/uploads/reports/1771745505317-140615346.jpeg', 24.95, 67.1284, 0, '2026-02-22 12:31:45', 'submitted', NULL, NULL, NULL),
(15, 6, '/uploads/reports/1771859973775-305286534.jpeg', 24.9501, 67.1284, 0, '2026-02-23 20:19:33', 'submitted', NULL, NULL, NULL),
(16, 1, '/uploads/reports/1772207333688-756653655.jpg', 24.738, 68.37, 0, '2026-02-27 20:48:54', 'submitted', NULL, NULL, NULL),
(17, 6, '/uploads/reports/1772207417853-594369495.jpeg', 24.95, 67.1284, 0, '2026-02-27 20:50:17', 'submitted', NULL, NULL, NULL),
(18, 1, '/uploads/reports/1772207481682-224425838.jpg', 24.738, 68.37, 0, '2026-02-27 20:51:21', 'scheduled_for_pickup', NULL, '2026-04-12 05:00:00', '2026-04-11 23:05:53'),
(19, 6, '/uploads/reports/1772207516158-445687154.jpeg', 24.9501, 67.1284, 0, '2026-02-27 20:51:56', 'scheduled_for_pickup', NULL, '2026-04-12 04:00:00', '2026-04-11 23:41:23'),
(20, 6, '/uploads/reports/1772207537581-160370753.jpeg', 24.9501, 67.1284, 0, '2026-02-27 20:52:17', 'scheduled_for_pickup', NULL, '2026-04-12 09:04:00', '2026-04-11 23:09:09'),
(21, 1, '/uploads/reports/1775930428572-139095002.jpeg', 24.9501, 67.1285, 0, '2026-04-11 23:00:28', 'rejected', 'a duplicate report', NULL, '2026-04-11 23:04:51'),
(22, 6, '/uploads/reports/1775931946559-162459285.jpg', 24.9501, 67.1284, 0, '2026-04-11 23:25:46', 'scheduled_for_pickup', NULL, '2026-04-12 09:00:00', '2026-04-11 23:51:47'),
(23, 6, '/uploads/reports/1775932133848-598660776.jpg', 24.9501, 67.1284, 0, '2026-04-11 23:28:53', 'scheduled_for_pickup', NULL, '2026-04-12 09:00:00', '2026-04-11 23:51:38'),
(24, 6, '/uploads/reports/1775932238914-434968933.jpg', 24.9501, 67.1284, 0, '2026-04-11 23:30:38', 'scheduled_for_pickup', NULL, '2026-04-12 05:00:00', '2026-04-11 23:31:56'),
(25, 6, '/uploads/reports/1775932681123-184236520.jpg', 24.9501, 67.1284, 0, '2026-04-11 23:38:01', 'scheduled_for_pickup', NULL, '2026-04-27 07:02:00', '2026-04-11 23:39:23'),
(26, 6, '/uploads/reports/1775933671238-539525091.jpeg', 24.9501, 67.1284, 0, '2026-04-11 23:54:31', 'pending', NULL, NULL, '2026-04-11 23:54:31'),
(27, 6, '/uploads/reports/1775933690025-290111170.jpeg', 24.92, 67.12, 0, '2026-04-11 23:54:50', 'pending', NULL, NULL, '2026-04-11 23:54:50');

-- --------------------------------------------------------

--
-- Table structure for table `satellite_verification`
--

CREATE TABLE `satellite_verification` (
  `verification_id` int(11) NOT NULL,
  `report_id` int(15) NOT NULL,
  `satellite_image_url` varchar(50) NOT NULL,
  `match_status` tinyint(1) NOT NULL,
  `verified_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `system_logs`
--

CREATE TABLE `system_logs` (
  `log_id` int(15) NOT NULL,
  `user_id` int(15) NOT NULL,
  `action_type` varchar(50) NOT NULL,
  `description` varchar(50) NOT NULL,
  `created_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `system_logs`
--

INSERT INTO `system_logs` (`log_id`, `user_id`, `action_type`, `description`, `created_at`) VALUES
(1, 1, 'LOGIN', 'User logged in', '2026-02-05 23:43:05'),
(2, 1, 'LOGIN', 'User logged in', '2026-02-05 23:43:51'),
(3, 1, 'LOGIN', 'User logged in', '2026-02-05 23:45:26'),
(4, 1, 'LOGIN', 'User logged in', '2026-02-06 00:06:56'),
(5, 1, 'LOGIN', 'User logged in', '2026-02-06 00:14:23'),
(6, 1, 'LOGIN', 'User logged in', '2026-02-06 00:32:33'),
(7, 1, 'REPORT_SUBMIT', 'New waste report submitted', '2026-02-06 00:33:10'),
(8, 1, 'LOGIN', 'User logged in', '2026-02-06 00:52:44'),
(9, 1, 'LOGIN', 'User logged in', '2026-02-19 19:23:19'),
(10, 1, 'LOGIN', 'User logged in', '2026-02-19 19:39:20'),
(11, 1, 'LOGIN', 'User logged in', '2026-02-19 20:48:44'),
(12, 1, 'LOGIN', 'User logged in', '2026-02-19 20:55:47'),
(13, 3, 'LOGIN', 'User logged in', '2026-02-19 21:22:12'),
(14, 3, 'REPORT_SUBMIT', 'New waste report submitted', '2026-02-19 21:23:26'),
(15, 3, 'LOGIN', 'User logged in', '2026-02-19 21:24:57'),
(16, 3, 'REPORT_SUBMIT', 'New waste report submitted', '2026-02-19 21:25:23'),
(17, 4, 'LOGIN', 'User logged in', '2026-02-19 21:30:39'),
(18, 4, 'REPORT_SUBMIT', 'New waste report submitted', '2026-02-19 21:31:05'),
(19, 4, 'LOGIN', 'User logged in', '2026-02-20 16:20:43'),
(20, 4, 'REPORT_SUBMIT', 'New waste report submitted', '2026-02-20 16:21:01'),
(21, 4, 'REPORT_SUBMIT', 'New waste report submitted', '2026-02-20 16:22:43'),
(22, 4, 'REPORT_SUBMIT', 'New waste report submitted', '2026-02-20 16:24:40'),
(23, 3, 'LOGIN', 'User logged in', '2026-02-20 16:35:39'),
(24, 1, 'LOGIN', 'User logged in', '2026-02-20 16:36:03'),
(25, 1, 'REPORT_SUBMIT', 'New waste report submitted', '2026-02-20 16:36:21'),
(26, 1, 'REPORT_SUBMIT', 'New waste report submitted', '2026-02-20 16:42:25'),
(27, 5, 'LOGIN', 'User logged in', '2026-02-20 16:43:43'),
(28, 5, 'REPORT_SUBMIT', 'New waste report submitted', '2026-02-20 16:44:05'),
(29, 5, 'REPORT_SUBMIT', 'New waste report submitted', '2026-02-20 16:44:44'),
(30, 1, 'LOGIN', 'User logged in', '2026-02-20 16:49:28'),
(31, 1, 'REPORT_SUBMIT', 'New waste report submitted', '2026-02-20 16:51:35'),
(32, 6, 'LOGIN', 'User logged in', '2026-02-22 12:31:03'),
(33, 6, 'REPORT_SUBMIT', 'New waste report submitted', '2026-02-22 12:31:25'),
(34, 6, 'REPORT_SUBMIT', 'New waste report submitted', '2026-02-22 12:31:46'),
(35, 6, 'LOGIN', 'User logged in', '2026-02-23 20:14:59'),
(36, 6, 'REPORT_SUBMIT', 'New waste report submitted', '2026-02-23 20:19:34'),
(37, 6, 'LOGIN', 'User logged in', '2026-02-27 20:38:26'),
(38, 1, 'LOGIN', 'User logged in', '2026-02-27 20:44:52'),
(39, 6, 'LOGIN', 'User logged in', '2026-02-27 20:46:54'),
(40, 1, 'REPORT_SUBMIT', 'New waste report submitted', '2026-02-27 20:48:54'),
(41, 1, 'LOGIN', 'User logged in', '2026-02-27 20:49:28'),
(42, 6, 'REPORT_SUBMIT', 'New waste report submitted', '2026-02-27 20:50:17'),
(43, 1, 'REPORT_SUBMIT', 'New waste report submitted', '2026-02-27 20:51:24'),
(44, 6, 'REPORT_SUBMIT', 'New waste report submitted', '2026-02-27 20:51:57'),
(45, 6, 'REPORT_SUBMIT', 'New waste report submitted', '2026-02-27 20:52:18'),
(46, 1, 'LOGIN', 'User logged in', '2026-02-27 20:53:25'),
(47, 1, 'LOGIN', 'User logged in', '2026-04-11 22:59:50'),
(48, 1, 'REPORT_SUBMIT', 'New waste report submitted', '2026-04-11 23:00:29'),
(49, 1, 'LOGIN', 'User logged in', '2026-04-11 23:03:19'),
(50, 1, 'LOGIN', 'User logged in', '2026-04-11 23:04:05'),
(51, 2, 'LOGIN', 'User logged in', '2026-04-11 23:04:23'),
(52, 2, 'STATUS_UPDATE', 'Report status updated to rejected', '2026-04-11 23:04:51'),
(53, 2, 'STATUS_UPDATE', 'Report status updated to scheduled_for_pickup', '2026-04-11 23:05:23'),
(54, 2, 'STATUS_UPDATE', 'Report status updated to scheduled_for_pickup', '2026-04-11 23:05:53'),
(55, 1, 'LOGIN', 'User logged in', '2026-04-11 23:06:12'),
(56, 2, 'LOGIN', 'User logged in', '2026-04-11 23:08:41'),
(57, 2, 'STATUS_UPDATE', 'Report status updated to scheduled_for_pickup', '2026-04-11 23:09:09'),
(58, 1, 'LOGIN', 'User logged in', '2026-04-11 23:09:34'),
(59, 6, 'LOGIN', 'User logged in', '2026-04-11 23:25:21'),
(60, 6, 'REPORT_SUBMIT', 'New waste report submitted', '2026-04-11 23:25:46'),
(61, 1, 'LOGIN', 'User logged in', '2026-04-11 23:28:29'),
(62, 6, 'LOGIN', 'User logged in', '2026-04-11 23:28:37'),
(63, 6, 'REPORT_SUBMIT', 'New waste report submitted', '2026-04-11 23:28:54'),
(64, 2, 'LOGIN', 'User logged in', '2026-04-11 23:29:21'),
(65, 6, 'LOGIN', 'User logged in', '2026-04-11 23:30:20'),
(66, 6, 'REPORT_SUBMIT', 'New waste report submitted', '2026-04-11 23:30:39'),
(67, 2, 'LOGIN', 'User logged in', '2026-04-11 23:30:53'),
(68, 2, 'STATUS_UPDATE', 'Report status updated to rejected', '2026-04-11 23:31:18'),
(69, 2, 'STATUS_UPDATE', 'Report status updated to rejected', '2026-04-11 23:31:34'),
(70, 2, 'STATUS_UPDATE', 'Report status updated to scheduled_for_pickup', '2026-04-11 23:31:56'),
(71, 6, 'LOGIN', 'User logged in', '2026-04-11 23:32:16'),
(72, 6, 'LOGIN', 'User logged in', '2026-04-11 23:34:49'),
(73, 6, 'REPORT_SUBMIT', 'New waste report submitted', '2026-04-11 23:38:02'),
(74, 2, 'LOGIN', 'User logged in', '2026-04-11 23:38:24'),
(75, 2, 'STATUS_UPDATE', 'Report status updated to scheduled_for_pickup', '2026-04-11 23:38:43'),
(76, 2, 'STATUS_UPDATE', 'Report status updated to scheduled_for_pickup', '2026-04-11 23:39:00'),
(77, 2, 'STATUS_UPDATE', 'Report status updated to scheduled_for_pickup', '2026-04-11 23:39:23'),
(78, 6, 'LOGIN', 'User logged in', '2026-04-11 23:40:06'),
(79, 2, 'LOGIN', 'User logged in', '2026-04-11 23:40:32'),
(80, 2, 'STATUS_UPDATE', 'Report status updated to scheduled_for_pickup', '2026-04-11 23:41:23'),
(81, 2, 'LOGIN', 'User logged in', '2026-04-11 23:43:03'),
(82, 2, 'STATUS_UPDATE', 'Report status updated to received', '2026-04-11 23:51:27'),
(83, 2, 'STATUS_UPDATE', 'Report status updated to scheduled_for_pickup', '2026-04-11 23:51:38'),
(84, 2, 'STATUS_UPDATE', 'Report status updated to scheduled_for_pickup', '2026-04-11 23:51:47'),
(85, 6, 'LOGIN', 'User logged in', '2026-04-11 23:54:10'),
(86, 6, 'REPORT_SUBMIT', 'New waste report submitted', '2026-04-11 23:54:31'),
(87, 6, 'REPORT_SUBMIT', 'New waste report submitted', '2026-04-11 23:54:50');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `user_id` int(15) NOT NULL,
  `name` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `phone` varchar(50) NOT NULL,
  `password_hash` varchar(256) NOT NULL,
  `role` varchar(10) NOT NULL,
  `created_at` datetime NOT NULL,
  `status` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`user_id`, `name`, `email`, `phone`, `password_hash`, `role`, `created_at`, `status`) VALUES
(1, 'Hamza Ahmed', 'hamza@cleanai.com', '+923001234567', '$2b$10$Sdt6ib.Ymvn4G5sM.HlwtummVkeQl7Nul4UXylD5VemtvgdJzixPS', 'citizen', '2026-02-05 18:35:18', 1),
(2, 'Admin User', 'admin@cleanai.com', '+923009999999', '$2b$10$Cee6IVMinV4gGPWZ2XSh6uiK4BMfn4ipVyH/LsXmJn/J22KpV7ROK', 'admin', '2026-02-05 18:35:18', 1),
(3, 'Saad Arshad', 'saad@cleanai.com', '03362144060', '$2b$10$i9U3EZozepvpgmBnwHjngeCzUnza0r.N3fcCBwCWRGHk/Vu0rM.36', 'citizen', '2026-02-19 21:22:01', 1),
(4, 'Omer Khan', 'omer@cleanai.com', '03362144060', '$2b$10$rwyh83kOZZX9HBhJbi/q3ei9tQYt1BKlMhzxGlKft2gnDRMEEAYsO', 'citizen', '2026-02-19 21:30:26', 1),
(5, 'Tyrell Welick', 'twellic@cleanai.com', '03483883336', '$2b$10$CB41NS2GGMNMltn9ds1C5uSFCp2yQ.z7yQKVuzD9gRhgbMq00/1rW', 'citizen', '2026-02-20 16:43:36', 1),
(6, 'Ali', 'ali@cleanai.com', '03324523786', '$2b$10$Kne2iIi5TCtL4gb1eQGdZeoZk6HJ5QUNw4igLM0514RdrpjxHH0Lm', 'citizen', '2026-02-22 12:30:51', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `ai_classification`
--
ALTER TABLE `ai_classification`
  ADD PRIMARY KEY (`classification_id`),
  ADD KEY `report_id` (`report_id`);

--
-- Indexes for table `alerts`
--
ALTER TABLE `alerts`
  ADD PRIMARY KEY (`alert_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `report_id` (`report_id`);

--
-- Indexes for table `cleanup_tasks`
--
ALTER TABLE `cleanup_tasks`
  ADD PRIMARY KEY (`task_id`),
  ADD KEY `report_id` (`report_id`);

--
-- Indexes for table `geospatial_zones`
--
ALTER TABLE `geospatial_zones`
  ADD PRIMARY KEY (`zone_id`);

--
-- Indexes for table `reports`
--
ALTER TABLE `reports`
  ADD PRIMARY KEY (`report_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `satellite_verification`
--
ALTER TABLE `satellite_verification`
  ADD PRIMARY KEY (`verification_id`),
  ADD KEY `report_id` (`report_id`);

--
-- Indexes for table `system_logs`
--
ALTER TABLE `system_logs`
  ADD PRIMARY KEY (`log_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `ai_classification`
--
ALTER TABLE `ai_classification`
  MODIFY `classification_id` int(15) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `alerts`
--
ALTER TABLE `alerts`
  MODIFY `alert_id` int(15) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `cleanup_tasks`
--
ALTER TABLE `cleanup_tasks`
  MODIFY `task_id` int(15) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `geospatial_zones`
--
ALTER TABLE `geospatial_zones`
  MODIFY `zone_id` int(15) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `reports`
--
ALTER TABLE `reports`
  MODIFY `report_id` int(15) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT for table `satellite_verification`
--
ALTER TABLE `satellite_verification`
  MODIFY `verification_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `system_logs`
--
ALTER TABLE `system_logs`
  MODIFY `log_id` int(15) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=88;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `user_id` int(15) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `ai_classification`
--
ALTER TABLE `ai_classification`
  ADD CONSTRAINT `ai_classification_ibfk_1` FOREIGN KEY (`report_id`) REFERENCES `reports` (`report_id`);

--
-- Constraints for table `alerts`
--
ALTER TABLE `alerts`
  ADD CONSTRAINT `alerts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`),
  ADD CONSTRAINT `alerts_ibfk_2` FOREIGN KEY (`report_id`) REFERENCES `reports` (`report_id`);

--
-- Constraints for table `cleanup_tasks`
--
ALTER TABLE `cleanup_tasks`
  ADD CONSTRAINT `cleanup_tasks_ibfk_1` FOREIGN KEY (`report_id`) REFERENCES `reports` (`report_id`);

--
-- Constraints for table `reports`
--
ALTER TABLE `reports`
  ADD CONSTRAINT `reports_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`);

--
-- Constraints for table `satellite_verification`
--
ALTER TABLE `satellite_verification`
  ADD CONSTRAINT `satellite_verification_ibfk_1` FOREIGN KEY (`report_id`) REFERENCES `reports` (`report_id`);

--
-- Constraints for table `system_logs`
--
ALTER TABLE `system_logs`
  ADD CONSTRAINT `system_logs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */