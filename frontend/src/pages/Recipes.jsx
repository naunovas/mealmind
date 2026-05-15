import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

export default function Recipes() {
  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newRecipe, setNewRecipe] = useState({
    title: '', description: '', instructions: '',
    cooking_time: '', difficulty: 'easy', calories: ''
  });
  const { logout, token, role } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) { navigate('/login'); return; }
    fetchRecipes();
  }, []);

  const fetchRecipes = async (searchTerm = '', diff = '') => {
    try {
      let url = `/recipes/?limit=20&search=${searchTerm}`;
      if (diff) url += `&difficulty=${diff}`;
      const res = await api.get(url);
      setRecipes(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    fetchRecipes(e.target.value, difficulty);
  };

  const handleDifficulty = (diff) => {
    setDifficulty(diff);
    fetchRecipes(search, diff);
  };

  const handleAddRecipe = async (e) => {
    e.preventDefault();
    try {
      await api.post('/recipes/', {
        ...newRecipe,
        cooking_time: parseInt(newRecipe.cooking_time),
        calories: parseInt(newRecipe.calories)
      });
      setShowAddForm(false);
      setNewRecipe({ title: '', description: '', instructions: '', cooking_time: '', difficulty: 'easy', calories: '' });
      fetchRecipes();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{minHeight: '100vh'}}>
      <nav className="navbar-mealmind py-3 px-4 d-flex justify-content-between align-items-center">
        <span className="navbar-brand-text">MealMind</span>
        <div className="d-flex gap-2 align-items-center">
          <Link to="/what-i-have" className="nav-link-pill">What I Have</Link>
          <Link to="/meal-plan" className="nav-link-pill">Meal Plan</Link>
          {role === 'admin' && <Link to="/admin" className="nav-link-pill">Admin</Link>}
          <button onClick={() => { logout(); navigate('/login'); }} className="btn-logout">Sign out</button>
        </div>
      </nav>

      <div className="container py-4" style={{maxWidth: '900px'}}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 style={{fontWeight: 700, margin: 0}}>Recipes</h4>
          <button onClick={() => setShowAddForm(!showAddForm)} className="btn-yellow">
            {showAddForm ? 'Cancel' : '+ Add Recipe'}
          </button>
        </div>

        <input
          type="text"
          className="search-input mb-3"
          placeholder="Search recipes..."
          value={search}
          onChange={handleSearch}
        />

        <div className="d-flex gap-2 mb-4 flex-wrap">
          {[['', 'All'], ['easy', 'Easy'], ['medium', 'Medium'], ['hard', 'Hard']].map(([val, label]) => (
            <button
              key={val}
              onClick={() => handleDifficulty(val)}
              className={`filter-pill ${difficulty === val ? 'active' : ''}`}
            >
              {label}
            </button>
          ))}
        </div>

        {showAddForm && (
          <div className="card-clean p-4 mb-4">
            <h6 style={{fontWeight: 700, marginBottom: '16px'}}>New Recipe</h6>
            <form onSubmit={handleAddRecipe}>
              <div className="row g-3">
                <div className="col-md-6">
                  <input className="form-input-clean" placeholder="Title" value={newRecipe.title}
                    onChange={e => setNewRecipe({...newRecipe, title: e.target.value})} required />
                </div>
                <div className="col-md-3">
                  <input className="form-input-clean" type="number" placeholder="Cook time (min)"
                    value={newRecipe.cooking_time}
                    onChange={e => setNewRecipe({...newRecipe, cooking_time: e.target.value})} />
                </div>
                <div className="col-md-3">
                  <input className="form-input-clean" type="number" placeholder="Calories"
                    value={newRecipe.calories}
                    onChange={e => setNewRecipe({...newRecipe, calories: e.target.value})} />
                </div>
                <div className="col-md-8">
                  <input className="form-input-clean" placeholder="Description" value={newRecipe.description}
                    onChange={e => setNewRecipe({...newRecipe, description: e.target.value})} />
                </div>
                <div className="col-md-4">
                  <select className="form-input-clean" value={newRecipe.difficulty}
                    onChange={e => setNewRecipe({...newRecipe, difficulty: e.target.value})}>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
                <div className="col-12">
                  <textarea className="form-input-clean" placeholder="Instructions" rows={3}
                    value={newRecipe.instructions}
                    onChange={e => setNewRecipe({...newRecipe, instructions: e.target.value})} />
                </div>
                <div className="col-12">
                  <button type="submit" className="btn-yellow">Add Recipe</button>
                </div>
              </div>
            </form>
          </div>
        )}

        <div className="row g-3">
          {recipes.length === 0 && (
            <div className="col-12 text-center py-5">
              <p style={{color: 'var(--text-muted)'}}>No recipes found. Add your first one!</p>
            </div>
          )}
          {recipes.map(recipe => (
            <div key={recipe.id} className="col-md-6">
              <div className="card-clean p-4 h-100">
                <div className="recipe-title">{recipe.title}</div>
                <div className="recipe-desc">{recipe.description}</div>
                <div className="recipe-meta">
                  <span className="meta-tag">{recipe.cooking_time} min</span>
                  <span className="meta-tag">{recipe.calories} cal</span>
                  <span className={`meta-tag difficulty-${recipe.difficulty}`}>{recipe.difficulty}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}