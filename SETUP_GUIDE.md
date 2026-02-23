# Harvest Payment System - Full Stack Setup Complete ✅

## System Status

### Backend Server
- **URL**: http://localhost:8000
- **Status**: ✅ Running
- **Port**: 8000
- **Command**: `cd backend && venv/bin/python manage.py runserver 0.0.0.0:8000`

### Frontend Server
- **URL**: http://localhost:3000
- **Status**: ✅ Running
- **Port**: 3000
- **Command**: `cd frontend && npm run dev`

---

## Quick Start

### Terminal 1 (Backend):
```bash
cd /Users/akandetomipaul/Documents/Luli/harvest/backend
source venv/bin/activate
python manage.py runserver 0.0.0.0:8000
```

### Terminal 2 (Frontend):
```bash
cd /Users/akandetomipaul/Documents/Luli/harvest/frontend
npm run dev
```

Then open: **http://localhost:3000** in your browser

---

## Features Implemented

### Backend (Django + DRF + JWT)
✅ Django REST Framework setup
✅ JWT authentication (djangorestframework-simplejwt)
✅ Family model (family_name, child_count)
✅ HarvestPayment model (amount, status, method, family FK)
✅ Database migrations applied
✅ Protected API endpoints (requires JWT token)

**API Endpoints:**
- `POST /api/token/` - Get JWT tokens (username, password)
- `POST /api/token/refresh/` - Refresh access token
- `POST /api/add-family-payment/` - Create family + payment [Protected]
- `PUT /api/update-family-payment/` - Add payment to existing family [Protected]

**Admin Credentials:**
- Username: `admin`
- Password: `random345u`
- URL: http://localhost:8000/admin

### Frontend (React + Bootstrap + Vite)
✅ React app with Vite bundler
✅ Bootstrap 5 styling framework
✅ PaymentForm component with:
  - Family name input
  - Number of children input
  - Amount input (currency format)
  - Payment method dropdown
  - Form validation
  - Error/success alerts
  - Loading states
✅ Automatic JWT login on app start
✅ API integration with token-based auth
✅ Responsive design

---

## Testing the System

### 1. Get JWT Token
```bash
curl -X POST http://127.0.0.1:8000/api/token/ \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"random345u"}'
```

Response:
```json
{
  "access": "eyJ...",
  "refresh": "eyJ..."
}
```

### 2. Create Family Payment (Protected)
```bash
curl -X POST http://127.0.0.1:8000/api/add-family-payment/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {ACCESS_TOKEN}" \
  -d '{
    "family_name": "Smith",
    "child_count": 3,
    "amount": "200.00",
    "payment_method": "bank_transfer"
  }'
```

Response:
```json
{
  "status": "success",
  "family_id": 1,
  "payment_id": 1
}
```

### 3. Use Frontend Form
Open http://localhost:3000 in browser:
- Form auto-authenticates with admin credentials
- Fill in family details
- Click "Submit Payment"
- Success message appears with created IDs

---

## Project Structure

```
harvest/
├── backend/
│   ├── harvest/          # Django project (settings, urls, wsgi)
│   ├── juvenileharvest/  # Django app (models, views, urls)
│   ├── manage.py
│   ├── db.sqlite3        # Database
│   └── venv/             # Python virtual environment
├── frontend/
│   ├── src/
│   │   ├── App.jsx       # Main component
│   │   ├── App.css       # Styling
│   │   ├── PaymentForm.jsx  # Form component
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── node_modules/
├── LICENSE
└── README.md
```

---

## Next Steps

1. **Add more API endpoints:**
   - GET /api/families/ - List all families
   - GET /api/payments/ - List all payments
   - DELETE /api/families/{id}/ - Delete family

2. **Frontend enhancements:**
   - List families and payments
   - Edit/delete family records
   - Filter and sort data
   - Dashboard with statistics

3. **Production:**
   - Use PostgreSQL instead of SQLite
   - Deploy to production server (Heroku, AWS, etc.)
   - Add CORS configuration for different domains
   - Implement refresh token rotation
   - Add user roles and permissions

4. **Testing:**
   - Unit tests for models
   - API endpoint tests (pytest)
   - React component tests (Vitest/Jest)
   - E2E tests (Cypress/Playwright)

---

## Useful Commands

### Backend
```bash
# Create migrations
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Run tests
python manage.py test

# Reset database
python manage.py flush
```

### Frontend
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## Troubleshooting

**Backend won't start:**
- Ensure port 8000 is free: `lsof -i :8000`
- Check virtual environment is activated
- Run migrations: `python manage.py migrate`

**Frontend won't start:**
- Ensure port 3000 is free: `lsof -i :3000`
- Delete node_modules and reinstall: `rm -rf node_modules && npm install`
- Check Node.js version: `node --version` (requires 16+)

**API errors:**
- Verify JWT token is included in Authorization header
- Check backend logs for detailed error messages
- Ensure CORS is configured if frontend is on different domain

---

## Technology Stack

**Backend:**
- Python 3.14
- Django 6.0.2
- Django REST Framework
- djangorestframework-simplejwt (JWT)
- SQLite3

**Frontend:**
- React 18.2.0
- Vite 5.4.21
- Bootstrap 5.3+
- Axios (HTTP client)
- Node.js 16+

---

**Created**: February 21, 2026
**Status**: ✅ Production Ready (for development)
**Organization**: Luli Parish
