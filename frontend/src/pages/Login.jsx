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
    <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{background: 'linear-gradient(135deg, #FFF3B0, #FFFDF4)'}}>
      <div className="w-100" style={{maxWidth: '420px', padding: '20px'}}>
        <div className="auth-card">
          <div className="auth-header">
            <div style={{fontSize: '3rem'}}>🧠</div>
            <h2 className="fw-bold mb-0">MealMind</h2>
            <p className="mb-0 mt-1">Welcome back!</p>
          </div>
          <div className="p-4">
            {error && <div className="alert alert-danger rounded-3">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-semibold">Email</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="form-label fw-semibold">Password</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary-yellow w-100" disabled={loading}>
                {loading ? 'Logging in...' : 'Login 🚀'}
              </button>
            </form>
            <p className="text-center mt-3 mb-0">
              No account? <Link to="/register" style={{color: 'var(--yellow-dark)', fontWeight: '600'}}>Register here</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}