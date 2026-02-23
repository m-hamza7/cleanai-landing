# 📱 MOBILE ACCESS GUIDE - CleanAI

**Last Updated:** February 6, 2026  
**Status:** ✅ Configured for Network Access

---

## 🌐 Access URLs

### On Your Computer (Localhost)
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000/api

### On Your Phone (Same WiFi Network)
- **Frontend:** http://192.168.100.3:3000
- **Backend API:** http://192.168.100.3:5000/api

**Your Computer's IP Address:** `192.168.100.3`

---

## ✅ Configuration Applied

### 1. Next.js Network Access ✅
- Modified `package.json` to bind to `0.0.0.0` (all network interfaces)
- Server now accepts connections from local network
- Command: `next dev -H 0.0.0.0`

### 2. Windows Firewall Rules ✅
- Added rule for port 3000 (Frontend)
- Added rule for port 5000 (Backend API)
- Both ports now allow incoming connections

### 3. API URL Configuration ✅
- Updated `.env.local` with your IP address
- API calls will work from mobile devices
- Backend URL: `http://192.168.100.3:5000/api`

---

## 📱 HOW TO ACCESS FROM YOUR PHONE

### Step 1: Connect to Same WiFi
Make sure your phone is connected to the **same WiFi network** as your computer.

### Step 2: Open Browser on Phone
- Open Safari (iPhone) or Chrome (Android)
- Type in the URL bar: `http://192.168.100.3:3000`

### Step 3: Test the Website
1. **Landing Page:** http://192.168.100.3:3000
2. **Login Page:** http://192.168.100.3:3000/login
3. **Try logging in with:** hamza@cleanai.com / hamza

---

## 🧪 TESTING CHECKLIST

### On Computer (Before Testing on Phone)
- [ ] Frontend server running: ✅ http://localhost:3000
- [ ] Backend server running: ✅ http://localhost:5000
- [ ] Login works on computer
- [ ] Can submit reports on computer

### On Phone
- [ ] Connected to same WiFi as computer
- [ ] Can access: http://192.168.100.3:3000
- [ ] Landing page loads properly
- [ ] Can navigate to login page
- [ ] Can login with credentials
- [ ] Can submit waste reports
- [ ] Images upload successfully
- [ ] Reports appear in database

---

## 🔧 SERVER STATUS

### Frontend Server
```
▲ Next.js 14.2.16
- Local:   http://localhost:3000
- Network: http://0.0.0.0:3000
✓ Ready
```

### Backend Server
```
🚀 CleanAI Backend Server
- API: http://localhost:5000
- Database: ✅ Connected
```

---

## 🚨 TROUBLESHOOTING

### Phone Can't Access Website

#### Issue 1: Different WiFi Networks
**Symptom:** Page doesn't load, "can't reach server"  
**Solution:** 
- Make sure phone and computer are on **same WiFi network**
- Check WiFi name on both devices
- Computer WiFi: Check in system tray
- Phone WiFi: Check in Settings

#### Issue 2: Firewall Blocking
**Symptom:** Connection timeout  
**Solution:**
```powershell
# Run these commands on your computer:
netsh advfirewall firewall add rule name="Next.js Dev Server" dir=in action=allow protocol=TCP localport=3000
netsh advfirewall firewall add rule="Express Backend" dir=in action=allow protocol=TCP localport=5000
```

#### Issue 3: IP Address Changed
**Symptom:** Website was working, now doesn't load  
**Solution:**
Your computer's IP may have changed. Check new IP:
```powershell
ipconfig | Select-String -Pattern "IPv4"
```
Then update `.env.local` with new IP and restart servers.

#### Issue 4: Backend API Fails
**Symptom:** Login doesn't work, API calls fail  
**Solution:**
- Check `.env.local` has correct IP: `NEXT_PUBLIC_API_URL=http://192.168.100.3:5000/api`
- Restart frontend server: `npm run dev`
- Clear browser cache on phone

---

## 📝 QUICK COMMANDS

### Find Your IP Address
```powershell
ipconfig | Select-String -Pattern "IPv4"
```

### Add Firewall Rules
```powershell
netsh advfirewall firewall add rule name="Next.js Dev Server" dir=in action=allow protocol=TCP localport=3000
netsh advfirewall firewall add rule name="Express Backend" dir=in action=allow protocol=TCP localport=5000
```

### Test from Computer
```powershell
# Test with your IP (simulate phone access)
curl http://192.168.100.3:3000
curl http://192.168.100.3:5000/api/health
```

### Restart Servers
```powershell
# Kill all Node processes
taskkill /F /IM node.exe

# Start backend
cd backend
npm run dev

# Start frontend (new terminal)
cd ..
npm run dev
```

---

## 🎯 DEMO TIPS FOR PRESENTATION

### Why Mobile Access is Important

