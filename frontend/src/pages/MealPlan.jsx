import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const DAY_LABELS = { monday: 'Monday', tuesday: 'Tuesday', wednesday: 'Wednesday', thursday: 'Thursday', friday: 'Friday', saturday: 'Saturday', sunday: 'Sunday' };

export default function MealPlan() {
  const [mealPlan, setMealPlan] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [selectedDay, setSelectedDay] = useState('monday');
  const [selectedRecipe, setSelectedRecipe] = useState('');
  const { logout, token, role } = useAuth();
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
    } catch (err) { console.error(err); }
  };

  const fetchRecipes = async () => {
    try {
      const res = await api.get('/recipes/?limit=50');
      setRecipes(res.data);
    } catch (err) { console.error(err); }
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
      alert('Already have a meal planned for this day!');
    }
  };

  const removeFromMealPlan = async (id) => {
    try {
      await api.delete(`/meal-plan/${id}`);
      fetchMealPlan();
    } catch (err) { console.error(err); }
  };

  const getMealForDay = (day) => mealPlan.find(m => m.day_of_week === day);
  const getRecipe = (id) => recipes.find(r => r.id === id);

  const getTotalNutrition = () => {
    let totalCalories = 0;
    let totalTime = 0;
    mealPlan.forEach(meal => {
      const recipe = getRecipe(meal.recipe_id);
      if (recipe) {
        totalCalories += recipe.calories || 0;
        totalTime += recipe.cooking_time || 0;
      }
    });
    return { totalCalories, totalTime };
  };

  const { totalCalories, totalTime } = getTotalNutrition();

  return (
    <div style={{minHeight: '100vh'}}>
      <nav className="navbar-mealmind py-3 px-4 d-flex justify-content-between align-items-center">
        <span className="navbar-brand-text">MealMind</span>
        <div className="d-flex gap-2 align-items-center">
          <Link to="/recipes" className="nav-link-pill">Recipes</Link>
          <Link to="/what-i-have" className="nav-link-pill">What I Have</Link>
          {role === 'admin' && <Link to="/admin" className="nav-link-pill">Admin</Link>}
          <button onClick={() => { logout(); navigate('/login'); }} className="btn-logout">Sign out</button>
        </div>
      </nav>

      <div className="container py-4" style={{maxWidth: '900px'}}>
        <h4 style={{fontWeight: 700, marginBottom: '24px'}}>Weekly Meal Plan</h4>

        {/* Summary */}
        {mealPlan.length > 0 && (
          <div className="summary-card mb-4">
            <div className="row text-center">
              <div className="col-4">
                <div className="summary-number">{mealPlan.length}/7</div>
                <div className="summary-label">Meals planned</div>
              </div>
              <div className="col-4">
                <div className="summary-number">{totalCalories}</div>
                <div className="summary-label">Total calories</div>
              </div>
              <div className="col-4">
                <div className="summary-number">{totalTime}m</div>
                <div className="summary-label">Cook time</div>
              </div>
            </div>
          </div>
        )}

        {/* Add to plan */}
        <div className="card-clean p-4 mb-4">
          <h6 style={{fontWeight: 700, marginBottom: '16px'}}>Add to plan</h6>
          <div className="row g-3 align-items-end">
            <div className="col-md-4">
              <label className="form-label-clean">Day</label>
              <select className="form-input-clean" value={selectedDay} onChange={e => setSelectedDay(e.target.value)}>
                {DAYS.map(day => (
                  <option key={day} value={day}>{DAY_LABELS[day]}</option>
                ))}
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label-clean">Recipe</label>
              <select className="form-input-clean" value={selectedRecipe} onChange={e => setSelectedRecipe(e.target.value)}>
                <option value="">Select a recipe...</option>
                {recipes.map(recipe => (
                  <option key={recipe.id} value={recipe.id}>{recipe.title}</option>
                ))}
              </select>
            </div>
            <div className="col-md-2">
              <button onClick={addToMealPlan} className="btn-yellow w-100">Add</button>
            </div>
          </div>
        </div>

        {/* Weekly grid */}
        <div className="row g-3">
          {DAYS.map(day => {
            const meal = getMealForDay(day);
            const recipe = meal ? getRecipe(meal.recipe_id) : null;
            return (
              <div key={day} className="col-md-6 col-lg-4">
                <div className={`day-card ${meal ? 'has-meal' : ''}`}>
                  <div className="day-label">{DAY_LABELS[day]}</div>
                  {meal && recipe ? (
                    <div>
                      <div className="day-meal-name">{recipe.title}</div>
                      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px'}}>
                        <span className="meta-tag">{recipe.calories} cal</span>
                        <button onClick={() => removeFromMealPlan(meal.id)} className="btn-danger-soft">Remove</button>
                      </div>
                    </div>
                  ) : (
                    <div style={{color: 'var(--text-muted)', fontSize: '0.85rem'}}>No meal planned</div>
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