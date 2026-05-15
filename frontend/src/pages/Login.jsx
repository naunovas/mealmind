import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      login(null, res.data.access_token);
      navigate('/recipes');
    } catch (err) {
      setError('Invalid email or password');
    }
    setLoading(false);
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-logo">🍳</div>
        <div className="auth-title">Welcome back</div>
        <div className="auth-subtitle">Sign in to your MealMind account</div>

        {error && (
          <div style={{background: '#FFF0F0', border: '1px solid #FFDDDD', color: '#CC4444', padding: '10px 14px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '16px'}}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label className="form-label-clean">Email</label>
          <input
            type="email"
            className="form-input-clean"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label className="form-label-clean">Password</label>
          <input
            type="password"
            className="form-input-clean"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="btn-yellow w-100 mt-2" disabled={loading}
            style={{width: '100%', padding: '11px'}}>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p style={{textAlign: 'center', marginTop: '20px', fontSize: '0.875rem', color: 'var(--text-muted)'}}>
          No account? <Link to="/register" style={{color: 'var(--yellow-dark)', fontWeight: '600', textDecoration: 'none'}}>Create one</Link>
        </p>
      </div>
    </div>
  );
}