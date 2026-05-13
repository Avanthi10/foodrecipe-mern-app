import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

const CATEGORIES = ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Dessert', 'Other']

export default function AddRecipe() {
  const [form, setForm] = useState({
    title: '', description: '', ingredients: '',
    instructions: '', cookingTime: '', category: 'Other', imageUrl: ''
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState('')
  const [uploading, setUploading] = useState(false)

  const { token } = useAuth()
  const navigate = useNavigate()

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    setImage(file)
    setPreview(URL.createObjectURL(file))
  }

  const uploadImage = async () => {
    if (!image) return form.imageUrl
    const formData = new FormData()
    formData.append('image', image)
    setUploading(true)
    try {
      const res = await axios.post('/api/recipes/upload-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      })
      return res.data.imageUrl
    } catch (err) {
      console.error('Upload error:', err.response?.data || err.message)
      throw new Error(err.response?.data?.message || 'Image upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)
    try {
      const imageUrl = await uploadImage()
      await axios.post('/api/recipes', { ...form, imageUrl }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setSuccess('Recipe added successfully! 🎉')
      setTimeout(() => navigate('/my-recipes'), 1500)
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to add recipe.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="form-page">
      <div className="form-card">
        <h2 className="form-title">Share Your Recipe 🍳</h2>
        <p className="form-sub">Fill in the details and share it with the community</p>
        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Recipe Title *</label>
            <input name="title" placeholder="e.g. Creamy Pasta Carbonara" value={form.title} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Short Description *</label>
            <textarea name="description" rows="2" placeholder="A brief description of your recipe..." value={form.description} onChange={handleChange} required />
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
              <input name="cookingTime" placeholder="e.g. 30 minutes" value={form.cookingTime} onChange={handleChange} />
            </div>
          </div>
          <div className="form-group">
            <label>Ingredients *</label>
            <textarea name="ingredients" rows="5" placeholder="List each ingredient on a new line..." value={form.ingredients} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Instructions *</label>
            <textarea name="instructions" rows="6" placeholder="Step 1: ...\nStep 2: ..." value={form.instructions} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Recipe Image</label>
            <input type="file" accept="image/*" onChange={handleImageChange} />
            {preview && (
              <img
                src={preview}
                alt="Preview"
                style={{ width: '100%', marginTop: '10px', borderRadius: '8px', maxHeight: '200px', objectFit: 'cover' }}
              />
            )}
            {uploading && <p style={{ color: '#16a34a', marginTop: '6px' }}>⏳ Uploading image...</p>}
          </div>
          <div className="form-group">
            <label>Or paste Image URL (optional)</label>
            <input name="imageUrl" placeholder="https://..." value={form.imageUrl} onChange={handleChange} />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={loading || uploading}>
              {loading ? 'Adding...' : 'Add Recipe'}
            </button>
            <button type="button" className="btn btn-ghost" onClick={() => navigate('/')}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}