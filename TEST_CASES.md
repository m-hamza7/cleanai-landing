# CleanAI - Comprehensive Test Cases

## Table of Contents
1. [Authentication Tests](#authentication-tests)
2. [User Dashboard Tests](#user-dashboard-tests)
3. [Admin Dashboard Tests](#admin-dashboard-tests)
4. [Driver Portal Tests](#driver-portal-tests)
5. [Report Management Tests](#report-management-tests)
6. [AI Classification Tests](#ai-classification-tests)
7. [Alert System Tests](#alert-system-tests)
8. [Navigation & UI Tests](#navigation--ui-tests)
9. [Mobile Responsiveness Tests](#mobile-responsiveness-tests)
10. [Performance Tests](#performance-tests)
11. [Security Tests](#security-tests)
12. [Error Handling Tests](#error-handling-tests)

---

## Authentication Tests

### TC-Auth-001: User Registration - Valid Input
**Objective:** Verify user can register with valid credentials
**Steps:**
1. Navigate to registration endpoint or form
2. Enter valid name, email, phone, and password
3. Select role (citizen/admin/driver)
4. Click Register button
**Expected Result:** User account created, confirmation message shown, user_id returned
**Test Data:**
```
Name: John Doe
Email: john@example.com
Phone: 03001234567
Password: SecurePass123
Role: citizen
Status: Active
```

### TC-Auth-002: User Registration - Duplicate Email
**Objective:** Verify system prevents duplicate email registration
**Steps:**
1. Register user with email: test@example.com
2. Attempt to register another user with same email
3. Observe response
**Expected Result:** Error 409 returned with message "User with this email already exists"

### TC-Auth-003: User Registration - Missing Required Fields
**Objective:** Verify validation for required fields
**Steps:**
1. Attempt registration with missing name
2. Attempt registration with missing email
3. Attempt registration with missing password
4. Observe responses
**Expected Result:** Error 400 returned for each missing field with validation message

### TC-Auth-004: User Login - Valid Credentials
**Objective:** Verify user can login with correct credentials
**Steps:**
1. Navigate to login page
2. Enter email: hamza
3. Enter password: hamza
4. Click Login button
**Expected Result:** JWT token generated, user_id and role returned, redirected to dashboard

### TC-Auth-005: User Login - Invalid Email
**Objective:** Verify login fails with non-existent email
**Steps:**
1. Navigate to login page
2. Enter email: nonexistent@example.com
3. Enter any password
4. Click Login
**Expected Result:** Error 401 returned with "Invalid credentials" message

### TC-Auth-006: User Login - Incorrect Password
**Objective:** Verify login fails with wrong password
**Steps:**
1. Navigate to login page
2. Enter valid email but wrong password
3. Click Login
**Expected Result:** Error 401 returned with "Invalid credentials" message

### TC-Auth-007: User Login - Missing Credentials
**Objective:** Verify login validation
**Steps:**
1. Attempt login without email
2. Attempt login without password
3. Attempt login with both fields empty
**Expected Result:** Error 400 with validation messages

### TC-Auth-008: Token Validation
**Objective:** Verify JWT token is valid and can be decoded
**Steps:**
1. Login successfully and get token
2. Send token in Authorization header to protected endpoint
3. Attempt with expired/invalid token
**Expected Result:** Valid token accepted, invalid token rejected with 401/403

### TC-Auth-009: Logout Functionality
**Objective:** Verify user session ends after logout
**Steps:**
1. Login successfully
2. Call logout endpoint or clear local session
3. Attempt to access protected page
**Expected Result:** User returned to login page, session cleared

### TC-Auth-010: Password Hashing
**Objective:** Verify passwords are securely hashed
**Steps:**
1. Register user with password: TestPassword123
2. Query database for user record
3. Verify password_hash is not plaintext
**Expected Result:** Database contains bcrypt hash, not plaintext password

---

## User Dashboard Tests

### TC-Dashboard-001: User Dashboard Access
**Objective:** Verify authenticated user can access dashboard
**Steps:**
1. Login as citizen user
2. Navigate to /user-dashboard
3. Verify page loads
**Expected Result:** User dashboard displayed with report submission form and history

### TC-Dashboard-002: Report Form - Image Upload
**Objective:** Verify image upload with preview
**Steps:**
1. Click upload area or drag-and-drop image
2. Select valid image file (PNG/JPG/GIF)
3. Verify preview appears
**Expected Result:** Image preview displayed, file size shown, file name visible

### TC-Dashboard-003: Report Submission - Valid Data
**Objective:** Verify report can be submitted with all required fields
**Steps:**
1. Upload valid image
2. Select waste type: "Plastic Waste"
3. Enter location: "Saddar, Karachi"
4. Enter description: "Waste near main road"
5. Click Submit Report
**Expected Result:** Success notification, report_id returned, form cleared

### TC-Dashboard-004: Report Submission - Missing Image
**Objective:** Verify validation prevents submission without image
**Steps:**
1. Leave image field empty
2. Fill other fields
3. Click Submit Report
**Expected Result:** Error message "Image is required"

### TC-Dashboard-005: Report Submission - Missing Waste Type
**Objective:** Verify validation for waste type field
**Steps:**
1. Upload image
2. Leave waste type empty
3. Click Submit Report
**Expected Result:** Error message "Please select a waste type"

### TC-Dashboard-006: Report Submission - Missing Location
**Objective:** Verify location is required
**Steps:**
1. Upload image, select waste type
2. Leave location empty
3. Click Submit Report
**Expected Result:** Error message "Location is required"

### TC-Dashboard-007: Report History Display
**Objective:** Verify user can see their submitted reports
**Steps:**
1. Submit multiple reports (3-5)
2. Check report history/sidebar
3. Verify all reports listed with timestamps
**Expected Result:** All reports displayed with status, date, waste type

### TC-Dashboard-008: Report History - Status Updates
**Objective:** Verify report status changes are reflected
**Steps:**
1. Submit report (status: pending)
2. Update status to "dispatched" via admin dashboard
3. Refresh user dashboard
**Expected Result:** Status updated in history, shows "Dispatched"

### TC-Dashboard-009: Waste Type Selection
**Objective:** Verify all 8 waste categories available
**Steps:**
1. Click waste type dropdown
2. Verify all categories present
**Expected Result:** All 8 waste types displayed:
- Plastic Waste
- Metal Waste
- Glass Waste
- Organic Waste
- Hazardous Waste
- Electronic Waste
- Mixed Waste
- Other

### TC-Dashboard-010: Large Image Upload
**Objective:** Verify file size validation
**Steps:**
1. Attempt to upload image > 10MB
2. Observe response
**Expected Result:** Error message "File too large, maximum 10MB"

### TC-Dashboard-011: Invalid Image Format
**Objective:** Verify only images accepted
**Steps:**
1. Attempt to upload .txt, .pdf, .doc file
2. Observe response
**Expected Result:** Error "Only image files are allowed"

### TC-Dashboard-012: Drag and Drop Upload
**Objective:** Verify drag-drop functionality works
**Steps:**
1. Drag image file to upload area
2. Drop on designated zone
**Expected Result:** File uploaded and preview displayed

### TC-Dashboard-013: Multiple Image Upload Attempt
**Objective:** Verify only single image upload
**Steps:**
1. Select multiple images
2. Verify only one is processed
**Expected Result:** Only first image uploaded, others ignored

### TC-Dashboard-014: Location Auto-Detection
**Objective:** Verify GPS location can be auto-detected
**Steps:**
1. Click "Detect Location" button (if available)
2. Allow browser geolocation permission
3. Verify location populates
**Expected Result:** Coordinates and address displayed in location field

### TC-Dashboard-015: Form Validation Messages
**Objective:** Verify real-time validation feedback
**Steps:**
1. Fill form fields and observe validation
2. Clear required fields
3. Submit incomplete form
**Expected Result:** Inline error messages shown, form submit disabled until valid

---

## Admin Dashboard Tests

### TC-Admin-001: Admin Dashboard Access
**Objective:** Verify admin user can access admin dashboard
**Steps:**
1. Login as admin user
2. Navigate to /dashboard
3. Verify dashboard loads
**Expected Result:** Admin dashboard displayed with all panels

### TC-Admin-002: Citizen Reports Panel
**Objective:** Verify reports panel displays all citizen submissions
**Steps:**
1. View admin dashboard
2. Scroll to "Citizen Reports" section
3. Verify all reports listed
**Expected Result:** All submitted reports displayed with image, type, location, timestamp

### TC-Admin-003: Report Status Workflow
**Objective:** Verify report status transitions
**Steps:**
1. View report with status "pending"
2. Click "Dispatch Team"
3. Verify status changes to "dispatched"
4. Click "Mark Resolved"
5. Verify status changes to "resolved"
**Expected Result:** Status updates correctly through workflow

### TC-Admin-004: Report Filtering by Status
**Objective:** Verify admin can filter reports by status
**Steps:**
1. Apply filter for "pending" status
2. Verify only pending reports shown
3. Filter by "dispatched"
4. Filter by "resolved"
**Expected Result:** Correct reports displayed for each filter

### TC-Admin-005: Report Search
**Objective:** Verify admin can search reports
**Steps:**
1. Search by waste type name
2. Search by location
3. Search by user name
4. Search by date range
**Expected Result:** Relevant reports displayed for each search

### TC-Admin-006: Fleet Management Panel
**Objective:** Verify fleet management section displays
**Steps:**
1. Navigate to admin dashboard
2. Locate fleet management panel
3. Verify driver list displayed
**Expected Result:** Fleet panel shows active drivers, vehicles, status

### TC-Admin-007: Fleet Status Updates
**Objective:** Verify fleet status can be updated
**Steps:**
1. View driver in fleet management
2. Update driver status (online/offline/on-task)
3. Add task/assignment
**Expected Result:** Status changes reflected immediately

### TC-Admin-008: Flood Risk Assessment Panel
**Objective:** Verify flood risk panel displays
**Steps:**
1. Navigate to admin dashboard
2. Find flood risk assessment section
3. Verify risk indicators shown
**Expected Result:** Flood risk zones highlighted on map, risk levels displayed

### TC-Admin-009: Waste Detection Map
**Objective:** Verify waste detection map displays reports
**Steps:**
1. View admin dashboard
2. Locate waste detection map
3. Verify report locations marked
**Expected Result:** Map shows waste report locations, clickable for details

### TC-Admin-010: Statistics Overview
**Objective:** Verify stats panel displays key metrics
**Steps:**
1. View admin dashboard
2. Check stats overview
**Expected Result:** Shows total reports, pending count, resolved count, average response time

### TC-Admin-011: Report Assignment to Driver
**Objective:** Verify admin can assign report to driver
**Steps:**
1. Click on pending report
2. Select "Assign to Driver" option
3. Choose driver from list
4. Confirm assignment
**Expected Result:** Report assigned, driver notified, status updated to "assigned"

### TC-Admin-012: Report Details Modal
**Objective:** Verify detailed report view
**Steps:**
1. Click on report in list
2. Modal/detail view opens
**Expected Result:** Full report details displayed: image, type, location, description, submitter info, timestamps

### TC-Admin-013: Dashboard Auto-Refresh
**Objective:** Verify dashboard updates in real-time
**Steps:**
1. Enable auto-refresh (if available)
2. Submit new report from user dashboard
3. Wait for refresh cycle
**Expected Result:** New report appears in admin dashboard automatically

### TC-Admin-014: Batch Report Actions
**Objective:** Verify admin can perform bulk actions
**Steps:**
1. Select multiple reports
2. Apply bulk action (e.g., assign to team, change status)
**Expected Result:** All selected reports updated simultaneously

### TC-Admin-015: Report Export
**Objective:** Verify admin can export reports
**Steps:**
1. Select reports or date range
2. Click Export button
3. Choose format (CSV/PDF/Excel)
**Expected Result:** Report file downloaded with all selected data

---

## Driver Portal Tests

### TC-Driver-001: Driver Registration
**Objective:** Verify driver can register
**Steps:**
1. Navigate to driver registration
2. Enter name, phone, select area, password
3. Click Register
**Expected Result:** Driver account created, driver_id returned

### TC-Driver-002: Driver Registration - Area Selection
**Objective:** Verify only valid areas selectable
**Steps:**
1. Open area dropdown
2. Verify all predefined areas present
**Expected Result:** All 6 areas displayed:
- Scheme33
- Malir 15
- Quadabad
- Shahrae faisal
- Tariq Road
- North Nazimabad

### TC-Driver-003: Driver Login
**Objective:** Verify driver can login
**Steps:**
1. Login with driver credentials
2. Verify access to driver portal
**Expected Result:** Driver portal displayed with tasks/assignments

### TC-Driver-004: Driver Task Assignment
**Objective:** Verify driver receives task assignments
**Steps:**
1. Admin assigns report to driver
2. Driver logs in to portal
3. Verify task appears in task list
**Expected Result:** Task displayed with report details, location, priority

### TC-Driver-005: Task Navigation
**Objective:** Verify driver can view route to task
**Steps:**
1. View assigned task
2. Click "Navigate" or view on map
3. Verify route displayed
**Expected Result:** Current location and destination shown on map with route

### TC-Driver-006: Task Completion - Photo Upload
**Objective:** Verify driver can upload completion photo
**Steps:**
1. Navigate to task location (or simulate)
2. Click "Mark Complete"
3. Upload completion photo
4. Add notes (optional)
**Expected Result:** Photo uploaded, task marked as in-progress

### TC-Driver-007: Task Completion - GPS Verification
**Objective:** Verify system checks GPS distance
**Steps:**
1. Attempt to mark task complete from different location (>0.2km away)
2. Observe system response
**Expected Result:** Error shown "Must be within 200m to complete task"

### TC-Driver-008: Valid Task Completion
**Objective:** Verify task completes when within range
**Steps:**
1. Driver reaches task location (within 200m)
2. Upload completion photo
3. Click "Complete Task"
**Expected Result:** Task marked complete, timestamp recorded, photo saved

### TC-Driver-009: Driver Current Location Tracking
**Objective:** Verify driver location is tracked
**Steps:**
1. Driver logs in
2. Admin views driver on map
3. Verify driver location displayed
**Expected Result:** Driver location shown on map, updates periodically

### TC-Driver-010: Driver Status Management
**Objective:** Verify driver can set status
**Steps:**
1. Driver changes status to "Online"
2. Check admin dashboard visibility
3. Driver changes to "On Break"
4. Verify status updated
**Expected Result:** Status changes reflected immediately

### TC-Driver-011: Driver Performance Metrics
**Objective:** Verify driver metrics displayed
**Steps:**
1. View driver profile
2. Check completed tasks count
3. Check average completion time
4. Check customer ratings
**Expected Result:** Metrics displayed accurately

### TC-Driver-012: Driver Task History
**Objective:** Verify driver can view past tasks
**Steps:**
1. Navigate to task history
2. Filter by date range
3. Filter by status (completed/cancelled)
**Expected Result:** Historical tasks displayed with completion details

### TC-Driver-013: Driver Communication
**Objective:** Verify driver can communicate with admin
**Steps:**
1. Send message to admin
2. Admin sends message to driver
3. Verify message delivery
**Expected Result:** Messages displayed in both portals, timestamps shown

### TC-Driver-014: Driver Task Reassignment
**Objective:** Verify driver can request reassignment
**Steps:**
1. Driver views assigned task
2. Click "Request Reassignment"
3. Enter reason
**Expected Result:** Reassignment request sent to admin, task remains assigned

### TC-Driver-015: Multiple Task Management
**Objective:** Verify driver can manage multiple tasks
**Steps:**
1. Assign 3-5 tasks to same driver
2. Driver prioritizes tasks
3. Completes tasks in order
**Expected Result:** All tasks managed correctly, completion order tracked

---

## Report Management Tests

### TC-Report-001: Create Report - API Call
**Objective:** Verify POST /api/reports endpoint creates report
**Steps:**
1. Send POST request with valid report data
2. Include authentication token
3. Send image file
**Expected Result:** 201 status, report_id returned, report saved to database

### TC-Report-002: Get All Reports - API
**Objective:** Verify GET /api/reports returns all reports
**Steps:**
1. Create 5 test reports
2. Send GET /api/reports
3. Verify all reports returned
**Expected Result:** Array of reports returned with all fields populated

### TC-Report-003: Get User Reports - API
**Objective:** Verify user can only see their reports
**Steps:**
1. User A submits 2 reports
2. User B submits 2 reports
3. User A queries their reports
4. Verify user B's reports not included
**Expected Result:** User A sees only their 2 reports

### TC-Report-004: Get Report by ID
**Objective:** Verify single report can be retrieved
**Steps:**
1. Submit report, get report_id
2. Send GET /api/reports/{report_id}
3. Verify full report data returned
**Expected Result:** Complete report data returned with image, metadata, status

### TC-Report-005: Update Report Status
**Objective:** Verify report status can be updated
**Steps:**
1. Create report with status "pending"
2. Update to "dispatched"
3. Update to "resolved"
**Expected Result:** Status updated in database, timestamp recorded

### TC-Report-006: Report Status Workflow Validation
**Objective:** Verify invalid status transitions prevented
**Steps:**
1. Create report (status: pending)
2. Attempt to set invalid status value
3. Attempt backwards transition (resolved → pending)
**Expected Result:** Invalid transitions rejected with error message

### TC-Report-007: Report Image Storage
**Objective:** Verify images stored correctly
**Steps:**
1. Submit report with image
2. Retrieve report
3. Check image accessible at image_url
**Expected Result:** Image file exists, URL resolves, image loads

### TC-Report-008: Report Metadata
**Objective:** Verify all metadata saved
**Steps:**
1. Submit report with all fields
2. Query database
**Expected Result:** All fields present:
- report_id, user_id, image_url, waste_type
- location, latitude, longitude, description
- status, created_at, updated_at, confidence_score

### TC-Report-009: Report Pagination
**Objective:** Verify large result sets can be paginated
**Steps:**
1. Create 100+ reports
2. Request with pagination (limit=20, offset=0)
3. Request next page (offset=20)
**Expected Result:** Correct number of results per page, pagination metadata returned

### TC-Report-010: Report Filtering
**Objective:** Verify reports can be filtered
**Steps:**
1. Create reports with various waste types
2. Filter by waste_type="Plastic"
3. Filter by status="resolved"
4. Filter by date range
**Expected Result:** Filtered results return only matching reports

### TC-Report-011: Report Sorting
**Objective:** Verify reports can be sorted
**Steps:**
1. Sort by created_at ascending
2. Sort by created_at descending
3. Sort by status
**Expected Result:** Results returned in correct order

### TC-Report-012: Report Update by Non-Owner
**Objective:** Verify non-owner cannot modify report
**Steps:**
1. User A submits report
2. User B attempts to update report
3. Observe response
**Expected Result:** 403 Forbidden error returned

### TC-Report-013: Admin Can Update Any Report
**Objective:** Verify admin can modify any report
**Steps:**
1. User submits report
2. Admin user updates report status
**Expected Result:** Admin update succeeds

### TC-Report-014: Report Deletion
**Objective:** Verify report can be deleted
**Steps:**
1. Submit report
2. Delete report (soft delete recommended)
3. Verify report no longer in active list
**Expected Result:** Report marked as deleted, not returned in queries

### TC-Report-015: Report Geolocation
**Objective:** Verify latitude/longitude captured
**Steps:**
1. Submit report with location
2. Verify coordinates saved
3. Use coordinates to find nearby reports
**Expected Result:** Coordinates stored, can query by radius

---

## AI Classification Tests

### TC-AI-001: Image Classification - Plastic Waste
**Objective:** Verify AI correctly identifies plastic waste
**Steps:**
1. Submit image of plastic waste to classification service
2. Wait for response
3. Verify confidence score
**Expected Result:** waste_type="plastic", confidence_score >= 0.7

### TC-AI-002: Image Classification - Metal Waste
**Objective:** Verify AI correctly identifies metal waste
**Steps:**
1. Submit metal waste image
2. Get classification result
**Expected Result:** waste_type="metal", high confidence score

### TC-AI-003: Image Classification - Mixed Waste
**Objective:** Verify AI handles multiple waste types
**Steps:**
1. Submit image with mixed waste
2. Get classification
**Expected Result:** waste_type="mixed" or high confidence in dominant type

### TC-AI-004: Image Classification - No Waste
**Objective:** Verify AI identifies non-waste images
**Steps:**
1. Submit image with no waste
2. Get classification
**Expected Result:** confidence_score < 0.3 or waste_type="none"

### TC-AI-005: AI Confidence Score
**Objective:** Verify confidence scores are reasonable
**Steps:**
1. Submit clear waste images
2. Submit blurry/unclear images
3. Compare confidence scores
**Expected Result:** Clear images have higher scores (0.8+), unclear lower (0.5-0.7)

### TC-AI-006: AI Response Time
**Objective:** Verify AI responds within acceptable time
**Steps:**
1. Send image for classification
2. Measure response time
**Expected Result:** Response received within 5 seconds

### TC-AI-007: AI Handles Multiple Formats
**Objective:** Verify AI processes JPG, PNG, GIF
**Steps:**
1. Submit image in JPG format
2. Submit same image content in PNG
3. Compare results
**Expected Result:** Same waste type identified, minor confidence variance acceptable

### TC-AI-008: AI Batch Processing
**Objective:** Verify AI can process multiple images
**Steps:**
1. Send 5 images for classification
2. Verify all processed
3. Check results accuracy
**Expected Result:** All images classified, results returned in array

### TC-AI-009: AI Model Performance
**Objective:** Verify AI accuracy metrics
**Steps:**
1. Test AI with 30 labeled images (10 each: plastic, metal, organic)
2. Compare predictions to labels
3. Calculate accuracy
**Expected Result:** Accuracy >= 80%

### TC-AI-010: AI Error Handling
**Objective:** Verify graceful error handling
**Steps:**
1. Send corrupted image
2. Send non-image file to AI service
3. Observe error response
**Expected Result:** Appropriate error message returned, system doesn't crash

### TC-AI-011: AI Service Availability
**Objective:** Verify fallback when AI service unavailable
**Steps:**
1. Stop AI service
2. Attempt to classify image
3. Observe system behavior
**Expected Result:** Graceful error or queue image for later processing

### TC-AI-012: AI Prediction Explanation
**Objective:** Verify AI provides explanation
**Steps:**
1. Get classification result
2. Check for explanation/details
**Expected Result:** Explanation or confidence breakdown provided

### TC-AI-013: AI Learning/Updates
**Objective:** Verify AI model can be updated
**Steps:**
1. Update AI model with new trained version
2. Test classification on new images
**Expected Result:** Service uses updated model, improvements observed

### TC-AI-014: AI Real-time Classification
**Objective:** Verify classification triggers on report submission
**Steps:**
1. Submit report with image
2. Observe classification happens automatically
**Expected Result:** waste_type and confidence_score auto-populated

### TC-AI-015: AI Override Functionality
**Objective:** Verify admin can override AI classification
**Steps:**
1. System classifies as waste_type="plastic"
2. Admin changes to waste_type="metal"
3. Verify change saved
**Expected Result:** Override recorded, original classification preserved as reference

---

## Alert System Tests

### TC-Alert-001: Alert Creation
**Objective:** Verify alerts can be created
**Steps:**
1. Create alert via API POST /api/alerts
2. Provide user_id, alert_type, message
**Expected Result:** 201 status, alert_id returned

### TC-Alert-002: Alert Retrieval
**Objective:** Verify user can retrieve their alerts
**Steps:**
1. User logs in
2. GET /api/alerts
3. Verify alerts returned
**Expected Result:** Array of user's alerts returned with timestamps

### TC-Alert-003: Alert Types
**Objective:** Verify different alert types supported
**Steps:**
1. Create alert with type="waste_detected"
2. Create alert with type="flood_warning"
3. Create alert with type="task_assigned"
**Expected Result:** All alert types accepted and stored

### TC-Alert-004: Alert Delivery Methods
**Objective:** Verify different delivery methods
**Steps:**
1. Create alert with delivery_method="email"
2. Create alert with delivery_method="sms"
3. Create alert with delivery_method="push"
**Expected Result:** All delivery methods recorded

### TC-Alert-005: Alert Trigger on New Report
**Objective:** Verify alerts triggered on events
**Steps:**
1. Submit new waste report
2. Admin receives alert notification
3. Verify alert created automatically
**Expected Result:** Alert appears in admin alerts within 10 seconds

### TC-Alert-006: Alert Flood Zone Detection
**Objective:** Verify flood alerts triggered for high-risk areas
**Steps:**
1. Submit report in known flood-prone area
2. Check if flood alert generated
**Expected Result:** Flood warning alert created and sent

### TC-Alert-007: Alert Acknowledgment
**Objective:** Verify alerts can be marked as read
**Steps:**
1. Get alert
2. Mark as read/acknowledged
**Expected Result:** Alert status updated, removed from unread count

### TC-Alert-008: Alert Priority Levels
**Objective:** Verify alerts have priority levels
**Steps:**
1. Create low-priority alert
2. Create high-priority alert
3. Verify sorting by priority
**Expected Result:** High-priority alerts sorted first

### TC-Alert-009: Alert History
**Objective:** Verify alert history maintained
**Steps:**
1. Create and acknowledge multiple alerts
2. Query alert history (with read alerts)
3. Verify all alerts returned
**Expected Result:** Complete alert history displayed

### TC-Alert-010: Alert Expiry
**Objective:** Verify old alerts handled
**Steps:**
1. Create alert with expiry_time
2. Query after expiry
3. Check if alert archivedon or removed
**Expected Result:** Old alerts archived or removed from active list

### TC-Alert-011: Alert Notification Email
**Objective:** Verify email notifications sent
**Steps:**
1. Create alert with email delivery method
2. Wait for email send
3. Check recipient email
**Expected Result:** Email received with alert details

### TC-Alert-012: Alert Notification SMS
**Objective:** Verify SMS notifications sent
**Steps:**
1. Create alert with SMS delivery method
2. Provide phone number
3. Wait for SMS
**Expected Result:** SMS received on specified number

### TC-Alert-013: Alert Push Notifications
**Objective:** Verify push notifications sent
**Steps:**
1. Register device token
2. Create alert with push delivery
3. Observe browser/app notification
**Expected Result:** Push notification appears in real-time

### TC-Alert-014: Batch Alerts
**Objective:** Verify multiple alerts can be managed
**Steps:**
1. Create 50+ alerts
2. Query with pagination
3. Filter by type
**Expected Result:** All alerts stored and queryable

### TC-Alert-015: Alert Deduplication
**Objective:** Verify duplicate alerts not created
**Steps:**
1. Submit same report twice (same image/location)
2. Check alert count
**Expected Result:** Only one alert created (or marked as duplicate)

---

## Navigation & UI Tests

### TC-Nav-001: Landing Page Display
**Objective:** Verify landing page renders correctly
**Steps:**
1. Navigate to http://localhost:3000
2. Verify all sections load
**Expected Result:** Hero section, features, demo video, team info displayed

### TC-Nav-002: Navigation Menu
**Objective:** Verify navigation links work
**Steps:**
1. Click all navigation menu items
2. Verify pages load correctly
**Expected Result:** All links functional, correct pages displayed

### TC-Nav-003: Citizen Login Button
**Objective:** Verify login button navigation
**Steps:**
1. Click "Citizen Login" in navigation
2. Verify redirected to /login
**Expected Result:** Login page displayed

### TC-Nav-004: Admin Dashboard Button
**Objective:** Verify admin dashboard link
**Steps:**
1. Click "Admin Dashboard" button
2. Verify page loaded
**Expected Result:** Admin dashboard displayed (or redirected to login if not authenticated)

### TC-Nav-005: Footer Links
**Objective:** Verify footer contains links
**Steps:**
1. Scroll to page footer
2. Click various footer links
**Expected Result:** All links resolve, no 404 errors

### TC-Nav-006: Home Navigation
**Objective:** Verify logo click returns to home
**Steps:**
1. Navigate to any page
2. Click logo
3. Verify returned to home
**Expected Result:** Home page displayed

### TC-Nav-007: Research Papers Link
**Objective:** Verify research papers page accessible
**Steps:**
1. Navigate to /research-papers
2. Verify papers list loads
**Expected Result:** Research papers page displayed with paper listings

### TC-Nav-008: User Portal Navigation
**Objective:** Verify user can navigate within portal
**Steps:**
1. Login as citizen
2. Navigate between dashboard and history
3. Try logout
**Expected Result:** Navigation works, logout successful

### TC-Nav-009: Protected Route Access
**Objective:** Verify unauthorized users redirected
**Steps:**
1. Try accessing /dashboard without auth
2. Try accessing /user-dashboard without auth
3. Observe redirects
**Expected Result:** Redirected to login page

### TC-Nav-010: Breadcrumb Navigation
**Objective:** Verify breadcrumbs if present
**Steps:**
1. Navigate to nested pages
2. Verify breadcrumb trail shown
3. Click breadcrumb to navigate back
**Expected Result:** Breadcrumbs accurate and functional

### TC-Nav-011: Back Button Functionality
**Objective:** Verify browser back button works
**Steps:**
1. Navigate through multiple pages
2. Click back button
3. Verify correct page history
**Expected Result:** Back button works correctly, history maintained

### TC-Nav-012: Page Title Updates
**Objective:** Verify page titles change correctly
**Steps:**
1. Navigate to different pages
2. Check browser tab title
**Expected Result:** Title reflects current page (e.g., "CleanAI - Dashboard")

### TC-Nav-013: Active Link Highlighting
**Objective:** Verify current page highlighted in nav
**Steps:**
1. Navigate to different pages
2. Check navigation menu highlighting
**Expected Result:** Current page link highlighted/active

### TC-Nav-014: Mobile Navigation Menu
**Objective:** Verify mobile menu works (see Mobile Tests)
**Steps:**
1. Resize to mobile view
2. Click menu hamburger
3. Navigate using mobile menu
**Expected Result:** Menu opens/closes, navigation functional

### TC-Nav-015: Search Functionality
**Objective:** Verify search if available
**Steps:**
1. Use search feature
2. Search for reports/users/areas
3. Verify results displayed
**Expected Result:** Search returns relevant results

---

## Mobile Responsiveness Tests

### TC-Mobile-001: Landing Page Responsive
**Objective:** Verify landing page works on mobile (320px-768px)
**Steps:**
1. Open landing page on mobile
2. Verify all sections visible
3. Check text readability
**Expected Result:** Content adapts to screen, no horizontal scroll needed

### TC-Mobile-002: Login Form Mobile
**Objective:** Verify login accessible on mobile
**Steps:**
1. Load login page on mobile
2. Enter credentials
3. Attempt login
**Expected Result:** Form fully visible, keyboard accommodated, login works

### TC-Mobile-003: Report Submission Mobile
**Objective:** Verify report submission on mobile
**Steps:**
1. Access user dashboard on mobile
2. Upload image
3. Fill form fields
4. Submit report
**Expected Result:** All features work, form responsive, success confirmation shows

### TC-Mobile-004: Image Upload Mobile
**Objective:** Verify mobile image upload
**Steps:**
1. Attempt image upload on mobile
2. Use camera or gallery
3. Upload image
**Expected Result:** Image captured/selected, preview shown, upload works

### TC-Mobile-005: Dashboard Mobile View
**Objective:** Verify admin dashboard on mobile
**Steps:**
1. Load admin dashboard on mobile
2. Verify panels stack vertically
3. Verify all info visible
**Expected Result:** Dashboard usable on small screen, no information lost

### TC-Mobile-006: Map Display Mobile
**Objective:** Verify maps display on mobile
**Steps:**
1. View waste detection map on mobile
2. Interact with map (zoom, pan)
3. View markers/pins
**Expected Result:** Map functional, markers visible, pinch-zoom works

### TC-Mobile-007: Touch Input Validation
**Objective:** Verify touch interactions work
**Steps:**
1. Use touch to interact with elements
2. Verify buttons clickable
3. Verify forms usable with touch keyboard
**Expected Result:** All touch interactions responsive

### TC-Mobile-008: Mobile Font Sizes
**Objective:** Verify text readable on mobile
**Steps:**
1. View page on mobile
2. Check font sizes
3. Verify no text too small
**Expected Result:** All text readable without zoom (14px+ minimum)

### TC-Mobile-009: Mobile Image Sizes
**Objective:** Verify images don't overflow on mobile
**Steps:**
1. View report with image on mobile
2. Verify image fits screen width
3. Verify aspect ratio maintained
**Expected Result:** Images responsive, no overflow, proper dimensions

### TC-Mobile-010: Mobile Navigation Menu
**Objective:** Verify mobile menu usable
**Steps:**
1. Open mobile menu
2. Navigate through menu items
3. Verify menu closes after selection
**Expected Result:** Menu accessible, items selectable, UX smooth

### TC-Mobile-011: Landscape Orientation
**Objective:** Verify app works in landscape
**Steps:**
1. Rotate device to landscape
2. Verify layout adjusts
3. Verify content still visible
**Expected Result:** Layout responds to orientation change

### TC-Mobile-012: Mobile Performance
**Objective:** Verify app performance on mobile
**Steps:**
1. Load app on mobile
2. Measure load time
3. Perform actions and measure response time
**Expected Result:** Load time < 3 seconds, interactions responsive

### TC-Mobile-013: Mobile Touch Targets
**Objective:** Verify buttons are touch-friendly
**Steps:**
1. Verify button sizes (minimum 44x44px)
2. Verify spacing between buttons
**Expected Result:** All buttons easily tappable

### TC-Mobile-014: Mobile Form Input
**Objective:** Verify form inputs mobile-optimized
**Steps:**
1. Fill form fields on mobile
2. Verify proper keyboard shown (email, tel, etc.)
3. Verify input fields have good size
**Expected Result:** Appropriate keyboards shown, fields easy to fill

### TC-Mobile-015: Connectivity Handling
**Objective:** Verify app handles poor connectivity
**Steps:**
1. Enable slow 3G network
2. Perform actions
3. Observe loading states
**Expected Result:** Loading indicators shown, no timeout errors

---

## Performance Tests

### TC-Perf-001: Page Load Time
**Objective:** Verify pages load within acceptable time
**Steps:**
1. Measure load time for each page
2. Use browser DevTools or Lighthouse
**Expected Result:** Load time < 3 seconds for most pages

### TC-Perf-002: Image Load Time
**Objective:** Verify images load quickly
**Steps:**
1. Upload report with large image
2. Measure image load time
**Expected Result:** Image loads within 2 seconds

### TC-Perf-003: API Response Time
**Objective:** Verify API endpoints respond quickly
**Steps:**
1. Measure response time for each endpoint
2. GET /api/reports should be < 500ms
3. POST /api/reports should be < 1000ms (with image processing)
**Expected Result:** Response times within acceptable ranges

### TC-Perf-004: Database Query Time
**Objective:** Verify database queries are optimized
**Steps:**
1. Execute query for 10,000+ records
2. Measure query time
**Expected Result:** Query completes within 500ms

### TC-Perf-005: Dashboard Load Performance
**Objective:** Verify dashboard loads with many reports
**Steps:**
1. Create 1000+ reports
2. Load admin dashboard
3. Measure load time
**Expected Result:** Dashboard loads within 3 seconds

### TC-Perf-006: Memory Usage
**Objective:** Verify app doesn't leak memory
**Steps:**
1. Monitor memory usage during session
2. Perform multiple operations
3. Check memory doesn't continuously increase
**Expected Result:** Stable memory usage, no significant leaks

### TC-Perf-007: Concurrent Users
**Objective:** Verify system handles multiple users
**Steps:**
1. Simulate 10 concurrent users
2. All perform different operations
3. Measure system response
**Expected Result:** System responsive for all users

### TC-Perf-008: Image Processing Performance
**Objective:** Verify image classification completes quickly
**Steps:**
1. Submit image for classification
2. Measure AI processing time
**Expected Result:** Processing within 5 seconds

### TC-Perf-009: UI Rendering Performance
**Objective:** Verify UI renders frames at 60fps
**Steps:**
1. Use Chrome DevTools Performance tab
2. Perform list interactions
3. Check frame rate
**Expected Result:** Consistent 60fps rendering

### TC-Perf-010: Search Performance
**Objective:** Verify search responds quickly
**Steps:**
1. Search with 10,000+ records
2. Measure response time
**Expected Result:** Search completes within 500ms

### TC-Perf-011: Network Waterfall Analysis
**Objective:** Verify optimal resource loading
**Steps:**
1. Use DevTools Network tab
2. Analyze resource loading waterfall
3. Check for critical path optimizations
**Expected Result:** Critical resources load first, parallelization good

### TC-Perf-012: CSS/JS Bundle Size
**Objective:** Verify bundles are optimized
**Steps:**
1. Check main.js bundle size
2. Check CSS bundle size
3. Compare to baselines
**Expected Result:** JS < 500KB, CSS < 100KB (gzipped)

### TC-Perf-013: Cache Effectiveness
**Objective:** Verify caching improves performance
**Steps:**
1. First page load - measure time
2. Second page load (with cache) - measure time
**Expected Result:** Cached loads 50%+ faster

### TC-Perf-014: Lazy Loading
**Objective:** Verify lazy loading improves initial load
**Steps:**
1. Check if images below fold are lazy loaded
2. Verify they load on scroll
**Expected Result:** Images load on demand, not initially

### TC-Perf-015: Database Connection Pooling
**Objective:** Verify connection pooling working
**Steps:**
1. Make rapid database requests
2. Monitor connection usage
**Expected Result:** Connection pool reused, no connection creation delay

---

## Security Tests

### TC-Sec-001: SQL Injection Prevention
**Objective:** Verify app protected against SQL injection
**Steps:**
1. Attempt SQL injection in login form: `' OR '1'='1`
2. Attempt injection in search fields
3. Observe responses
**Expected Result:** Injection attempts fail, errors don't reveal SQL, system secure

### TC-Sec-002: XSS Prevention (Stored)
**Objective:** Verify stored XSS not possible
**Steps:**
1. Submit report with JS in description: `<script>alert('xss')</script>`
2. Retrieve and display report
3. Check if script executes
**Expected Result:** Script not executed, displayed as text

### TC-Sec-003: XSS Prevention (Reflected)
**Objective:** Verify reflected XSS not possible
**Steps:**
1. Craft URL with XSS payload in query param
2. Share/click link
3. Check if script executes
**Expected Result:** Script not executed, safe rendering

### TC-Sec-004: CSRF Protection
**Objective:** Verify CSRF tokens prevent attacks
**Steps:**
1. Check for CSRF token in forms
2. Attempt request without valid token
3. Observe if request rejected
**Expected Result:** Requests without valid token rejected

### TC-Sec-005: Authentication Token Security
**Objective:** Verify JWT tokens are secure
**Steps:**
1. Intercept JWT token
2. Attempt to modify token
3. Use modified token
**Expected Result:** Modified token rejected, validation failed

### TC-Sec-006: Password Storage
**Objective:** Verify passwords properly hashed
**Steps:**
1. Check database for user passwords
2. Verify bcrypt hashing used (not plaintext)
**Expected Result:** Passwords hashed with bcrypt

### TC-Sec-007: HTTPS Enforcement
**Objective:** Verify HTTPS used for sensitive data
**Steps:**
1. Attempt to access login via HTTP
2. Verify forced redirect to HTTPS
**Expected Result:** HTTPS enforced for auth pages

### TC-Sec-008: Authorization Checks
**Objective:** Verify proper authorization
**Steps:**
1. User A attempts to access User B's reports
2. User attempts to access admin functions
3. Observe responses
**Expected Result:** 403 Forbidden returned for unauthorized access

### TC-Sec-009: File Upload Validation
**Objective:** Verify uploaded files are validated
**Steps:**
1. Attempt to upload executable file (.exe, .sh)
2. Attempt to upload oversized file
3. Attempt to upload corrupted image
**Expected Result:** Invalid files rejected

### TC-Sec-010: Rate Limiting
**Objective:** Verify API rate limiting prevents abuse
**Steps:**
1. Make rapid requests to login endpoint (50 in 1 second)
2. Observe if requests rate limited
**Expected Result:** Rate limiter triggered, requests rejected after threshold

### TC-Sec-011: API Key Security
**Objective:** Verify API keys not exposed
**Steps:**
1. Check frontend code for hardcoded keys
2. Check network requests for exposed keys
**Expected Result:** No API keys visible in frontend

### TC-Sec-012: Sensitive Data Exposure
**Objective:** Verify sensitive data not in responses
**Steps:**
1. Intercept API responses
2. Check for passwords, full phone numbers, IDs
**Expected Result:** Sensitive fields removed or masked

### TC-Sec-013: CORS Configuration
**Objective:** Verify CORS properly configured
**Steps:**
1. Attempt request from unauthorized domain
2. Check response headers
**Expected Result:** Unauthorized domains rejected

### TC-Sec-014: Input Validation
**Objective:** Verify all inputs validated
**Steps:**
1. Submit form with negative numbers where positive expected
2. Submit oversized strings
3. Submit special characters
**Expected Result:** Validation rejects invalid input

### TC-Sec-015: Session Timeout
**Objective:** Verify sessions expire after inactivity
**Steps:**
1. Login and note session time
2. Remain inactive for > timeout period
3. Attempt action
**Expected Result:** Session expired, redirected to login

---

## Error Handling Tests

### TC-Error-001: 404 Not Found
**Objective:** Verify 404 handling
**Steps:**
1. Navigate to non-existent page (/invalid-route)
2. Try to access non-existent report
**Expected Result:** 404 error page shown with helpful message

### TC-Error-002: 500 Server Error
**Objective:** Verify 500 error handling
**Steps:**
1. Trigger server error (kill DB connection, etc.)
2. Make request
**Expected Result:** Friendly error message shown, error logged

### TC-Error-003: Network Error Handling
**Objective:** Verify offline/network error handling
**Steps:**
1. Disable internet (or use offline mode)
2. Attempt to submit form
3. Observe response
**Expected Result:** Offline message shown, option to retry

### TC-Error-004: Database Connection Error
**Objective:** Verify DB error handling
**Steps:**
1. Disconnect from database
2. Make API request
**Expected Result:** Error message shown, connection attempted to retry

### TC-Error-005: File Upload Errors
**Objective:** Verify upload error messages
**Steps:**
1. Attempt upload of unsupported file type
2. Attempt oversized file
3. Observe error messages
**Expected Result:** Clear error messages for each case

### TC-Error-006: Validation Error Messages
**Objective:** Verify validation error clarity
**Steps:**
1. Submit form with invalid data
2. Check error messages
**Expected Result:** Messages clearly explain what's wrong

### TC-Error-007: API Error Response Format
**Objective:** Verify consistent error responses
**Steps:**
1. Trigger various API errors
2. Check response format
**Expected Result:** All errors follow consistent format: `{ error: "message", message: "details" }`

### TC-Error-008: AI Service Error
**Objective:** Verify AI service errors handled
**Steps:**
1. Stop AI service
2. Submit report
3. Observe handling
**Expected Result:** Graceful error, system doesn't crash, user notified

### TC-Error-009: Image Processing Error
**Objective:** Verify image processing failures handled
**Steps:**
1. Submit corrupted image
2. Observe error handling
**Expected Result:** Error message shown, user can retry

### TC-Error-010: Timeout Error
**Objective:** Verify timeout errors handled
**Steps:**
1. Make very slow request
2. Wait for timeout
**Expected Result:** Timeout error shown, user can retry

### TC-Error-011: Form Submission Error
**Objective:** Verify form submission errors clear
**Steps:**
1. Submit form when server errors
2. Check error display
**Expected Result:** Error message shown, form data preserved

### TC-Error-012: Authentication Error
**Objective:** Verify auth errors handled
**Steps:**
1. Attempt login with wrong credentials
2. Try with expired token
3. Check error messages
**Expected Result:** Clear auth error messages

### TC-Error-013: Authorization Error
**Objective:** Verify authorization errors handled
**Steps:**
1. Try accessing restricted resource
2. Check error
**Expected Result:** 403 Forbidden with clear message

### TC-Error-014: Error Logging
**Objective:** Verify errors are logged for debugging
**Steps:**
1. Trigger various errors
2. Check error logs
**Expected Result:** Errors logged with timestamp, trace, context

### TC-Error-015: User-Friendly Error Pages
**Objective:** Verify error pages are user-friendly
**Steps:**
1. Navigate to error pages (404, 500)
2. Check page content
**Expected Result:** Pages have helpful information, suggestions for next steps

---

## Test Execution Summary

### Before Running Tests:
1. ✅ Set up test environment with test database
2. ✅ Create test users (citizen, admin, driver)
3. ✅ Populate test data
4. ✅ Configure API endpoints
5. ✅ Ensure AI service running

### Test Tools Recommended:
- **API Testing**: Postman, Insomnia, Thunder Client
- **UI Testing**: Selenium, Cypress, Playwright
- **Performance**: Lighthouse, WebPageTest, Chrome DevTools
- **Security**: OWASP ZAP, Burp Suite
- **Manual Testing**: Mobile devices, browsers

### Test Coverage by Functionality:
| Functionality | Test Cases | Coverage |
|---|---|---|
| Authentication | 10 | ✅ |
| User Dashboard | 15 | ✅ |
| Admin Dashboard | 15 | ✅ |
| Driver Portal | 15 | ✅ |
| Report Management | 15 | ✅ |
| AI Classification | 15 | ✅ |
| Alert System | 15 | ✅ |
| Navigation & UI | 15 | ✅ |
| Mobile Responsive | 15 | ✅ |
| Performance | 15 | ✅ |
| Security | 15 | ✅ |
| Error Handling | 15 | ✅ |
| **TOTAL** | **180** | **✅** |

---

## Test Execution Template

For each test case, use this template:

```
Test Case: TC-[Category]-[Number]
Title: [Test Title]
Status: [ ] Pass [ ] Fail [ ] Skip
Notes: 
[Results and observations]

Issues Found:
[List any bugs or issues]
```

---

## Continuous Integration Recommendations

Add automated testing to CI/CD pipeline:
```bash
# Unit tests
npm test

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e

# Security scan
npm audit

# Performance audit
lighthouse

# Code coverage
npm run coverage
```
