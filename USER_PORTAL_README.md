# User Portal Features

This document describes the new citizen reporting features added to the CleanAI platform.

## New Pages

### 1. Login Page (`/login`)
- **Route**: `/login`
- **Purpose**: Authentication portal for citizens
- **Credentials** (Demo):
  - Username: `hamza`
  - Password: `hamza`
- **Features**:
  - Simple, clean UI with CleanAI branding
  - Form validation
  - Error handling
  - Responsive design
  - Auto-redirect to user dashboard on success

### 2. User Dashboard (`/user-dashboard`)
- **Route**: `/user-dashboard`
- **Purpose**: Citizen portal for waste reporting
- **Protected**: Requires login
- **Features**:
  - Image upload with preview
  - Waste type selection (8 categories)
  - Location input (manual entry)
  - Optional description field
  - Real-time report submission
  - View personal report history
  - Success notifications
  - Logout functionality

### 3. Admin Dashboard Update (`/dashboard`)
- **New Component**: Citizen Reports Panel
- **Features**:
  - Display all user-submitted reports
  - Real-time updates (polls every 2 seconds)
  - Report status management:
    - Submitted → Dispatched → Resolved
  - Action buttons for workflow
  - Image previews
  - Timestamp tracking

## Data Flow

### Current (Prototype) Implementation
```
User Upload → localStorage → Admin Dashboard
```

1. User logs in at `/login`
2. Uploads image + metadata at `/user-dashboard`
3. Data saved to `localStorage`:
   - `wasteReports` - User's personal reports
   - `adminWasteReports` - Admin dashboard data
4. Admin dashboard reads from `adminWasteReports`
5. Real-time polling keeps data synced

### Future (Production) Implementation
```
User Upload → API → Database → Admin Dashboard
User Upload → AI Model → Auto-detection → Database
User Upload → GPS Service → Geolocation → Database
```

## Components Created

### 1. `/app/login/page.tsx`
- Login form with validation
- LocalStorage-based authentication
- Responsive card layout

### 2. `/app/user-dashboard/page.tsx`
- Multi-section layout:
  - Image upload area
  - Waste type selector
  - Location input
  - Description textarea
  - Recent reports sidebar
- Form validation
- Image preview
- Success/error states

### 3. `/components/dashboard/user-reports-panel.tsx`
- Scrollable report list
- Status badges with colors
- Action buttons for workflow
- Auto-refresh capability

## Waste Type Categories

1. Plastic Waste
2. Organic Waste
3. Metal Waste
4. Paper/Cardboard
5. Glass
6. Electronic Waste
7. Construction Debris
8. Mixed Waste

## Report Status Workflow

```
submitted → dispatched → resolved
```

- **Submitted**: New report from citizen
- **Dispatched**: Cleanup team assigned
- **Resolved**: Cleanup completed

## Integration Points for AI Model

### Image Analysis
```typescript
// Current (placeholder)
wasteType: wasteType || "Plastic"

// Future implementation
const aiResult = await analyzeImage(imageFile)
wasteType: aiResult.detectedType
confidence: aiResult.confidence
```

### Location Detection
```typescript
// Current (manual input)
location: location || "Karachi, Pakistan"

// Future implementation
const gpsData = await navigator.geolocation.getCurrentPosition()
location: {
  lat: gpsData.coords.latitude,
  lng: gpsData.coords.longitude,
  address: await reverseGeocode(gpsData)
}
```

### Auto-verification
```typescript
// Future feature
const verification = await verifyWasteImage(imageFile)
if (verification.isValid) {
  // Process report
} else {
  // Show error to user
}
```

## Styling & UI

- **Design System**: shadcn/ui components
- **Styling**: Tailwind CSS
- **Theme**: Consistent with existing dashboard
- **Colors**:
  - Primary: Green (environmental focus)
  - Accents: Blue, Orange
  - Status colors: Yellow, Blue, Orange, Green
- **Responsive**: Mobile-first approach
- **Accessibility**: Proper labels, ARIA attributes

## Testing

### Manual Testing Steps

1. **Login Flow**:
   - Navigate to `/login`
   - Enter credentials (hamza/hamza)
   - Verify redirect to `/user-dashboard`

