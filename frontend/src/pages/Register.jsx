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
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-logo">🧠</div>
        <div className="auth-title">Create account</div>
        <div className="auth-subtitle">Start planning your meals today</div>

        {error && (
          <div style={{background: '#FFF0F0', border: '1px solid #FFDDDD', color: '#CC4444', padding: '10px 14px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '16px'}}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label className="form-label-clean">Username</label>
          <input
            type="text"
            className="form-input-clean"
            placeholder="your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
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
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p style={{textAlign: 'center', marginTop: '20px', fontSize: '0.875rem', color: 'var(--text-muted)'}}>
          Already have account? <Link to="/login" style={{color: 'var(--yellow-dark)', fontWeight: '600', textDecoration: 'none'}}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}