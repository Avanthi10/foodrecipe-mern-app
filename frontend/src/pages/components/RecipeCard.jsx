import { Link } from 'react-router-dom'

const CATEGORY_EMOJI = {
  Breakfast: '🍳', Lunch: '🥗', Dinner: '🍝',
  Snack: '🥨', Dessert: '🍰', Other: '🍽️'
}

export default function RecipeCard({ recipe }) {
  return (
    <Link to={`/recipe/${recipe._id}`} className="recipe-card">
      <div className="recipe-card-img">
        {recipe.imageUrl
          ? <img src={recipe.imageUrl} alt={recipe.title} onError={e => { e.target.style.display='none' }} />
          : CATEGORY_EMOJI[recipe.category] || '🍽️'
        }
      </div>
      <div className="recipe-card-body">
        <div className="recipe-card-category">{recipe.category}</div>
        <div className="recipe-card-title">{recipe.title}</div>
        <div className="recipe-card-desc">{recipe.description}</div>
        <div className="recipe-card-meta">
          <span>👤 {recipe.authorName}</span>
          {recipe.cookingTime && <span>⏱️ {recipe.cookingTime}</span>}
        </div>
      </div>
    </Link>
  )
}