2. **Image Upload**:
   - Upload a test image
   - Select waste type
   - Enter location
   - Submit report
   - Check success message

3. **Report Display**:
   - Verify report appears in sidebar
   - Navigate to `/dashboard`
   - Verify report appears in Citizen Reports panel

4. **Status Updates**:
   - Click "Dispatch Team" button
   - Verify status changes to "dispatched"
   - Click "Mark Resolved" button
   - Verify status changes to "resolved"

5. **Persistence**:
   - Refresh page
   - Verify reports persist
   - Logout and login again
   - Verify reports still visible

## Future Enhancements

### Phase 1: Backend Integration
- [ ] Replace localStorage with API calls
- [ ] Implement proper authentication (JWT/OAuth)
- [ ] Database schema for reports
- [ ] File upload to cloud storage (S3/Cloudinary)

### Phase 2: AI Integration
- [ ] YOLOv8 model integration for waste detection
- [ ] Confidence scoring for AI predictions
- [ ] Multi-object detection in single image
- [ ] Image quality validation

### Phase 3: Location Services
- [ ] Browser geolocation API
- [ ] GPS coordinate capture
- [ ] Reverse geocoding
- [ ] Map-based location picker
- [ ] Integration with waste detection map

### Phase 4: Advanced Features
- [ ] Push notifications for status updates
- [ ] Email notifications
- [ ] SMS alerts
- [ ] Citizen impact dashboard (reports submitted, cleanups completed)
- [ ] Gamification (points, badges, leaderboards)
- [ ] Social sharing
- [ ] Report verification by other citizens
- [ ] Before/after photos

### Phase 5: Mobile App
- [ ] React Native mobile app
- [ ] Native camera integration
- [ ] Offline mode
- [ ] Background location tracking
- [ ] Native push notifications

## Security Considerations

### Current Implementation
⚠️ **Note**: Current implementation is for PROTOTYPE/DEMO purposes only

### Production Requirements
- [ ] Secure authentication (JWT tokens, refresh tokens)
- [ ] Password hashing (bcrypt, argon2)
- [ ] Rate limiting on uploads
- [ ] Image validation and sanitization
- [ ] File size limits
- [ ] CSRF protection
- [ ] XSS prevention
- [ ] SQL injection prevention
- [ ] Role-based access control (RBAC)
- [ ] Audit logging

## Performance Optimization

### Future Optimizations
- [ ] Image compression before upload
- [ ] Lazy loading for report lists
- [ ] Virtual scrolling for large datasets
- [ ] Caching strategies
- [ ] CDN for image delivery
- [ ] WebP format for images
- [ ] Progressive image loading

## API Endpoints (Future)

```typescript
// Authentication
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/refresh

// Reports
POST /api/reports - Create new report
GET /api/reports - Get all reports (admin)
GET /api/reports/user/:userId - Get user reports
PATCH /api/reports/:id/status - Update report status
DELETE /api/reports/:id - Delete report

// Upload
POST /api/upload/image - Upload image to cloud storage

// AI Analysis
POST /api/ai/analyze - Analyze image with AI model
POST /api/ai/verify - Verify waste detection

// Location
POST /api/location/geocode - Get address from coordinates
POST /api/location/reverse - Get coordinates from address
```

## Database Schema (Future)

```typescript
interface Report {
  id: string
  userId: string
  imageUrl: string
  imageKey: string // S3 key
  wasteType: string
  aiDetectedType?: string
  aiConfidence?: number
  location: {
    lat: number
    lng: number
    address: string
    city: string
    country: string
  }
  description?: string
  status: 'submitted' | 'verified' | 'dispatched' | 'resolved' | 'rejected'
  dispatchedTo?: string // Fleet ID
  resolvedAt?: Date
  createdAt: Date
  updatedAt: Date
}

interface User {
  id: string
  username: string
  email: string
  passwordHash: string
  role: 'citizen' | 'admin' | 'fleet_manager'
  reportsSubmitted: number
  reportsResolved: number
  createdAt: Date
}
```

## Navigation Updates

The main navigation has been updated to include:
- **Citizen Login** button - Links to `/login`
- **Admin Dashboard** button - Links to `/dashboard`

Users can access either portal from the homepage.
