import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function Navbar() {
  const { isLoggedIn, user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="navbar">
      <NavLink to="/" className="navbar-brand">
        🍽️ Food<span>Recipe</span>
      </NavLink>

      <ul className="navbar-links">
        <li><NavLink to="/">Home</NavLink></li>
        {isLoggedIn && (
          <>
            <li><NavLink to="/add-recipe">+ Add Recipe</NavLink></li>
            <li><NavLink to="/my-recipes">My Recipes</NavLink></li>
          </>
        )}
        {!isLoggedIn ? (
          <>
            <li><NavLink to="/login" className="btn btn-outline btn-sm">Login</NavLink></li>
            <li><NavLink to="/register" className="btn btn-primary btn-sm">Register</NavLink></li>
          </>
        ) : (
          <>
            <li style={{ color: '#666', fontSize: '0.9rem', padding: '0 0.4rem' }}>
              Hi, <strong>{user?.name}</strong>
            </li>
            <li>
              <button className="btn btn-ghost btn-sm" onClick={handleLogout}>Logout</button>
            </li>
          </>
        )}
      </ul>
    </nav>
  )
}
