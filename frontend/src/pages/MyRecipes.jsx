import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

export default function MyRecipes() {
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  const { token } = useAuth()
  const navigate = useNavigate()

  const fetchMyRecipes = async () => {
    try {
      const res = await axios.get('/api/recipes/my/recipes', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setRecipes(res.data)
    } catch {
      setRecipes([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchMyRecipes() }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this recipe?')) return
    try {
      await axios.delete(`/api/recipes/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      setRecipes(recipes.filter(r => r._id !== id))
    } catch {
      alert('Failed to delete recipe')
    }
  }

  if (loading) return <div className="loading">Loading your recipes...</div>

  return (
    <div className="section">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h2 className="section-title">My Recipes</h2>
          <p className="section-sub">You have {recipes.length} recipe{recipes.length !== 1 ? 's' : ''}</p>
        </div>
        <Link to="/add-recipe" className="btn btn-primary">+ Add New</Link>
      </div>

      {recipes.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🍳</div>
          <h3>No recipes yet</h3>
          <p>You haven't added any recipes. Share your first one!</p>
          <br />
          <Link to="/add-recipe" className="btn btn-primary">Add Your First Recipe</Link>
        </div>
      ) : (
        recipes.map(recipe => (
          <div key={recipe._id} className="my-recipe-card">
            <div className="my-recipe-info">
              <h3>{recipe.title}</h3>
              <p>{recipe.category} · {recipe.cookingTime || 'No time set'} · {new Date(recipe.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="my-recipe-btns">
              <Link to={`/recipe/${recipe._id}`} className="btn btn-ghost btn-sm">View</Link>
              <Link to={`/edit-recipe/${recipe._id}`} className="btn btn-outline btn-sm">Edit</Link>
              <button className="btn btn-danger btn-sm" onClick={() => handleDelete(recipe._id)}>Delete</button>
            </div>
          </div>
        ))
      )}
    </div>
  )
}
