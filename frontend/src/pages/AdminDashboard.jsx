
import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                const [usersRes, statsRes] = await Promise.all([
                    api.get('/users/admin/users'),
                    api.get('/users/admin/stats')
                ]);
                setUsers(usersRes.data);
                setStats(statsRes.data);
            } catch (error) {
                console.error("Failed to fetch admin data", error);
                if (error.response && error.response.status === 403) {
                    alert("Unauthorized access");
                    navigate('/login');
                }
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchAdminData();
        }
    }, [user, navigate]);

    const handleLogout = () => {
        logout();
        navigate('/admin/login');
    };

    if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading Admin Panel...</div>;

    const admins = users.filter(u => u.is_admin);
    const regularUsers = users.filter(u => !u.is_admin);

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', padding: '2rem' }}>
            <div className="container" style={{ maxWidth: '1200px' }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                    <h1 style={{ background: 'linear-gradient(to right, #f87171, #f472b6)', WebkitBackgroundClip: 'text', color: 'transparent', margin: 0 }}>
                        Admin Dashboard
                    </h1>
                    <button onClick={handleLogout} className="btn btn-outline">Logout</button>
                </div>

                {/* Stats Cards */}
                {stats && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                        <div className="glass-panel" style={{ textAlign: 'center', borderLeft: '4px solid #38bdf8' }}>
                            <h3 style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Total Accounts</h3>
                            <p style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{stats.total_users}</p>
                        </div>
                        <div className="glass-panel" style={{ textAlign: 'center', borderLeft: '4px solid #818cf8' }}>
                            <h3 style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Total Workouts Logged</h3>
                            <p style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{stats.total_workouts}</p>
                        </div>
                        <div className="glass-panel" style={{ textAlign: 'center', borderLeft: '4px solid #f472b6' }}>
                            <h3 style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Admins</h3>
                            <p style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{admins.length}</p>
                        </div>
                    </div>
                )}

                {/* Admin Accounts List */}
                <div className="glass-panel" style={{ marginBottom: '3rem' }}>
                    <h2 style={{ marginBottom: '1.5rem', color: '#fca5a5' }}>🛡️ Admin Accounts</h2>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', color: 'var(--text-main)' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--glass-border)', textAlign: 'left' }}>
                                    <th style={{ padding: '1rem' }}>ID</th>
                                    <th style={{ padding: '1rem' }}>Email</th>
                                    <th style={{ padding: '1rem' }}>Status</th>
                                    <th style={{ padding: '1rem' }}>Password (Hashed)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {admins.map(admin => (
                                    <tr key={admin.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        <td style={{ padding: '1rem' }}>{admin.id}</td>
                                        <td style={{ padding: '1rem', fontWeight: 'bold' }}>{admin.email}</td>
                                        <td style={{ padding: '1rem' }}>
                                            <span style={{ background: 'rgba(52, 211, 153, 0.2)', color: '#34d399', padding: '0.25rem 0.75rem', borderRadius: '100px', fontSize: '0.8rem' }}>Active</span>
                                        </td>
                                        <td style={{ padding: '1rem', fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--text-muted)', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {/* We only show a preview of hash for security/layout */}
                                            {/* Note: In a real app, even hashed passwords shouldn't be exposed like this, but per user request */}
                                            See Database
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* User Accounts List */}
                <div className="glass-panel">
                    <h2 style={{ marginBottom: '1.5rem', color: '#38bdf8' }}>👥 User Accounts</h2>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', color: 'var(--text-main)' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--glass-border)', textAlign: 'left' }}>
                                    <th style={{ padding: '1rem' }}>ID</th>
                                    <th style={{ padding: '1rem' }}>Email</th>
                                    <th style={{ padding: '1rem' }}>Experience</th>
                                    <th style={{ padding: '1rem' }}>Goal</th>
                                    <th style={{ padding: '1rem' }}>Password (Hashed)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {regularUsers.map(u => (
                                    <tr key={u.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        <td style={{ padding: '1rem' }}>{u.id}</td>
                                        <td style={{ padding: '1rem' }}>{u.email}</td>
                                        <td style={{ padding: '1rem', textTransform: 'capitalize' }}>{u.experience_level || '-'}</td>
                                        <td style={{ padding: '1rem', textTransform: 'capitalize' }}>{u.goal?.replace('_', ' ') || '-'}</td>
                                        <td style={{ padding: '1rem', fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--text-muted)', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            ********
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
