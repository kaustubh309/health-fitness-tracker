import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../api/axios';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setError('');

        try {
            const { data } = await api.post('/auth/forgot-password', { email });
            setMessage(data.message);
        } catch (err) {
            setError(err.response?.data?.detail || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '400px' }}>
                    <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Forgot Password</h2>

                    {message && (
                        <div style={{
                            backgroundColor: 'rgba(34, 197, 94, 0.2)',
                            color: '#4ade80',
                            padding: '1rem',
                            borderRadius: '0.5rem',
                            marginBottom: '1rem',
                            wordBreak: 'break-all'
                        }}>
                            {message}
                        </div>
                    )}

                    {error && (
                        <div style={{ color: '#fca5a5', marginBottom: '1rem', textAlign: 'center' }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Email Address</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your registered email"
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary"
                            style={{ width: '100%' }}
                            disabled={loading}
                        >
                            {loading ? 'Sending...' : 'Reset Password'}
                        </button>
                    </form>

                    <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                        <Link to="/login" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem' }}>
                            Back to Login
                        </Link>
                        <span style={{ margin: '0 0.5rem', color: 'var(--text-muted)' }}>|</span>
                        <Link to="/reset-password" style={{ color: 'var(--primary)', textDecoration: 'none', fontSize: '0.9rem' }}>
                            Have a token?
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
