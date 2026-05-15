import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

export default function AdminPanel() {
  const [pendingRecipes, setPendingRecipes] = useState([]);
  const { logout, token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) { navigate('/login'); return; }
    fetchPending();
  }, []);

  const fetchPending = async () => {
    try {
      const res = await api.get('/recipes/pending');
      setPendingRecipes(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const approveRecipe = async (id) => {
    try {
      await api.put(`/recipes/${id}/approve`);
      fetchPending();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteRecipe = async (id) => {
    try {
      await api.delete(`/recipes/${id}`);
      fetchPending();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{minHeight: '100vh', background: 'var(--bg-cream)'}}>
      <nav className="navbar-mealmind py-3 px-4 d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center gap-2">
          <span style={{fontSize: '1.8rem'}}>🧠</span>
          <span className="fw-bold fs-4">MealMind — Admin</span>
        </div>
        <div className="d-flex gap-2">
          <Link to="/recipes" className="btn btn-outline-dark rounded-pill px-3">🍲 Recipes</Link>
          <Link to="/meal-plan" className="btn btn-outline-dark rounded-pill px-3">📅 Meal Plan</Link>
          <button onClick={() => { logout(); navigate('/login'); }} className="btn btn-dark rounded-pill px-3">Logout</button>
        </div>
      </nav>

      <div className="container py-4">
        <h3 className="fw-bold mb-4">⏳ Pending Recipes ({pendingRecipes.length})</h3>

        {pendingRecipes.length === 0 && (
          <div className="text-center py-5">
            <div style={{fontSize: '4rem'}}>✅</div>
            <p className="text-muted fs-5">No pending recipes!</p>
          </div>
        )}

        <div className="row g-4">
          {pendingRecipes.map(recipe => (
            <div key={recipe.id} className="col-md-6">
              <div className="recipe-card card h-100">
                <div className="card-header py-3">
                  {recipe.title}
                </div>
                <div className="card-body">
                  <p className="text-muted small">{recipe.description}</p>
                  <p className="small"><strong>Instructions:</strong> {recipe.instructions}</p>
                  <div className="d-flex gap-2 mb-3 flex-wrap">
                    <span className="badge bg-light text-dark">⏱ {recipe.cooking_time} min</span>
                    <span className="badge bg-light text-dark">🔥 {recipe.calories} cal</span>
                    <span className={`badge-difficulty badge-${recipe.difficulty}`}>{recipe.difficulty}</span>
                  </div>
                  <div className="d-flex gap-2">
                    <button
                      onClick={() => approveRecipe(recipe.id)}
                      className="btn btn-primary-yellow rounded-pill px-4"
                    >
                      ✅ Approve
                    </button>
                    <button
                      onClick={() => deleteRecipe(recipe.id)}
                      className="btn btn-outline-danger rounded-pill px-4"
                    >
                      ❌ Reject
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}