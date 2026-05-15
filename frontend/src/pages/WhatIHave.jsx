import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function WhatIHave() {
  const [input, setInput] = useState('');
  const [ingredients, setIngredients] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const { logout, role } = useAuth();
  const navigate = useNavigate();

  const addIngredient = () => {
    const trimmed = input.trim();
    if (trimmed && !ingredients.includes(trimmed)) {
      setIngredients([...ingredients, trimmed]);
    }
    setInput('');
  };

  const removeIngredient = (name) => {
    setIngredients(ingredients.filter(i => i !== name));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') { e.preventDefault(); addIngredient(); }
  };

  const searchRecipes = async () => {
    if (ingredients.length === 0) return;
    setLoading(true);
    try {
      const res = await api.post('/recipes/search-by-ingredients', ingredients);
      setRecipes(res.data);
      setSearched(true);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  return (
    <div style={{minHeight: '100vh'}}>
      <nav className="navbar-mealmind py-3 px-4 d-flex justify-content-between align-items-center">
        <span className="navbar-brand-text">MealMind</span>
        <div className="d-flex gap-2 align-items-center">
          <Link to="/recipes" className="nav-link-pill">Recipes</Link>
          <Link to="/meal-plan" className="nav-link-pill">Meal Plan</Link>
          {role === 'admin' && <Link to="/admin" className="nav-link-pill">Admin</Link>}
          <button onClick={() => { logout(); navigate('/login'); }} className="btn-logout">Sign out</button>
        </div>
      </nav>

      <div className="container py-4" style={{maxWidth: '700px'}}>
        <div className="mb-4">
          <h4 style={{fontWeight: 700, marginBottom: '4px'}}>What do you have?</h4>
          <p style={{color: 'var(--text-muted)', fontSize: '0.9rem'}}>Enter ingredients and we'll find matching recipes</p>
        </div>

        <div className="card-clean p-4 mb-4">
          <label className="form-label-clean">Ingredients</label>
          <div className="d-flex gap-2">
            <input
              type="text"
              className="form-input-clean"
              style={{marginBottom: 0}}
              placeholder="e.g. eggs, pasta, tomato..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button onClick={addIngredient} className="btn-yellow" style={{whiteSpace: 'nowrap'}}>Add</button>
          </div>

          {ingredients.length > 0 && (
            <div className="d-flex flex-wrap gap-2 mt-3">
              {ingredients.map(ing => (
                <span key={ing} className="ingredient-tag">
                  {ing}
                  <button onClick={() => removeIngredient(ing)}>×</button>
                </span>
              ))}
            </div>
          )}

          <button
            onClick={searchRecipes}
            disabled={ingredients.length === 0 || loading}
            className="btn-yellow mt-3 w-100"
            style={{padding: '11px', opacity: ingredients.length === 0 ? 0.5 : 1}}
          >
            {loading ? 'Searching...' : 'Find Recipes'}
          </button>
        </div>

        {searched && (
          <div>
            <p style={{fontWeight: 600, marginBottom: '16px'}}>
              {recipes.length > 0 ? `Found ${recipes.length} recipe${recipes.length > 1 ? 's' : ''}` : 'No recipes found with these ingredients'}
            </p>
            <div className="d-flex flex-column gap-3">
              {recipes.map(recipe => (
                <div key={recipe.id} className="card-clean p-4">
                  <div className="recipe-title">{recipe.title}</div>
                  <div className="recipe-desc">{recipe.description}</div>
                  <div className="recipe-meta">
                    <span className="meta-tag">{recipe.cooking_time} min</span>
                    <span className="meta-tag">{recipe.calories} cal</span>
                    <span className={`meta-tag difficulty-${recipe.difficulty}`}>{recipe.difficulty}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}