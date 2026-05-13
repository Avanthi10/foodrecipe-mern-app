import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

const CATEGORY_EMOJI = {
  Breakfast: '🍳', Lunch: '🥗', Dinner: '🍝',
  Snack: '🥨', Dessert: '🍰', Other: '🍽️'
}

export default function RecipeDetail() {
  const { id } = useParams()
  const [recipe, setRecipe] = useState(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)
  const { user, token } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    axios.get(`/api/recipes/${id}`)
      .then(res => setRecipe(res.data))
      .catch(() => navigate('/'))
      .finally(() => setLoading(false))
  }, [id])

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this recipe?')) return
    setDeleting(true)
    try {
      await axios.delete(`/api/recipes/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      navigate('/my-recipes')
    } catch {
      alert('Failed to delete recipe')
      setDeleting(false)
    }
  }

  if (loading) return <div className="loading">🍳 Loading recipe...</div>
  if (!recipe) return null

  const isOwner = user && recipe.author === user.id

  return (
    <div className="recipe-detail">
      {/* Image / Emoji hero */}
      <div className="recipe-detail-hero">
        {recipe.imageUrl
          ? <img src={recipe.imageUrl} alt={recipe.title} onError={e => { e.target.style.display='none' }} />
          : CATEGORY_EMOJI[recipe.category] || '🍽️'
        }
      </div>

      <div className="recipe-detail-category">{recipe.category}</div>
      <h1 className="recipe-detail-title">{recipe.title}</h1>
      <div className="recipe-detail-meta">
        <span>👤 {recipe.authorName}</span>
        {recipe.cookingTime && <span>⏱️ {recipe.cookingTime}</span>}
        <span>📅 {new Date(recipe.createdAt).toLocaleDateString()}</span>
      </div>

      {isOwner && (
        <div className="recipe-actions">
          <Link to={`/edit-recipe/${recipe._id}`} className="btn btn-outline btn-sm">✏️ Edit</Link>
          <button className="btn btn-danger btn-sm" onClick={handleDelete} disabled={deleting}>
            {deleting ? 'Deleting...' : '🗑️ Delete'}
          </button>
        </div>
      )}

      <p className="recipe-detail-desc">{recipe.description}</p>

      <div className="detail-section">
        <h3>🥬 Ingredients</h3>
        <p>{recipe.ingredients}</p>
      </div>

      <div className="detail-section">
        <h3>👨‍🍳 Instructions</h3>
        <p>{recipe.instructions}</p>
      </div>

      <button className="btn btn-ghost" onClick={() => navigate(-1)}>← Back</button>
    </div>
  )
}
