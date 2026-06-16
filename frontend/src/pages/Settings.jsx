import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const Settings = () => {
    const { user, updateProfile } = useAuth();
    const [email, setEmail] = useState('');
    const [userPlan, setUserPlan] = useState('Free');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setEmail(user.email || '');
            const plan = localStorage.getItem(`fit_track_plan_${user.email}`) || 'Free';
            setUserPlan(plan);
        }
    }, [user]);

    const handleEmailUpdate = async (e) => {
        e.preventDefault();
        setMessage(''); setError(''); setLoading(true);
        try {
            await updateProfile({ email });
            setMessage('Account details updated successfully');
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to update account');
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setError("New passwords don't match");
            return;
        }

        setMessage(''); setError(''); setLoading(true);
        try {
            await api.put('/users/me/password', {
                current_password: currentPassword,
                new_password: newPassword
            });
            setMessage('Password updated successfully');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to update password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <div className="container" style={{ flex: 1, padding: '2rem', display: 'flex', justifyContent: 'center' }}>
                <div style={{ width: '100%', maxWidth: '1200px' }}>
                    <h1 style={{ marginBottom: '2.5rem', textAlign: 'center' }}>Account Settings</h1>

                    {message && (
                        <div style={{
                            backgroundColor: 'rgba(34, 197, 94, 0.2)',
                            color: '#4ade80',
                            padding: '1rem',
                            borderRadius: '0.5rem',
                            marginBottom: '2rem',
                            textAlign: 'center'
                        }}>
                            {message}
                        </div>
                    )}

                    {error && (
                        <div style={{ 
                            backgroundColor: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            color: '#fca5a5', 
                            padding: '1rem',
                            borderRadius: '0.5rem',
                            marginBottom: '2rem', 
                            textAlign: 'center' 
                        }}>
                            {error}
                        </div>
                    )}

                    <div style={{
                        display: 'flex',
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        gap: '2rem',
                        justifyContent: 'center',
                        alignItems: 'stretch'
                    }}>
                        {/* Email Update Section */}
                        <div className="glass-panel" style={{ flex: '1 1 300px', maxWidth: '360px', display: 'flex', flexDirection: 'column', marginBottom: 0 }}>
                            <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Personal Information</h2>
                            <form onSubmit={handleEmailUpdate} style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                                <div className="form-group">
                                    <label>Email Address / Username</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary" style={{ marginTop: 'auto' }} disabled={loading}>
                                    Update Info
                                </button>
                            </form>
                        </div>

                        {/* Membership Settings Section */}
                        <div className="glass-panel" style={{ flex: '1 1 300px', maxWidth: '360px', display: 'flex', flexDirection: 'column', marginBottom: 0 }}>
                            <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Membership Plan</h2>
                            <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                                <div style={{ 
                                    background: 'rgba(255, 255, 255, 0.05)',
                                    padding: '1.25rem',
                                    borderRadius: '12px',
                                    border: '1px solid var(--glass-border)',
                                    marginBottom: '1.5rem'
                                }}>
                                    <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.85rem' }}>Current Active Plan</p>
                                    <p style={{ margin: '0.4rem 0 0 0', fontWeight: 'bold', fontSize: '1.3rem', color: 'white' }}>
                                        {userPlan} Plan
                                    </p>
                                </div>
                                {userPlan !== 'Max' ? (
                                    <Link 
                                        to="/membership" 
                                        className="btn btn-primary" 
                                        style={{ 
                                            background: 'linear-gradient(135deg, #f87171, #f472b6)',
                                            boxShadow: '0 4px 15px rgba(248, 113, 113, 0.3)',
                                            width: '100%',
                                            textDecoration: 'none',
                                            fontWeight: '600'
                                        }}
                                    >
                                        Upgrade Plan
                                    </Link>
                                ) : (
                                    <Link 
                                        to="/membership" 
                                        className="btn btn-outline" 
                                        style={{ 
                                            width: '100%',
                                            textDecoration: 'none',
                                            fontWeight: '600'
                                        }}
                                    >
                                        View Details
                                    </Link>
                                )}
                            </div>
                        </div>

                        {/* Password Update Section */}
                        <div className="glass-panel" style={{ flex: '1 1 300px', maxWidth: '360px', display: 'flex', flexDirection: 'column', marginBottom: 0 }}>
                            <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Change Password</h2>
                            <form onSubmit={handlePasswordUpdate} style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                                <div>
                                    <div className="form-group">
                                        <label>Current Password</label>
                                        <input
                                            type="password"
                                            value={currentPassword}
                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                            required
                                            minLength={6}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>New Password</label>
                                        <input
                                            type="password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            required
                                            minLength={6}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Confirm New Password</label>
                                        <input
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            required
                                            minLength={6}
                                        />
                                    </div>
                                </div>
                                <button type="submit" className="btn btn-primary" style={{ marginTop: 'auto' }} disabled={loading}>
                                    Update Password
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
