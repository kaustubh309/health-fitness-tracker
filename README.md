# FitTrack - Advanced Health & Fitness Tracker 🏋️‍♀️🥗📊

Welcome to **FitTrack**, a comprehensive, beautifully designed, full-stack web application designed to help users track their fitness journey, monitor their daily nutrition, and visualize their lifestyle data with insightful, interactive analytics.

Featuring a cutting-edge **Glassmorphism** aesthetic, vibrant gradients, and fully responsive fluid layouts, FitTrack combines a premium user experience with robust backend data processing.

---

## 🌟 Key Features

### 1. 🔐 Secure Authentication & User Profiles
*   **User Accounts:** Full user registration and secure login system (JWT-based).
*   **Profile Management:** Track biometric data such as age, heights, weight, medical conditions, and targeted fitness goals.
*   **Account Settings:** Securely update email addresses and passwords.

### 2. 💪 Workout & Activity Logging
*   **Activity Tracking:** Add daily workouts by specifying the activity type, duration, and optional notes.
*   **Smart Calorie Calculation:** The backend dynamically calculates approximate calories burned based on the specific activity typed (e.g., Running, Cycling, Swimming, Yoga) and provides personalized AI-like insights and advice based on the duration.
*   **History Management:** View a chronological list of all logged activities with easy delete functionality.

### 3. 🥦 Comprehensive Nutrition Tracker
*   **Daily Food Diary:** Create custom meal structures for your day (e.g., Breakfast, Lunch, Dinner, Snacks).
*   **Macro Analysis:** Input food items and quantities. The application calculates your total daily intake of Calories, Protein, Carbs, and Fats.
*   **Smart Suggestions:** Receives automated feedback on your diet (e.g., "Protein intake is low", "Carb intake is high").
*   **Diary Saving:** Persist your daily food analysis directly into your personal database log. 

### 4. 📊 Advanced Analytics & Data Visualization (New!)
*   **Dedicated Insights Dashboard:** A full-page analytics suite visualizing your fitness progress over time.
*   **Horizontally Stacked Interactive Charts:** Powered by Recharts, featuring sleek tooltips and animated transitions.
*   **Energy Balance (In vs Out):** A composed chart uniquely comparing your logged `Calories Consumed (Food)` vs `Calories Burned (Active)` for each specific date.
*   **Active Burn Trend:** A stylish glowing area-spline chart showcasing your workout intensities over time.
*   **Active Duration:** A clean bar chart to track your historical workout stamina in minutes.

### 5. 📚 Exercise Library & Video Tutorials
*   **Muscle Group Navigation:** Browse suggested exercises filtered by specific body parts.
*   **Video Integration:** Watch embedded tutorial videos and read instructions for correct form and injury prevention.

---

## 💻 Technology Stack

This project is built using a modern, scalable architecture splitting the frontend and backend into two distinct applications.

### 🎨 Frontend (Client-Side)
*   **Framework:** React v18
*   **Build Tool:** Vite (for lightning-fast HMR and optimized production builds)
*   **Routing:** React Router v6 (`react-router-dom`)
*   **Data Fetching:** Axios (configured with interceptors for auth tokens)
*   **Data Visualization:** Recharts (React charting library utilizing D3 under the hood)
*   **Styling:** Custom Vanilla CSS featuring CSS Variables (Custom Properties), Flexbox/Grid systems, and advanced Glassmorphism techniques (`backdrop-filter`, semi-transparent backgrounds).
*   **Icons:** React Icons (`react-icons`)

### ⚙️ Backend (Server-Side / API)
*   **Framework:** FastAPI (High-performance web framework for building APIs with Python 3.8+)
*   **Database:** SQLite (default for development/portability, easily swappable via SQLAlchemy)
*   **ORM:** SQLAlchemy (Object Relational Mapper for database queries)
*   **Data Validation:** Pydantic (Strict typing and request/response schema validation)
*   **Security:** Passlib (Password Hashing), python-jose (JWT token generation/verification)
*   **Server:** Uvicorn (ASGI web server implementation)

---

## 🚀 Getting Started

Follow these steps to run the FitTrack application on your local machine.

### Prerequisites
*   [Node.js](https://nodejs.org/) (v16 or higher recommended for frontend)
*   [Python](https://www.python.org/) 3.8+ (for backend)
*   Git

### 1. Setting Up the Backend

1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create a virtual environment:
   ```bash
   python -m venv venv
   ```
3. Activate the virtual environment:
   * **Windows:** `venv\Scripts\activate`
   * **Mac/Linux:** `source venv/bin/activate`
4. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
   *(Note: Ensure you have `fastapi`, `uvicorn`, `sqlalchemy`, `pydantic` installed)*
5. Start the FastAPI server:
   ```bash
   uvicorn app.main:app --reload
   ```
6. The backend API is now running at `http://localhost:8000`. You can view the automatic Swagger documentation at `http://localhost:8000/docs`.

### 2. Setting Up the Frontend

1. Open a *new* separate terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install Node dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. The frontend application is now running at `http://localhost:5173`. Open this URL in your browser to begin using FitTrack!

---

## 📂 Project Structure

```text
health_fitness_tracker_FULL/
│
├── backend/                  # FastAPI Server
│   ├── app/
│   │   ├── api/              # API Route Controllers (Auth, Users, Workouts, Nutrition)
│   │   ├── core/             # Database connection, security config, static food DB
│   │   ├── models/           # SQLAlchemy Database Models (User, Workout, NutritionLog)
│   │   ├── schemas/          # Pydantic Schemas (Request/Response validation)
│   │   └── main.py           # Application entry point & middleware config
│   └── requirements.txt      # Python dependencies
│
└── frontend/                 # React Application
    ├── public/               # Static assets
    ├── src/
    │   ├── api/              # Axios configuration (API connection)
    │   ├── components/       # Reusable UI components (Navbar, WorkoutChart)
    │   ├── context/          # React Context providers (AuthContext)
    │   ├── pages/            # Full-page views (Dashboard, NutritionTracker, ChartsPage, etc)
    │   ├── App.jsx           # Main Application Router wrapper
    │   ├── index.css         # Global Styles & Glassmorphism Design System
    │   └── main.jsx          # React DOM entry point
    ├── package.json          # Node dependencies and scripts
    └── vite.config.js        # Vite build configuration
```

---

## 🎨 Design Philosophy
FitTrack was designed to move away from boring, clinical health apps. By utilizing a dark mode interface with vibrant `#a78bfa` (Purple) and `#38bdf8` (Cyan) primary colors, users are greeted with an app that feels like a modern SaaS product. Semi-transparent glass panels create a sense of depth, and micro-animations ensure the application feels highly responsive and alive.

Enjoy tracking your health! 🚀
