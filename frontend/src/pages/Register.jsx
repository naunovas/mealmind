import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/register', { username, email, password });
      navigate('/login');
    } catch (err) {
      setError('Registration failed. Username or email already exists.');
    }
    setLoading(false);
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{background: 'linear-gradient(135deg, #FFF3B0, #FFFDF4)'}}>
      <div className="w-100" style={{maxWidth: '420px', padding: '20px'}}>
        <div className="auth-card">
          <div className="auth-header">
            <div style={{fontSize: '3rem'}}>🍳</div>
            <h2 className="fw-bold mb-0">Join MealMind</h2>
            <p className="mb-0 mt-1">Start planning your meals!</p>
          </div>
          <div className="p-4">
            {error && <div className="alert alert-danger rounded-3">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-semibold">Username</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
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
                {loading ? 'Creating account...' : 'Create Account 🎉'}
              </button>
            </form>
            <p className="text-center mt-3 mb-0">
              Already have account? <Link to="/login" style={{color: 'var(--yellow-dark)', fontWeight: '600'}}>Login here</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}