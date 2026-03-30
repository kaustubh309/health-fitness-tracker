import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
    const { user } = useAuth();
    const [workouts, setWorkouts] = useState([]);
    const [stats, setStats] = useState({ count: 0, duration: 0, calories: 0 });

    // Form State
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [duration, setDuration] = useState('');
    const [isFormVisible, setIsFormVisible] = useState(false);

    const fetchWorkouts = async () => {
        try {
            const { data } = await api.get('/workouts/');
            setWorkouts(data);

            // Calculate stats
            const totalDuration = data.reduce((acc, curr) => acc + curr.duration, 0);
            const totalCalories = data.reduce((acc, curr) => acc + curr.calories, 0);
            setStats({ count: data.length, duration: totalDuration, calories: totalCalories });
        } catch (error) {
            console.error('Failed to fetch workouts');
        }
    };

    useEffect(() => {
        fetchWorkouts();
    }, []);

    const handleAddWorkout = async (e) => {
        e.preventDefault();
        try {
            // Updated to NOT send calories
            await api.post('/workouts/', {
                title,
                description,
                duration: parseInt(duration)
            });
            // Reset form
            setTitle(''); setDescription(''); setDuration(''); setIsFormVisible(false);
            fetchWorkouts();
        } catch (error) {
            console.error('Failed to add workout');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            await api.delete(`/workouts/${id}`);
            fetchWorkouts();
        } catch (error) {
            console.error('Failed to delete');
        }
    };

    return (
        <div style={{ minHeight: '100vh', paddingBottom: '2rem' }}>
            <Navbar />
            <div className="container animate-fade-in" style={{ paddingTop: '2rem' }}>
                <h1 style={{ marginBottom: '1.5rem', fontSize: '2rem' }}>
                    Hello, <span style={{ background: 'linear-gradient(to right, #f87171, #f472b6)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>{user?.email?.split('@')[0]}!</span>
                </h1>

                {/* Nutrition Call to Action */}
                <div className="glass-panel responsive-flex-row" style={{ marginBottom: '2rem', background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.1), rgba(129, 140, 248, 0.1))' }}>
                    <div>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🥗 Food Calorie Tracker</h2>
                        <p style={{ color: 'var(--text-muted)' }}>Track your meals, calculate macros, and get personalized nutrition advice.</p>
                    </div>
                    <Link to="/nutrition" className="btn btn-primary btn-inline">Open Tracker</Link>
                </div>

                {/* Stats Row */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                    <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center' }}>
                        <h3 style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>Workouts</h3>
                        <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'white' }}>{stats.count}</p>
                    </div>
                    <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center' }}>
                        <h3 style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>Minutes</h3>
                        <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#38bdf8' }}>{stats.duration}</p>
                    </div>
                    <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center' }}>
                        <h3 style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>Calories Burned</h3>
                        <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#818cf8' }}>{Math.round(stats.calories)}</p>
                    </div>
                </div>

                {/* Chart Button Instead of Chart */}
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <Link to="/analytics" className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', borderColor: '#a78bfa', color: '#a78bfa' }}>
                        📊 View Full Analytics & Insights
                    </Link>
                </div>

                <div className="responsive-flex-row" style={{ marginBottom: '2rem' }}>
                    <h1>Your Activities</h1>
                    <button
                        className="btn btn-primary btn-inline"
                        onClick={() => setIsFormVisible(!isFormVisible)}
                    >
                        {isFormVisible ? 'Close Form' : '+ Add Workout'}
                    </button>
                </div>

                {/* Add Form */}
                {isFormVisible && (
                    <div className="glass-panel animate-fade-in" style={{ marginBottom: '3rem' }}>
                        <form onSubmit={handleAddWorkout} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                            <div className="form-group" style={{ margin: 0 }}>
                                <label>Activity Type</label>
                                <input placeholder="e.g. Running, Yoga, Cycling..." value={title} onChange={e => setTitle(e.target.value)} required />
                            </div>
                            <div className="form-group" style={{ margin: 0 }}>
                                <label>Duration (minutes)</label>
                                <input type="number" placeholder="30" value={duration} onChange={e => setDuration(e.target.value)} required />
                            </div>
                            {/* Calorie input removed */}
                            <div className="form-group" style={{ margin: 0, gridColumn: '1 / -1' }}>
                                <label>Notes (Optional)</label>
                                <input placeholder="How did you feel?" value={description} onChange={e => setDescription(e.target.value)} />
                            </div>
                            <div style={{ gridColumn: '1 / -1' }}>
                                <button type="submit" className="btn btn-primary">Save Activity & Get Analysis</button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Workout List */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
                    {workouts.map(w => (
                        <div key={w.id} className="glass-panel animate-fade-in" style={{ padding: '1.5rem', position: 'relative', display: 'flex', flexDirection: 'column' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                                <h3 style={{ margin: 0, fontSize: '1.4rem' }}>{w.title}</h3>
                                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                    {new Date(w.date).toLocaleDateString()}
                                </div>
                            </div>

                            {/* Analysis Section */}
                            {(w.analysis) && (
                                <div style={{
                                    background: 'rgba(255, 255, 255, 0.05)',
                                    padding: '0.75rem',
                                    borderRadius: '8px',
                                    marginBottom: '1rem',
                                    borderLeft: '3px solid var(--secondary)'
                                }}>
                                    <p style={{ fontSize: '0.9rem', color: '#e2e8f0', fontStyle: 'italic', margin: 0 }}>
                                        "{w.analysis}"
                                    </p>
                                </div>
                            )}

                            {w.description && <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>{w.description}</p>}

                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginTop: 'auto' }}>
                                <div style={{ background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', padding: '0.25rem 0.75rem', borderRadius: '100px', fontSize: '0.9rem', fontWeight: '500' }}>
                                    ⏱️ {w.duration} min
                                </div>
                                <div style={{ background: 'rgba(129, 140, 248, 0.1)', color: '#818cf8', padding: '0.25rem 0.75rem', borderRadius: '100px', fontSize: '0.9rem', fontWeight: '500' }}>
                                    🔥 {Math.round(w.calories)} cal
                                </div>
                            </div>
                            <button
                                onClick={() => handleDelete(w.id)}
                                className="btn-danger"
                                style={{ position: 'absolute', bottom: '1.5rem', right: '1.5rem', padding: '0.4rem 0.6rem', borderRadius: '6px', border: 'none', cursor: 'pointer' }}
                            >
                                Delete
                            </button>
                        </div>
                    ))}
                    {workouts.length === 0 && (
                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                            No workouts yet. Add your first activity to separate analysis!
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