1. **Real-World Simulation**
   - Show how citizens would actually use the app
   - Demonstrate mobile responsiveness
   - Prove it works on actual devices

2. **Impressive for Examiners**
   - Shows complete full-stack deployment
   - Demonstrates network configuration skills
   - Proves API integration works across devices

3. **Live Testing**
   - Take photos on phone camera
   - Upload in real-time
   - Show in database immediately
   - Demonstrate GPS coordinates (if implemented)

### Demo Flow (5 minutes)

1. **Show on Computer First** (2 min)
   - Open http://localhost:3000
   - Show landing page features
   - Login and submit report

2. **Switch to Phone** (2 min)
   - Open http://192.168.100.3:3000 on phone
   - Login with same credentials
   - Submit report with phone camera
   - Show responsive design

3. **Verify in Database** (1 min)
   - Open phpMyAdmin on computer
   - Show both reports in `reports` table
   - Explain how data flows through system

---

## 🔐 SECURITY NOTE

**Important:** This configuration is for **development/testing only**.

For production deployment:
- Use HTTPS instead of HTTP
- Configure proper firewall rules
- Use environment-specific configurations
- Deploy to cloud platform (AWS, Azure, Vercel)
- Use production database
- Implement rate limiting
- Add API authentication beyond JWT

---

## 📊 Network Architecture

```
┌─────────────────────────────────────────┐
│         Local WiFi Network              │
│         (192.168.100.x)                 │
│                                         │
│  ┌──────────────┐    ┌──────────────┐ │
│  │  Computer    │    │   Phone      │ │
│  │ .100.3       │    │ .100.XX      │ │
│  │              │    │              │ │
│  │ ┌──────────┐ │    │ ┌──────────┐ │ │
│  │ │Frontend  │◄├────┤►│ Browser  │ │ │
│  │ │Port 3000 │ │    │ └──────────┘ │ │
│  │ └────┬─────┘ │    │              │ │
│  │      │       │    │              │ │
│  │ ┌────▼─────┐ │    │              │ │
│  │ │Backend   │◄├────┼──────────────┤ │
│  │ │Port 5000 │ │    │   API Calls  │ │
│  │ └────┬─────┘ │    └──────────────┘ │
│  │      │       │                      │
│  │ ┌────▼─────┐ │                      │
│  │ │MySQL     │ │                      │
│  │ │Port 3306 │ │                      │
│  │ └──────────┘ │                      │
│  └──────────────┘                      │
└─────────────────────────────────────────┘
```

---

## ✅ VERIFICATION STEPS

### 1. Test on Computer
```
✅ http://localhost:3000 - Works
✅ http://192.168.100.3:3000 - Works (using IP)
✅ Login successful
✅ API calls working
```

### 2. Test on Phone
```
□ Open http://192.168.100.3:3000
□ Landing page loads
□ Click "Citizen Login"
□ Enter: hamza@cleanai.com / hamza
□ Dashboard loads
□ Submit test report
□ Success message appears
```

### 3. Verify in Database
```
□ Open phpMyAdmin
□ Check `reports` table
□ See new report from phone
□ Check `system_logs` for LOGIN action
```

---

## 📞 QR CODE ACCESS (OPTIONAL)

Want to make it even easier? Generate a QR code:

1. **Visit:** https://www.qr-code-generator.com/
2. **Select:** URL type
3. **Enter:** http://192.168.100.3:3000
4. **Generate** and download QR code
5. **Scan** with phone camera to instantly open website

This is great for presentations - show the QR code on screen, scan with phone, instant access!

---

## 🎓 FILES MODIFIED

### 1. `package.json`
```json
"scripts": {
  "dev": "next dev -H 0.0.0.0"  // Added -H 0.0.0.0
}
```

### 2. `.env.local`
```env
NEXT_PUBLIC_API_URL=http://192.168.100.3:5000/api
```

### 3. Windows Firewall
- Rule added for port 3000
- Rule added for port 5000

---

## 🚀 YOU'RE READY!

**On Your Phone, Open:**
```
http://192.168.100.3:3000
```

**Login with:**
```
Email: hamza@cleanai.com
Password: hamza
```

---

## 💡 PRO TIPS

1. **Keep Computer Awake**
   - Go to Settings → Power → Sleep → Never
   - Or keep power adapter connected

2. **Use Presentation Mode**
   - Easier to show on projector
   - Mirror phone screen to computer
   - Use Chrome DevTools device emulation for testing

3. **Prepare Backup**
   - Screenshot key pages
   - Record screen video
   - In case WiFi fails during demo

4. **Battery Management**
   - Keep computer plugged in
   - Charge phone before demo
   - Backend uses some CPU

---

**✅ MOBILE ACCESS IS NOW CONFIGURED!**

**Test it now:**
1. Open phone browser
2. Go to: http://192.168.100.3:3000
3. Login and test!

If you need to change IP or have issues, refer to the troubleshooting section above.
