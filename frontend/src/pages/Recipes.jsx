import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Recipes() {
  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState('');
  const { logout, token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchRecipes();
  }, []);

  const fetchRecipes = async (searchTerm = '') => {
    try {
      const res = await api.get(`/recipes/?search=${searchTerm}&limit=20`);
      setRecipes(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    fetchRecipes(e.target.value);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>🍲 Recipes</h2>
        <button onClick={handleLogout}>Logout</button>
      </div>
      <input
        type="text"
        placeholder="Search recipes..."
        value={search}
        onChange={handleSearch}
        style={{ width: '100%', padding: '10px', marginBottom: '20px' }}
      />
      <div>
        {recipes.map((recipe) => (
          <div key={recipe.id} style={{ border: '1px solid #ddd', padding: '15px', marginBottom: '10px', borderRadius: '8px' }}>
            <h3>{recipe.title}</h3>
            <p>{recipe.description}</p>
            <p>⏱ {recipe.cooking_time} min | 🔥 {recipe.calories} cal | 📊 {recipe.difficulty}</p>
          </div>
        ))}
      </div>
    </div>
  );
}