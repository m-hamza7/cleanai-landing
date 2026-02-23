# Report Submission Test Guide

## ✅ Current Status

**Both servers are running:**
- Backend: http://localhost:5000 (or http://192.168.100.3:5000)
- Frontend: http://192.168.100.3:3001 (port 3001, not 3000)

**⚠️ IMPORTANT:** The frontend is running on port **3001** because port 3000 was already in use!

## 🔧 Steps to Test Report Submission

### Option 1: Test via Frontend UI (Recommended)

1. **Access the app from your browser:**
   ```
   http://192.168.100.3:3001/login
   ```

2. **Login with test credentials:**
   - Email: `hamza@cleanai.com`
   - Password: `hamza`

3. **Go to User Dashboard:**
   - After login, you should be redirected automatically
   - Or visit: `http://192.168.100.3:3001/user-dashboard`

4. **Submit a waste report:**
   - Click "Upload Image" and select any image file
   - Enter GPS coordinates (REQUIRED):
     - Latitude: `31.5204` (Lahore coordinates)
     - Longitude: `74.3587`
   - Click "Submit Report"

5. **Expected Result:**
   - Green success message: "Your waste report has been submitted successfully!"
   - The report appears in "Your Recent Reports" section below
   - Image is uploaded to backend `uploads/reports/` folder
   - Data is saved in MySQL `reports` table

### Option 2: Test via Database Direct Check

1. **Open MySQL (via XAMPP):**
   - Open phpMyAdmin: http://localhost/phpmyadmin
   - Select database: `clean_ai`

2. **Check reports table:**
   ```sql
   SELECT * FROM reports ORDER BY submitted_at DESC LIMIT 5;
   ```

3. **Check system logs:**
   ```sql
   SELECT * FROM system_logs ORDER BY created_at DESC LIMIT 10;
   ```

### Option 3: Test via API Direct Call (PowerShell)

1. **Get authentication token:**
   ```powershell
   $login = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method POST -Body (@{email="hamza@cleanai.com"; password="hamza"} | ConvertTo-Json) -ContentType "application/json"
   $token = $login.token
   ```

2. **Submit a report (with a real image file):**
   ```powershell
   $imagePath = "C:\path\to\your\image.jpg"
   $boundary = [System.Guid]::NewGuid().ToString()
   $headers = @{
       "Authorization" = "Bearer $token"
   }
   
   # Create multipart form data manually or use curl
   ```

   Or use curl (if installed):
   ```bash
   curl -X POST http://localhost:5000/api/reports \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -F "image=@test-image.jpg" \
     -F "latitude=31.5204" \
     -F "longitude=74.3587" \
     -F "gps_accuracy=10"
   ```

## 📱 Mobile Device Testing

1. **Connect phone to same WiFi network**

2. **Access from phone browser:**
   ```
   http://192.168.100.3:3001/login
   ```

3. **Login and test report submission:**
   - Use phone camera to capture waste image
   - Use phone GPS (if available) or enter coordinates manually
   - Submit report

## 🐛 Troubleshooting

### Issue: "Failed to submit report"
**Check:**
1. Are both servers running?
2. Is image file selected?
3. Are latitude/longitude filled?
4. Check browser console (F12) for errors
5. Check backend terminal for error logs

### Issue: "Cannot connect to server"
**Check:**
1. Backend running: `http://localhost:5000/api/auth/login` should respond
2. Frontend running: `http://localhost:3001` should load
3. Firewall not blocking ports 3001 and 5000

### Issue: Image not uploading
**Check:**
1. File size < 10MB
2. File type is image (jpg, png, gif)
3. `uploads/reports/` folder exists in backend
4. Folder has write permissions

## 📊 What Gets Stored

When you submit a report, the following data is saved:

**reports table:**
- `report_id` - Auto-generated ID
- `user_id` - Your user ID (from token)
- `image_url` - Path to uploaded image (e.g., `/uploads/reports/1675891234-123456789.jpg`)
- `latitude` - GPS latitude (e.g., `31.5204`)
- `longitude` - GPS longitude (e.g., `74.3587`)
- `gps_accuracy` - Accuracy in meters (default: `0`)
- `submitted_at` - Timestamp of submission
- `status` - Always `'submitted'` for new reports

**system_logs table:**
- Action logged as `'REPORT_SUBMIT'`
- Description: `'New waste report submitted'`
- Timestamp recorded

## ✅ Success Indicators

You'll know the report submitted successfully when:
1. ✅ Green success banner appears at top of dashboard
2. ✅ Report appears in "Your Recent Reports" section
3. ✅ Image file exists in `backend/uploads/reports/` folder
4. ✅ Database `reports` table has new row
5. ✅ Database `system_logs` table has new log entry

## 🔍 Current Setup

- **Database:** clean_ai (MySQL via XAMPP)
- **Test Users:**
  - Citizen: hamza@cleanai.com / hamza
  - Admin: admin@cleanai.com / admin123
- **Backend Port:** 5000
- **Frontend Port:** 3001 (⚠️ changed from 3000)
- **Network IP:** 192.168.100.3

## 📝 Next Steps After Testing

Once report submission works:
1. ✅ Test from mobile device
2. ✅ Test with different image formats/sizes
3. ✅ Test admin dashboard viewing reports
4. ✅ Add more UI fields (waste type, description, priority)
5. ✅ Integrate YOLO AI for waste classification
6. ✅ Add real-time updates with WebSocket

---

**Ready to test! Open your browser and try submitting a report! 🚀**
