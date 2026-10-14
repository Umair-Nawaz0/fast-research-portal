# FAST University Research Opportunity Portal

**Institution:** National University of Computer & Emerging Sciences (FAST-NUCES), Peshawar Campus  
**Course:** Computer Networks (CN) — Assignment #01  
**Program:** BS (CS 5C) — Semester Fall-2026  
**Student Name:** Umair Nawaz  
**GitHub Repository:** https://github.com/Umair-Nawaz0/fast-research-portal  
**Postman Collection:** `backend/postman/University_Research_Opportunity_Portal.postman_collection.json`  
**Demonstration Video:** [`demonstration_video.mp4`](./demonstration_video.mp4) (Duration: 53.4s — per assignment requirement $\le$ 1 minute)  


A modern, full-stack, university-grade research opportunity portal developed for **FAST-NUCES**.


The system connects undergraduate and graduate students directly with faculty-led research projects, laboratory assistantships, and Final Year Project (FYP) collaborations in Computer Networks, Distributed Systems, Cybersecurity, and AI.

The application features a **FastAPI (Python) backend** powered by **SQLAlchemy** and a **PostgreSQL** database, seamlessly integrated with a responsive **Next.js (React 19, TypeScript, Tailwind CSS)** frontend.

---

## 🚀 Tech Stack

