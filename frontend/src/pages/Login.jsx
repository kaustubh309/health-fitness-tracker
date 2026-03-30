import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password, rememberMe);
      navigate('/');
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '400px' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Welcome Back</h2>
          {error && <div style={{ color: '#fca5a5', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div
              style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', cursor: 'pointer' }}
              onClick={() => setRememberMe(!rememberMe)}
            >
              {/* Custom Circular Checkbox */}
              <div style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                border: '2px solid',
                borderColor: rememberMe ? '#f472b6' : 'var(--text-muted)',
                background: rememberMe ? 'linear-gradient(to right, #f87171, #f472b6)' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s',
                flexShrink: 0
              }}>
                {rememberMe && (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="14px" height="14px">
                    <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clipRule="evenodd" />
                  </svg>
                )}
              </div>

              {/* Text Label */}
              <span style={{
                margin: 0,
                fontSize: '0.9rem',
                background: rememberMe ? 'linear-gradient(to right, #f87171, #f472b6)' : 'none',
                WebkitBackgroundClip: rememberMe ? 'text' : 'none',
                WebkitTextFillColor: rememberMe ? 'transparent' : 'var(--text-muted)',
                color: rememberMe ? 'transparent' : 'var(--text-muted)',
                fontWeight: rememberMe ? '600' : 'normal',
                transition: 'all 0.2s'
              }}>
                Remember Me
              </span>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              Sign In
            </button>
          </form>
          <p style={{ marginTop: '1rem', textAlign: 'center' }}>
            <Link to="/forgot-password" style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textDecoration: 'none' }}>
              Forgot Password?
            </Link>
          </p>
          <p style={{ marginTop: '0.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            Don't have an account? <Link to="/register" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Sign up</Link>
          </p>
          <div style={{ marginTop: '2rem', borderTop: '1px solid var(--glass-border)', paddingTop: '1rem', textAlign: 'center' }}>
            <Link to="/admin/login" style={{ color: '#fca5a5', textDecoration: 'none', fontSize: '0.9rem', opacity: 0.8 }}>
              🔒 Admin Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
