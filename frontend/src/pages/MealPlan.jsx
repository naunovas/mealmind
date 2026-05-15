import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const DAY_LABELS = { monday: '🌙 Monday', tuesday: '🌤 Tuesday', wednesday: '🌈 Wednesday', thursday: '⚡ Thursday', friday: '🎉 Friday', saturday: '🌞 Saturday', sunday: '😴 Sunday' };

export default function MealPlan() {
  const [mealPlan, setMealPlan] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [selectedDay, setSelectedDay] = useState('monday');
  const [selectedRecipe, setSelectedRecipe] = useState('');
  const { logout, token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) { navigate('/login'); return; }
    fetchMealPlan();
    fetchRecipes();
  }, []);

  const fetchMealPlan = async () => {
    try {
      const res = await api.get('/meal-plan/');
      setMealPlan(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchRecipes = async () => {
    try {
      const res = await api.get('/recipes/?limit=50');
      setRecipes(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const addToMealPlan = async () => {
    if (!selectedRecipe) return;
    try {
      await api.post('/meal-plan/', {
        recipe_id: parseInt(selectedRecipe),
        day_of_week: selectedDay
      });
      fetchMealPlan();
    } catch (err) {
      alert('Already have a meal for this day!');
    }
  };

  const removeFromMealPlan = async (id) => {
    try {
      await api.delete(`/meal-plan/${id}`);
      fetchMealPlan();
    } catch (err) {
      console.error(err);
    }
  };

  const getMealForDay = (day) => mealPlan.find(m => m.day_of_week === day);
  const getRecipeName = (id) => recipes.find(r => r.id === id)?.title || 'Unknown';

  return (
    <div style={{minHeight: '100vh', background: 'var(--bg-cream)'}}>
      <nav className="navbar-mealmind py-3 px-4 d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center gap-2">
          <span style={{fontSize: '1.8rem'}}>🧠</span>
          <span className="fw-bold fs-4">MealMind</span>
        </div>
        <div className="d-flex gap-2">
          <Link to="/recipes" className="btn btn-outline-dark rounded-pill px-3">🍲 Recipes</Link>
          <button onClick={() => { logout(); navigate('/login'); }} className="btn btn-dark rounded-pill px-3">Logout</button>
        </div>
      </nav>

      <div className="container py-4">
        <h3 className="fw-bold mb-4">📅 Weekly Meal Plan</h3>

        {/* Add to plan */}
        <div className="recipe-card card p-4 mb-4">
          <h5 className="fw-bold mb-3">➕ Add to Plan</h5>
          <div className="row g-3 align-items-end">
            <div className="col-md-4">
              <label className="form-label fw-semibold">Day</label>
              <select className="form-select" value={selectedDay} onChange={e => setSelectedDay(e.target.value)}>
                {DAYS.map(day => (
                  <option key={day} value={day}>{DAY_LABELS[day]}</option>
                ))}
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold">Recipe</label>
              <select className="form-select" value={selectedRecipe} onChange={e => setSelectedRecipe(e.target.value)}>
                <option value="">Select a recipe...</option>
                {recipes.map(recipe => (
                  <option key={recipe.id} value={recipe.id}>{recipe.title}</option>
                ))}
              </select>
            </div>
            <div className="col-md-2">
              <button onClick={addToMealPlan} className="btn btn-primary-yellow w-100 rounded-pill">Add</button>
            </div>
          </div>
        </div>

        {/* Weekly grid */}
        <div className="row g-3">
          {DAYS.map(day => {
            const meal = getMealForDay(day);
            return (
              <div key={day} className="col-md-6 col-lg-4">
                <div className={`meal-plan-card p-3 ${meal ? '' : 'opacity-75'}`}>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="day-badge">{DAY_LABELS[day]}</span>
                    {meal && (
                      <button
                        onClick={() => removeFromMealPlan(meal.id)}
                        className="btn btn-sm btn-outline-danger rounded-pill"
                      >✕</button>
                    )}
                  </div>
                  {meal ? (
                    <div>
                      <p className="fw-semibold mb-1">🍽 {getRecipeName(meal.recipe_id)}</p>
                    </div>
                  ) : (
                    <p className="text-muted small mb-0">No meal planned</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}