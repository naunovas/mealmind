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
  const navigate = useNavigate();
<Link to="/what-i-have" className="btn btn-outline-dark rounded-pill px-3">🧠 What I Have</Link>
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
  const { logout, token, role } = useAuth();


{role === 'admin' && (
  <Link to="/admin" className="btn btn-warning rounded-pill px-3">⚙️ Admin</Link>
)}

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

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div style={{minHeight: '100vh', background: 'var(--bg-cream)'}}>
      {/* Navbar */}
      <nav className="navbar-mealmind py-3 px-4 d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center gap-2">
          <span style={{fontSize: '1.8rem'}}>🧠</span>
          <span className="fw-bold fs-4">MealMind</span>
        </div>
        <div className="d-flex gap-2">
          <Link to="/meal-plan" className="btn btn-outline-dark rounded-pill px-3">📅 Meal Plan</Link>
          <button onClick={handleLogout} className="btn btn-dark rounded-pill px-3">Logout</button>
        </div>
      </nav>

      <div className="container py-4">
        {/* Search */}
        <div className="row justify-content-center mb-4">
          <div className="col-md-8">
            <input
              type="text"
              className="search-bar"
              placeholder="🔍 Search recipes..."
              value={search}
              onChange={handleSearch}
            />
          </div>
        </div>

        {/* Filters */}
        <div className="d-flex justify-content-center gap-2 mb-4 flex-wrap">
          {['', 'easy', 'medium', 'hard'].map(d => (
            <button
              key={d}
              onClick={() => handleDifficulty(d)}
              className={`btn rounded-pill px-4 ${difficulty === d ? 'btn-primary-yellow' : 'btn-outline-secondary'}`}
            >
              {d === '' ? '🍽 All' : d === 'easy' ? '🟢 Easy' : d === 'medium' ? '🟡 Medium' : '🔴 Hard'}
            </button>
          ))}
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="btn btn-primary-yellow rounded-pill px-4"
          >
            {showAddForm ? '✕ Cancel' : '+ Add Recipe'}
          </button>
        </div>

        {/* Add Recipe Form */}
        {showAddForm && (
          <div className="card recipe-card p-4 mb-4">
            <h5 className="fw-bold mb-3">🍳 New Recipe</h5>
            <form onSubmit={handleAddRecipe}>
              <div className="row g-3">
                <div className="col-md-6">
                  <input className="form-control" placeholder="Title" value={newRecipe.title}
                    onChange={e => setNewRecipe({...newRecipe, title: e.target.value})} required />
                </div>
                <div className="col-md-3">
                  <input className="form-control" type="number" placeholder="Cooking time (min)"
                    value={newRecipe.cooking_time}
                    onChange={e => setNewRecipe({...newRecipe, cooking_time: e.target.value})} />
                </div>
                <div className="col-md-3">
                  <input className="form-control" type="number" placeholder="Calories"
                    value={newRecipe.calories}
                    onChange={e => setNewRecipe({...newRecipe, calories: e.target.value})} />
                </div>
                <div className="col-md-6">
                  <input className="form-control" placeholder="Description" value={newRecipe.description}
                    onChange={e => setNewRecipe({...newRecipe, description: e.target.value})} />
                </div>
                <div className="col-md-3">
                  <select className="form-select" value={newRecipe.difficulty}
                    onChange={e => setNewRecipe({...newRecipe, difficulty: e.target.value})}>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
                <div className="col-md-3">
                  <button type="submit" className="btn btn-primary-yellow w-100">Add Recipe</button>
                </div>
                <div className="col-12">
                  <textarea className="form-control" placeholder="Instructions" rows={3}
                    value={newRecipe.instructions}
                    onChange={e => setNewRecipe({...newRecipe, instructions: e.target.value})} />
                </div>
              </div>
            </form>
          </div>
        )}

        {/* Recipe Grid */}
        <div className="row g-4">
          {recipes.length === 0 && (
            <div className="col-12 text-center py-5">
              <div style={{fontSize: '4rem'}}>🍽️</div>
              <p className="text-muted fs-5">No recipes found. Add your first one!</p>
            </div>
          )}
          {recipes.map(recipe => (
            <div key={recipe.id} className="col-md-6 col-lg-4">
              <div className="recipe-card card h-100">
                <div className="card-header py-3">
                  {recipe.title}
                </div>
                <div className="card-body">
                  <p className="text-muted small mb-3">{recipe.description}</p>
                  <div className="d-flex gap-2 flex-wrap">
                    <span className="badge bg-light text-dark">⏱ {recipe.cooking_time} min</span>
                    <span className="badge bg-light text-dark">🔥 {recipe.calories} cal</span>
                    <span className={`badge-difficulty badge-${recipe.difficulty}`}>
                      {recipe.difficulty}
                    </span>
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