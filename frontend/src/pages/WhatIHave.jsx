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
    if (e.key === 'Enter') addIngredient();
  };

  const searchRecipes = async () => {
    if (ingredients.length === 0) return;
    setLoading(true);
    try {
      const res = await api.post('/recipes/search-by-ingredients', ingredients);
      setRecipes(res.data);
      setSearched(true);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div style={{minHeight: '100vh', background: 'var(--bg-cream)'}}>
      {/* Navbar */}
      <nav className="navbar-mealmind py-3 px-4 d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center gap-2">
          <span style={{fontSize: '1.8rem'}}>🧠</span>
          <span className="fw-bold fs-4">MealMind</span>
        </div>
        <div className="d-flex gap-2">
          <Link to="/recipes" className="btn btn-outline-dark rounded-pill px-3">🍲 Recipes</Link>
          <Link to="/meal-plan" className="btn btn-outline-dark rounded-pill px-3">📅 Meal Plan</Link>
          {role === 'admin' && (
            <Link to="/admin" className="btn btn-warning rounded-pill px-3">⚙️ Admin</Link>
          )}
          <button onClick={() => { logout(); navigate('/login'); }} className="btn btn-dark rounded-pill px-3">Logout</button>
        </div>
      </nav>

      <div className="container py-4" style={{maxWidth: '700px'}}>
        <div className="text-center mb-4">
          <h2 className="fw-bold">🧠 What do you have?</h2>
          <p className="text-muted">Enter ingredients you have and we'll find matching recipes!</p>
        </div>

        {/* Input */}
        <div className="recipe-card card p-4 mb-4">
          <label className="form-label fw-semibold">Add ingredients:</label>
          <div className="d-flex gap-2">
            <input
              type="text"
              className="form-control"
              placeholder="e.g. eggs, pasta, tomato..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button onClick={addIngredient} className="btn btn-primary-yellow rounded-pill px-4">
              Add
            </button>
          </div>

          {/* Tags */}
          {ingredients.length > 0 && (
            <div className="d-flex flex-wrap gap-2 mt-3">
              {ingredients.map(ing => (
                <span key={ing} className="badge d-flex align-items-center gap-1"
                  style={{background: 'var(--yellow-light)', color: 'var(--text-dark)', fontSize: '0.9rem', padding: '8px 14px', borderRadius: '20px'}}>
                  🥕 {ing}
                  <button
                    onClick={() => removeIngredient(ing)}
                    style={{background: 'none', border: 'none', cursor: 'pointer', padding: '0 0 0 4px', fontSize: '0.8rem'}}
                  >✕</button>
                </span>
              ))}
            </div>
          )}

          <button
            onClick={searchRecipes}
            disabled={ingredients.length === 0 || loading}
            className="btn btn-primary-yellow rounded-pill px-5 mt-3 w-100"
          >
            {loading ? '🔍 Searching...' : '🔍 Find Recipes'}
          </button>
        </div>

        {/* Results */}
        {searched && (
          <div>
            <h5 className="fw-bold mb-3">
              {recipes.length > 0 ? `🎉 Found ${recipes.length} recipes!` : '😔 No recipes found with these ingredients'}
            </h5>
            <div className="row g-3">
              {recipes.map(recipe => (
                <div key={recipe.id} className="col-12">
                  <div className="recipe-card card p-3">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <h5 className="fw-bold mb-1">{recipe.title}</h5>
                        <p className="text-muted small mb-2">{recipe.description}</p>
                        <div className="d-flex gap-2 flex-wrap">
                          <span className="badge bg-light text-dark">⏱ {recipe.cooking_time} min</span>
                          <span className="badge bg-light text-dark">🔥 {recipe.calories} cal</span>
                          <span className={`badge-difficulty badge-${recipe.difficulty}`}>{recipe.difficulty}</span>
                        </div>
                      </div>
                    </div>
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