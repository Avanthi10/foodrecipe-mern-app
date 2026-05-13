# 🍽️ Food Recipe App — MERN Stack

## Features
- Browse all recipes with search & category filter
- Register / Login with JWT authentication
- Add, edit, delete your own recipes
- View full recipe details

## Project Structure
```
foodrecipe/
├── backend/
│   ├── config/connectionDb.js
│   ├── controllers/
│   │   ├── userController.js
│   │   └── recipeController.js
│   ├── middleware/auth.js
│   ├── models/
│   │   ├── User.js
│   │   └── Recipe.js
│   ├── routes/
│   │   ├── user.js
│   │   └── recipe.js
│   ├── .env
│   ├── server.js
│   └── package.json
└── frontend/
    ├── src/
    │   ├── context/AuthContext.jsx
    │   ├── pages/
    │   │   ├── components/ (Navbar, Footer, RecipeCard, PrivateRoute)
    │   │   ├── Home.jsx
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── AddRecipe.jsx
    │   │   ├── EditRecipe.jsx
    │   │   ├── RecipeDetail.jsx
    │   │   └── MyRecipes.jsx
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── vite.config.js
    └── package.json
```

## ⚙️ Prerequisites
- Node.js v18+: https://nodejs.org
- MongoDB running locally (or Atlas)

## 🚀 How to Run

### Step 1 — Fix npm Python error (one-time fix)
Open PowerShell and run:
```powershell
npm config delete python
```

### Step 2 — Backend
Open **Terminal 1**:
```powershell
cd backend
npm install
npm run dev
```
Expected output:
```
✅ Server running on http://localhost:5000
✅ MongoDB Connected: localhost
```

### Step 3 — Frontend
Open **Terminal 2**:
```powershell
cd frontend
npm install
npm run dev
```
Open browser: **http://localhost:5173**

## 🌐 API Endpoints
| Method | URL | Auth | Description |
|--------|-----|------|-------------|
| POST | /api/users/register | No | Register |
| POST | /api/users/login | No | Login |
| GET | /api/recipes | No | All recipes |
| GET | /api/recipes/:id | No | Single recipe |
| GET | /api/recipes/my/recipes | Yes | My recipes |
| POST | /api/recipes | Yes | Add recipe |
| PUT | /api/recipes/:id | Yes | Edit recipe |
| DELETE | /api/recipes/:id | Yes | Delete recipe |

## Environment Variables (backend/.env)
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/foodrecipe
JWT_SECRET=foodrecipe_super_secret_key_2025
```
Replace MONGO_URI with your Atlas URL if not using local MongoDB.
