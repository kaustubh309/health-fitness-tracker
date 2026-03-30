import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(email, password);
            navigate('/');
        } catch (err) {
            console.error(err);
            if (err.response && err.response.data && err.response.data.detail) {
                setError(err.response.data.detail);
            } else {
                setError('Registration failed. Check console for details.');
            }
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '400px' }}>
                    <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Create Account</h2>
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
                        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                            Sign Up
                        </button>
                    </form>
                    <p style={{ marginTop: '1.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                        Already have an account? <Link to="/login" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Log in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