### Backend
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/) (Python 3.10+)
- **ORM**: [SQLAlchemy 2.0](https://www.sqlalchemy.org/)
- **Database**: [PostgreSQL](https://www.postgresql.org/) (Database: `research_opportunity_portal`)
- **Validation**: [Pydantic v2](https://docs.pydantic.dev/)
- **ASGI Server**: [Uvicorn](https://www.uvicorn.org/)
- **API Documentation**: Interactive OpenAPI / Swagger UI at `http://127.0.0.1:8000/docs`

### Frontend
- **Framework**: [Next.js](https://nextjs.org/) (App Router, React 19)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict typing)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components & Icons**: Radix UI primitives, [Lucide React](https://lucide.dev/)
- **Notifications**: [Sonner](https://sonner.emilkowal.ski/) toast system
- **API Client**: Centralized service (`src/lib/api.ts`) connecting to `NEXT_PUBLIC_API_URL`

---

## 📁 Project Architecture

```
fast-research-portal/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── config.py             # Environment configuration (pydantic/dotenv)
│   │   ├── crud.py               # Database transactions & CRUD queries
│   │   ├── database.py           # SQLAlchemy engine & session factory
│   │   ├── main.py               # FastAPI app, CORS, routes & docs
│   │   ├── models.py             # PostgreSQL SQLAlchemy models
│   │   └── schemas.py            # Pydantic request/response schemas
│   ├── tests/
│   │   ├── __init__.py
│   │   └── test_api.py           # Pytest test suite for all endpoints
│   ├── postman/
│   │   ├── University_Research_Opportunity_Portal.postman_collection.json
│   │   └── University_Research_Opportunity_Portal.postman_environment.json
│   ├── .env                      # Local backend secrets (git-ignored)

│   ├── .env.example              # Backend environment template
│   ├── requirements.txt          # Python dependencies
│   └── venv/                     # Python virtual environment
├── database/
│   └── schema.sql                # PostgreSQL table DDL definition
├── src/
│   ├── app/
│   │   ├── globals.css           # Styling & theme variables
│   │   ├── layout.tsx            # Root layout with Toast provider
│   │   └── page.tsx              # Main dashboard view
│   ├── components/
│   │   ├── ui/                   # Base primitives (Button, Card, Badge, Dialog, etc.)
│   │   ├── navbar.tsx            # Header & sample seed trigger
│   │   ├── stats-cards.tsx       # Aggregate metric cards
│   │   ├── filter-bar.tsx        # Search, filters, and view mode toggle
│   │   ├── opportunity-card.tsx  # Grid view card item
│   │   ├── opportunity-table.tsx # Data table view
│   │   ├── opportunity-detail-modal.tsx # Detailed opportunity viewer
│   │   ├── opportunity-form-modal.tsx   # Opportunity create/edit form
│   │   ├── delete-confirm-modal.tsx     # Delete confirmation dialog
│   │   ├── empty-state.tsx       # Zero-results state
│   │   ├── loading-state.tsx     # Skeletons for grid and table
│   │   └── footer.tsx            # University footer
│   ├── context/
│   │   └── opportunities-context.tsx # Real-time state & API integration
│   ├── lib/
│   │   ├── api.ts                # Centralized typed API service
│   │   ├── mock-data.ts          # Sample data for initial seeding
│   │   └── utils.ts              # Helpers and date utilities
│   └── types/
│       └── opportunity.ts        # TypeScript interfaces
├── .env.local                    # Frontend environment (git-ignored)
├── .env.example                  # Frontend environment template
├── .gitignore
├── package.json
└── tsconfig.json
```

---

## 🗄️ Database Setup (PostgreSQL on Linux)

The system uses a single table named `opportunities` inside the `research_opportunity_portal` database.

### 1. Ensure PostgreSQL is Running
```bash
sudo systemctl start postgresql
sudo systemctl status postgresql
```

### 2. Create the Database & Apply Schema
If setting up for the first time:
```bash
# Create database owned by your Linux user (e.g. umair)
sudo -u postgres createdb -O umair research_opportunity_portal

# Apply the schema
psql -d research_opportunity_portal -f database/schema.sql
```

The table definition in `database/schema.sql`:
```sql
CREATE TABLE IF NOT EXISTS opportunities (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    research_area VARCHAR(150) NOT NULL,
    faculty_name VARCHAR(150) NOT NULL,
    department VARCHAR(150) NOT NULL,
    required_skills TEXT NOT NULL,
    available_positions INTEGER NOT NULL CHECK (available_positions >= 0),
    application_deadline DATE NOT NULL,
    status VARCHAR(10) NOT NULL DEFAULT 'Open' CHECK (status IN ('Open', 'Closed'))
);
```

---

## ⚙️ Backend Setup & Execution (FastAPI)

### 1. Create Virtual Environment & Install Dependencies
```bash
# From repository root
python3 -m venv backend/venv
source backend/venv/bin/activate
pip install -r backend/requirements.txt
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp backend/.env.example backend/.env
```
Default `backend/.env` contents for Linux local Unix domain socket access:
```env
DATABASE_URL=postgresql+psycopg2://umair@/research_opportunity_portal
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
HOST=127.0.0.1
PORT=8000
```

### 3. Run the Backend API Server
```bash
backend/venv/bin/uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload
```
- API Base URL: `http://127.0.0.1:8000`
- Interactive Swagger UI: `http://127.0.0.1:8000/docs`
- Health check: `http://127.0.0.1:8000/api/health`

### 4. Run Backend Automated Tests (Pytest)
```bash
PYTHONPATH=. backend/venv/bin/pytest backend/tests/test_api.py -v
```

### 5. Run Postman Collection Tests (Newman CLI or Desktop App)
The repository includes a complete Postman test suite covering all 5 CRUD endpoints, health check, 404 handling, and validation errors:
```bash
npx newman run backend/postman/University_Research_Opportunity_Portal.postman_collection.json -e backend/postman/University_Research_Opportunity_Portal.postman_environment.json
```
*(Alternatively, import the two JSON files in `backend/postman/` into the Postman Desktop application to run tests interactively).*

---


## 💻 Frontend Setup & Execution (Next.js)

### 1. Configure Environment Variables
Ensure `.env.local` exists in the project root:
```bash
cp .env.example .env.local
```
Content:
```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

### 2. Install Node Dependencies
```bash
npm install
```

### 3. Start the Development Server
```bash
npm run dev -- --port 3000
```
Open [http://localhost:3000](http://localhost:3000) in your web browser.

### 4. Build for Production
```bash
npm run build
npm run start -- -p 3000
```

### 5. Run Linting and Typechecks
```bash
npm run lint
npx tsc --noEmit
```

---

## 📡 API Endpoints Reference

| Method | Endpoint | Description | Status Code |
|---|---|---|---|
| `GET` | `/api/health` | Service and database health check | `200 OK` |
| `GET` | `/api/opportunities` | List opportunities (supports filters & search) | `200 OK` |
| `GET` | `/api/opportunities/{id}` | Get single opportunity by ID | `200 OK` / `404 Not Found` |
| `POST` | `/api/opportunities` | Create new opportunity | `201 Created` / `422 Unprocessable` |
| `PUT` | `/api/opportunities/{id}` | Update opportunity (or toggle status) | `200 OK` / `404 Not Found` |
| `DELETE` | `/api/opportunities/{id}` | Delete opportunity | `200 OK` / `404 Not Found` |

---

## 🔒 Security & Git Hygiene

- Passwords and secret credentials are never committed.
- Both `backend/.env` and `.env.local` are strictly excluded in `.gitignore`.
- Template files `.env.example` and `backend/.env.example` are maintained for clean deployment setup.
