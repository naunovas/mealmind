#  MealMind

Smart meal planning and recipe recommendation system built with FastAPI and React.

## Tech Stack

**Backend**
- FastAPI
- SQLAlchemy
- PostgreSQL
- JWT Authentication

**Frontend**
- React (Vite)
- Axios
- React Router
- Context API

##  Features

-  User registration and login with JWT
-  Recipe CRUD (Create, Read, Update, Delete)
-  Search and filter recipes by title, difficulty, calories
-  Ingredients system
-  Weekly meal planner
-  Role-based access (user/admin)

##  Project Structure
mealmind/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── core/        (auth, config, dependencies)
│   │   ├── models/      (DB tables)
│   │   ├── schemas/     (Pydantic)
│   │   ├── routes/      (API endpoints)
│   │   └── db/          (connection)
│   └── requirements.txt
├── frontend/
│   └── src/
│       ├── pages/
│       ├── context/
│       ├── services/
│       └── App.jsx
└── README.md

##  Setup

### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Environment Variables
Create `.env` in `/backend`:
DATABASE_URL=postgresql://user:password@localhost:5433/mealmind
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

##  API Docs

After starting the backend, visit:
`http://localhost:8000/docs`
