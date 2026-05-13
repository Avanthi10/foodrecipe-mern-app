// App.jsx
import { Routes, Route } from 'react-router-dom'
import Navbar from './pages/components/Navbar'
import Footer from './pages/components/Footer'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import AddRecipe from './pages/AddRecipe'
import RecipeDetail from './pages/RecipeDetail'
import MyRecipes from './pages/MyRecipes'
import EditRecipe from './pages/EditRecipe'
import PrivateRoute from './pages/components/PrivateRoute'
import ForgotPassword from './pages/ForgotPassword'   // ← ADD THIS

function App() {
  return (
    <div className="app-wrapper">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />  {/* ← ADD THIS */}
          <Route path="/recipe/:id" element={<RecipeDetail />} />
          <Route path="/add-recipe" element={<PrivateRoute><AddRecipe /></PrivateRoute>} />
          <Route path="/my-recipes" element={<PrivateRoute><MyRecipes /></PrivateRoute>} />
          <Route path="/edit-recipe/:id" element={<PrivateRoute><EditRecipe /></PrivateRoute>} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
