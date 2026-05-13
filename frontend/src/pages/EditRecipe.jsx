import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

const CATEGORIES = ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Dessert', 'Other']

export default function EditRecipe() {
  const { id } = useParams()
  const [form, setForm] = useState(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const { token } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    axios.get(`/api/recipes/${id}`)
      .then(res => setForm(res.data))
      .catch(() => navigate('/my-recipes'))
  }, [id])

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await axios.put(`/api/recipes/${id}`, form, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setSuccess('Recipe updated! ✅')
      setTimeout(() => navigate('/my-recipes'), 1500)
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed.')
    } finally {
      setLoading(false)
    }
  }

  if (!form) return <div className="loading">Loading...</div>

  return (
    <div className="form-page">
      <div className="form-card">
        <h2 className="form-title">Edit Recipe ✏️</h2>
        <p className="form-sub">Update your recipe details</p>
        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Recipe Title *</label>
            <input name="title" value={form.title} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Short Description *</label>
            <textarea name="description" rows="2" value={form.description} onChange={handleChange} required />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Category</label>
              <select name="category" value={form.category} onChange={handleChange}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Cooking Time</label>
              <input name="cookingTime" value={form.cookingTime} onChange={handleChange} />
            </div>
          </div>
          <div className="form-group">
            <label>Ingredients *</label>
            <textarea name="ingredients" rows="5" value={form.ingredients} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Instructions *</label>
            <textarea name="instructions" rows="6" value={form.instructions} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Image URL</label>
            <input name="imageUrl" value={form.imageUrl} onChange={handleChange} />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
            <button type="button" className="btn btn-ghost" onClick={() => navigate('/my-recipes')}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}
