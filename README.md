# Harvest Payment System

A full-stack application for managing family payments and juvenile harvest records.

## Project Structure

```
harvest/
├── backend/              # Django REST API
│   ├── harvest/          # Django project settings
│   ├── juvenileharvest/  # Django app (models, views, migrations)
│   ├── .venv/            # Virtual environment (managed by uv)
│   ├── manage.py         # Django management script
│   └── db.sqlite3        # SQLite database
├── frontend/             # React application
│   ├── src/              # React source files
│   ├── package.json      # Node dependencies
│   ├── vite.config.js    # Vite configuration
│   └── index.html        # HTML entry point
├── LICENSE
└── README.md             # This file
```

## Backend Setup

### Prerequisites
- Python 3.10+
- [uv](https://github.com/astral-sh/uv) (dependency manager)


### Installation & Running

```bash
cd backend
uv venv  # (optional, creates .venv if not present)
source .venv/bin/activate
uv pip install -r requirements.txt  # Only if you have requirements.txt to migrate
uv pip install -e .  # Or use uv add <package> to add dependencies
python manage.py migrate
python manage.py runserver
```

The API will be available at `http://localhost:8000`.

**Django Admin:** `http://localhost:8000/admin/`
- Username: `admin`
- Password: `random345u`

### API Endpoints

- **POST** `/api/add-family-payment/` - Create a family and payment
  ```json
  {
    "family_name": "Smith",
    "child_count": 3,
    "amount": "100.00",
    "payment_method": "cash"
  }
  ```

- **PUT** `/api/update-family-payment/` - Create payment for existing family
  ```json
  {
    "family_id": 1,
    "amount": "50.00",
    "payment_method": "bank_transfer"
  }
  ```

### Models

- **Family** - Contains family name and child count
- **HarvestPayment** - Payment records with family FK, amount, status, and method

## Frontend Setup

### Prerequisites
- Node.js 16+
- npm

### Installation & Running

```bash
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:3000`.

### Features
- Displays API endpoints
- Proxy to backend API (`/api` routes forward to Django)
- Built with Vite + React

## Development

### Backend Development
- Models: `backend/juvenileharvest/models.py`
- Views: `backend/juvenileharvest/views.py`
- URLs: `backend/juvenileharvest/urls.py`
- Settings: `backend/harvest/settings.py`

### Frontend Development
- Main App: `frontend/src/App.jsx`
- Styling: `frontend/src/App.css`
- Config: `frontend/vite.config.js`

## Running Both Servers


Terminal 1 (Backend):
```bash
cd backend
source .venv/bin/activate
python manage.py runserver
```

Terminal 2 (Frontend):
```bash
cd frontend
npm run dev
```

Then navigate to `http://localhost:3000` in your browser.

## Next Steps

- Add more API endpoints (GET, DELETE for families/payments)
- Create admin interface in React
- Add form components for creating families and payments
- Implement authentication/authorization
- Add tests for models, views, and components
