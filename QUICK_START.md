# Quick Start Guide - CleanAI User Portal

## 🚀 Getting Started

### 1. Run the Development Server
```bash
npm run dev
# or
pnpm dev
# or
yarn dev
```

### 2. Access the Application
Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📱 User Flow Demo

### Step 1: Navigate to Citizen Login
- Click **"Citizen Login"** button in the navigation
- Or go directly to: `http://localhost:3000/login`

### Step 2: Login
Use these demo credentials:
- **Username**: `hamza`
- **Password**: `hamza`

### Step 3: Submit a Waste Report
1. You'll be redirected to the User Dashboard
2. Click the upload area to select an image (or drag & drop)
3. Select waste type from dropdown (e.g., "Plastic Waste")
4. Enter location (e.g., "Saddar, Karachi")
5. Add description (optional)
6. Click **"Submit Report"**
7. You'll see a success message!

### Step 4: View in Admin Dashboard
1. Open a new tab: `http://localhost:3000/dashboard`
2. Scroll down to **"Citizen Reports"** section
3. Your submitted report will appear here with:
   - The uploaded image
   - Waste type and location
   - Timestamp
   - Status badges

### Step 5: Update Report Status (Admin)
1. In the admin dashboard, find your report
2. Click **"Dispatch Team"** - status changes to "dispatched"
3. Click **"Mark Resolved"** - status changes to "resolved"
4. Go back to User Dashboard to see your reports history

## 🎨 Features to Test

### User Dashboard (`/user-dashboard`)
- ✅ Image upload with live preview
- ✅ Waste type selection (8 categories)
- ✅ Location input
- ✅ Form validation
- ✅ Success notifications
- ✅ Personal reports history in sidebar
- ✅ Logout functionality

### Admin Dashboard (`/dashboard`)
- ✅ Real-time report updates
- ✅ Report status management
- ✅ Image previews
- ✅ Workflow actions (Dispatch/Resolve)
- ✅ Auto-refresh every 2 seconds

## 📝 Notes

### Current Implementation
- Data is stored in **localStorage** (browser storage)
- Reports persist across page refreshes
- Each browser tab has its own data
- No backend/database yet (prototype only)

### Test Multiple Reports
1. Login as user
2. Submit multiple reports with different:
   - Images
   - Waste types
   - Locations
3. View all reports in admin dashboard
4. Test different status workflows

### Clear Data (If Needed)
Open browser console and run:
```javascript
localStorage.clear()
location.reload()
```

## 🎯 Demo Scenarios

### Scenario 1: Plastic Waste in Saddar
- Upload: Photo of plastic bottles
- Type: Plastic Waste
- Location: Saddar, Karachi
- Description: "Large accumulation near market area"

### Scenario 2: Construction Debris
- Upload: Photo of construction waste
- Type: Construction Debris
- Location: DHA Phase 5, Karachi
- Description: "Blocking drainage system"

### Scenario 3: Organic Waste
- Upload: Photo of food waste
- Type: Organic Waste
- Location: Gulshan-e-Iqbal, Karachi
- Description: "Attracting pests, needs immediate attention"

## 🔗 Page Routes

| Route | Description | Access |
|-------|-------------|--------|
| `/` | Homepage with all sections | Public |
| `/login` | Citizen login portal | Public |
| `/user-dashboard` | Waste reporting interface | Protected (requires login) |
| `/dashboard` | Admin monitoring dashboard | Public (will be protected in production) |
| `/research-papers` | Academic references | Public |

## 🎨 UI Components Used

- **shadcn/ui**: Card, Button, Input, Select, Badge, Alert, Textarea
- **Lucide Icons**: Camera, MapPin, Upload, Trash2, LogOut, CheckCircle2
- **Tailwind CSS**: Responsive layouts and styling

## 📸 Screenshot Checklist

For your presentation/demo, capture:
1. ✅ Login page
2. ✅ User dashboard - empty state
3. ✅ Image upload process
4. ✅ Form filled with data
5. ✅ Success message
6. ✅ User's report history sidebar
7. ✅ Admin dashboard with citizen reports
8. ✅ Status update workflow
9. ✅ Mobile responsive views

## 🚧 Future Integration Points

When you're ready to add real functionality:

### AI Model Integration
Look for this comment in the code:
```typescript
// TODO: Replace with actual AI model call
// const aiResult = await analyzeImage(imageFile)
```

### GPS Integration
Look for this comment:
```typescript
// TODO: Replace with actual GPS detection
// const coords = await navigator.geolocation.getCurrentPosition()
```

### Backend API
Replace localStorage calls with API calls:
```typescript
// Current
localStorage.setItem("wasteReports", JSON.stringify(reports))

// Future
await fetch('/api/reports', {
  method: 'POST',
  body: formData
})
```

## ❓ Troubleshooting

### Issue: Reports not showing in admin dashboard
- **Solution**: Make sure you're viewing the same domain (localhost:3000)
- **Reason**: localStorage is domain-specific

### Issue: Can't login
- **Solution**: Use exact credentials: `hamza` / `hamza` (lowercase)

### Issue: Image not uploading
- **Solution**: Check file size (should be reasonable for demo)
- **Reason**: Browser localStorage has size limits (~5-10MB)

### Issue: Reports disappear after browser close
- **Solution**: This is expected - localStorage clears on some browsers
- **For Production**: Will use persistent database

## 📞 Need Help?

Check the detailed documentation in `USER_PORTAL_README.md` for:
- Complete feature list
- Data flow diagrams
- Future enhancement roadmap
- Security considerations
- API endpoint specifications

---

**Happy Testing! 🎉**

Your CleanAI citizen portal is ready for demonstration!
