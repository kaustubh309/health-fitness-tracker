import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../api/axios';

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const [token, setToken] = useState(searchParams.get('token') || '');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setError("Passwords don't match");
            return;
        }

        setLoading(true);
        setMessage('');
        setError('');

        try {
            await api.post('/auth/reset-password', {
                token,
                new_password: newPassword
            });
            setMessage('Password reset successfully! Redirecting to login...');
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to reset password. Token may be invalid or expired.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '400px' }}>
                    <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Reset Password</h2>

                    {message && (
                        <div style={{
                            backgroundColor: 'rgba(34, 197, 94, 0.2)',
                            color: '#4ade80',
                            padding: '1rem',
                            borderRadius: '0.5rem',
                            marginBottom: '1rem'
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
                            <label>Reset Token</label>
                            <input
                                type="text"
                                required
                                value={token}
                                onChange={(e) => setToken(e.target.value)}
                                placeholder="Paste your reset token here"
                            />
                        </div>

                        <div className="form-group">
                            <label>New Password</label>
                            <input
                                type="password"
                                required
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                minLength={6}
                            />
                        </div>

                        <div className="form-group">
                            <label>Confirm Password</label>
                            <input
                                type="password"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                minLength={6}
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary"
                            style={{ width: '100%' }}
                            disabled={loading}
                        >
                            {loading ? 'Resetting...' : 'Set New Password'}
                        </button>
                    </form>

                    <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                        <Link to="/login" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem' }}>
                            Back to Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
