import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await login(email, password);
            navigate('/admin/dashboard');
        } catch (err) {
            setError('Invalid admin credentials');
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)'
        }}>
            <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '400px' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: '#fca5a5' }}>Admin Portal</h2>

                {error && (
                    <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)', color: '#fca5a5', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1.5rem', textAlign: 'center' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Admin Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-danger" style={{ width: '100%', marginTop: '1rem' }}>
                        Access Dashboard
                    </button>
                    <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                        <a href="/login" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem' }}>
                            ← Back to User Login
                        </a>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
