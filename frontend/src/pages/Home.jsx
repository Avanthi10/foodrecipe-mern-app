import { useState, useEffect } from 'react'
import axios from 'axios'
import RecipeCard from './components/RecipeCard'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const CATEGORIES = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Snack', 'Dessert', 'Other']

export default function Home() {
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const navigate = useNavigate()
  const { isLoggedIn } = useAuth()

  const fetchRecipes = async () => {
    setLoading(true)
    try {
      const params = {}
      if (category !== 'All') params.category = category
      if (search.trim()) params.search = search.trim()
      const res = await axios.get('/api/recipes', { params })
      setRecipes(res.data)
    } catch {
      setRecipes([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchRecipes() }, [category])

  const handleSearch = (e) => {
    e.preventDefault()
    fetchRecipes()
  }

  return (
    <>
      {/* Hero */}
      <section className="hero">
        <div className="hero-content">
          <h1>Discover & Share Delicious Recipes</h1>
          <p>A community of food lovers sharing their favourite home-cooked meals</p>
          <div className="hero-btns">
            {isLoggedIn
              ? <button className="btn btn-primary btn-lg" onClick={() => navigate('/add-recipe')}>+ Share Your Recipe</button>
              : <>
                  <button className="btn btn-primary btn-lg" onClick={() => navigate('/register')}>Get Started</button>
                  <button className="btn btn-outline btn-lg" style={{borderColor:'#fff',color:'#fff'}} onClick={() => navigate('/login')}>Login</button>
                </>
            }
          </div>
        </div>
      </section>

      {/* Recipes */}
      <div className="section">
        <h2 className="section-title">All Recipes</h2>
        <p className="section-sub">Browse {recipes.length} recipes shared by our community</p>

        {/* Search */}
        <form className="search-bar" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="🔍  Search recipes by name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button type="submit" className="btn btn-primary">Search</button>
        </form>

        {/* Category filter */}
        <div className="filter-bar">
          {CATEGORIES.map(c => (
            <button
              key={c}
              className={`filter-btn ${category === c ? 'active' : ''}`}
              onClick={() => { setCategory(c); setSearch('') }}
            >{c}</button>
          ))}
        </div>

        {loading ? (
          <div className="loading">🍳 Loading recipes...</div>
        ) : recipes.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🍽️</div>
            <h3>No recipes found</h3>
            <p>Try a different search or category, or be the first to add one!</p>
          </div>
        ) : (
          <div className="recipe-grid">
            {recipes.map(r => <RecipeCard key={r._id} recipe={r} />)}
          </div>
        )}
      </div>
    </>
  )
}
