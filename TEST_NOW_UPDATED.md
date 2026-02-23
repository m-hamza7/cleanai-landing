# 🎯 READY TO TEST - Report Submission

## ✅ All Systems Operational

### Servers Running:
- ✅ **Backend API**: http://localhost:5000 (Running)
- ✅ **Frontend UI**: http://192.168.100.3:3001 (Running on port 3001)
- ✅ **Database**: MySQL via XAMPP (Connected)

### Test Credentials:
- **Email**: `hamza@cleanai.com`
- **Password**: `hamza`

## 🚀 Quick Test Steps

1. **Login Page is now open in browser** at:
   ```
   http://192.168.100.3:3001/login
   ```

2. **Enter credentials:**
   - Email: hamza@cleanai.com
   - Password: hamza
   - Click "Sign In"

3. **You'll be redirected to User Dashboard**

4. **Submit a Waste Report:**
   - Click "Upload Image" button
   - Select any image file from your computer
   - You'll see an image preview
   - Enter GPS coordinates (REQUIRED):
     - **Latitude**: `31.5204`
     - **Longitude**: `74.3587`
   - Click "Submit Report"

5. **Expected Result:**
   - ✅ Green success message appears
   - ✅ Report shows in "Your Recent Reports" section
   - ✅ Image is uploaded to backend
   - ✅ Data saved in database

## 📊 Backend Report Submission Flow

When you submit a report, here's what happens:

1. **Frontend** (`user-dashboard/page.tsx`):
   - Creates FormData with image + GPS coordinates
   - Sends POST request to `http://192.168.100.3:5000/api/reports`
   - Includes JWT token in Authorization header

2. **Backend** (`routes/reports.js`):
   - Verifies JWT token
   - Validates image file (type, size < 10MB)
   - Saves image to `uploads/reports/` folder
   - Inserts record into `reports` table:
     ```sql
     INSERT INTO reports (
       user_id, 
       image_url, 
       latitude, 
       longitude, 
       gps_accuracy, 
       submitted_at, 
       status
     ) VALUES (?, ?, ?, ?, ?, NOW(), 'submitted')
     ```
   - Logs action to `system_logs` table
   - Returns success response with `report_id` and `image_url`

3. **Frontend** (after success):
   - Shows green success banner
   - Clears form fields
   - Reloads reports list
   - Displays new report in "Your Recent Reports"

## 🔍 Verify Report in Database

Open phpMyAdmin (http://localhost/phpmyadmin) and run:

```sql
USE clean_ai;

-- Check latest reports
SELECT 
  r.report_id,
  r.user_id,
  u.name as user_name,
  r.image_url,
  r.latitude,
  r.longitude,
  r.submitted_at,
  r.status
FROM reports r
LEFT JOIN user u ON r.user_id = u.user_id
ORDER BY r.submitted_at DESC
LIMIT 5;

-- Check system logs
SELECT * FROM system_logs 
WHERE action_type = 'REPORT_SUBMIT'
ORDER BY created_at DESC 
LIMIT 10;
```

## 📱 Mobile Testing (Next Step)

After desktop testing works:

1. **Find your computer's IP**: `192.168.100.3` (already configured)
2. **Connect phone to same WiFi network**
3. **Open phone browser**: `http://192.168.100.3:3001/login`
4. **Login and submit report from phone**

## 🐛 If Something Goes Wrong

### Check Backend Logs:
Look at the terminal where `node server.js` is running for any errors.

### Check Browser Console:
Press F12 in browser and check Console tab for JavaScript errors.

### Common Issues:

**"Failed to submit report"**
- Make sure image is selected
- Make sure latitude and longitude are filled
- Check if file size is < 10MB

**"Network Error"**
- Check if backend is still running on port 5000
- Try accessing: http://localhost:5000/api/auth/login directly

**"Token expired"**
- Logout and login again to get fresh token

## 📁 Files Involved

### Frontend:
- `app/user-dashboard/page.tsx` - Main UI component
- `lib/api-client.ts` - API communication
- `.env.local` - API URL configuration

### Backend:
- `backend/routes/reports.js` - Report submission endpoint
- `backend/routes/auth.js` - Authentication & JWT
- `backend/config/database.js` - MySQL connection
- `backend/uploads/reports/` - Image storage folder

### Database:
- `reports` table - Stores report data
- `system_logs` table - Logs all actions
- `user` table - User information

## ✨ What's Working

✅ User authentication with JWT
✅ File upload with multer
✅ GPS coordinates validation
✅ Database insertion
✅ System logging
✅ Role-based access (citizens see only their reports)
✅ Network access from mobile devices
✅ Responsive UI design

## 🎯 Current Task

**TEST THE REPORT SUBMISSION NOW!**

1. Login page is open in browser
2. Login with hamza@cleanai.com / hamza
3. Upload an image and enter GPS coordinates
4. Click Submit Report
5. Verify success message and report appears in list

---

**Everything is ready! Go ahead and test! 🚀**

Need help? Check the detailed guide in `REPORT_SUBMISSION_TEST.md`
