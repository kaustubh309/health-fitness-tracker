import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const Settings = () => {
    const { user, updateProfile } = useAuth();

    const [email, setEmail] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setEmail(user.email || '');
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
                <div style={{ width: '100%', maxWidth: '600px' }}>
                    <h1 style={{ marginBottom: '2rem', textAlign: 'center' }}>Account Settings</h1>

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

                    {/* Email Update Section */}
                    <div className="glass-panel" style={{ marginBottom: '2rem' }}>
                        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Personal Information</h2>
                        <form onSubmit={handleEmailUpdate}>
                            <div className="form-group">
                                <label>Email Address / Username</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <button type="submit" className="btn btn-primary" disabled={loading}>
                                Update Info
                            </button>
                        </form>
                    </div>

                    {/* Password Update Section */}
                    <div className="glass-panel">
                        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Change Password</h2>
                        <form onSubmit={handlePasswordUpdate}>
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
                            <button type="submit" className="btn btn-primary" disabled={loading}>
                                Update Password
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
