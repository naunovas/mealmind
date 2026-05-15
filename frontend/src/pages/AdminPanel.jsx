import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

export default function AdminPanel() {
  const [pendingRecipes, setPendingRecipes] = useState([]);
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPending();
  }, []);

  const fetchPending = async () => {
    try {
      const res = await api.get('/recipes/pending');
      setPendingRecipes(res.data);
    } catch (err) { console.error(err); }
  };

  const approveRecipe = async (id) => {
    try {
      await api.put(`/recipes/${id}/approve`);
      fetchPending();
    } catch (err) { console.error(err); }
  };

  const deleteRecipe = async (id) => {
    try {
      await api.delete(`/recipes/${id}`);
      fetchPending();
    } catch (err) { console.error(err); }
  };

  return (
    <div style={{minHeight: '100vh'}}>
      <nav className="navbar-mealmind py-3 px-4 d-flex justify-content-between align-items-center">
        <span className="navbar-brand-text">MealMind — Admin</span>
        <div className="d-flex gap-2 align-items-center">
          <Link to="/recipes" className="nav-link-pill">Recipes</Link>
          <Link to="/meal-plan" className="nav-link-pill">Meal Plan</Link>
          <button onClick={() => { logout(); navigate('/login'); }} className="btn-logout">Sign out</button>
        </div>
      </nav>

      <div className="container py-4" style={{maxWidth: '800px'}}>
        <div className="d-flex align-items-center gap-3 mb-4">
          <h4 style={{fontWeight: 700, margin: 0}}>Pending Recipes</h4>
          {pendingRecipes.length > 0 && (
            <span className="pending-count">{pendingRecipes.length}</span>
          )}
        </div>

        {pendingRecipes.length === 0 && (
          <div className="card-clean p-5 text-center">
            <p style={{color: 'var(--text-muted)', margin: 0}}>No pending recipes — all caught up!</p>
          </div>
        )}

        <div className="d-flex flex-column gap-3">
          {pendingRecipes.map(recipe => (
            <div key={recipe.id} className="card-clean p-4">
              <div className="d-flex justify-content-between align-items-start">
                <div style={{flex: 1}}>
                  <div className="recipe-title">{recipe.title}</div>
                  <div className="recipe-desc">{recipe.description}</div>
                  {recipe.instructions && (
                    <div style={{fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '12px'}}>
                      {recipe.instructions}
                    </div>
                  )}
                  <div className="recipe-meta">
                    <span className="meta-tag">{recipe.cooking_time} min</span>
                    <span className="meta-tag">{recipe.calories} cal</span>
                    <span className={`meta-tag difficulty-${recipe.difficulty}`}>{recipe.difficulty}</span>
                  </div>
                </div>
                <div className="d-flex gap-2 ms-3">
                  <button onClick={() => approveRecipe(recipe.id)} className="btn-yellow">Approve</button>
                  <button onClick={() => deleteRecipe(recipe.id)} className="btn-danger-soft">Reject</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}