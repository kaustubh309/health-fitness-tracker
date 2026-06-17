import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [showGreeting, setShowGreeting] = useState(false);
    const [visitCount, setVisitCount] = useState(1);
    const [userPlan, setUserPlan] = useState('Free');

    useEffect(() => {
        if (user) {
            const shownKey = `fit_track_greeting_shown_${user.email}`;
            const countKey = `fit_track_visits_${user.email}`;
            
            const isShown = sessionStorage.getItem(shownKey);
            if (!isShown) {
                const prevCount = parseInt(localStorage.getItem(countKey) || '0', 10);
                const newCount = prevCount + 1;
                localStorage.setItem(countKey, newCount.toString());
                setVisitCount(newCount);
                setShowGreeting(true);
                sessionStorage.setItem(shownKey, 'true');
            }

            const plan = localStorage.getItem(`fit_track_plan_${user.email}`) || 'Free';
            setUserPlan(plan);
        }
    }, [user]);

    const getGreetingMessage = () => {
        const name = user?.email?.split('@')[0] || 'Athlete';
        if (visitCount === 1) {
            return `Welcome to FitTrack, ${name}! This is your first visit. Let's start your fitness journey today! 🚀`;
        } else if (visitCount === 2) {
            return `Welcome back, ${name}! Great to see you for the second time! Ready for another workout? 💪`;
        } else if (visitCount === 3) {
            return `Welcome back, ${name}! Third time's a charm. Keep building that consistency! 🔥`;
        } else if (visitCount === 4) {
            return `Awesome to see you again, ${name}! That's 4 visits now. Consistency is key! 🌟`;
        } else {
            return `Hello champion, ${name}! You have visited us ${visitCount} times now. You're making fitness a lifestyle! 🏆`;
        }
    };
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
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    marginBottom: '1.5rem',
                    flexWrap: 'wrap',
                    gap: '1rem'
                }}>
                    <h1 style={{ margin: 0, fontSize: '2rem' }}>
                        Hello, <span style={{ background: 'linear-gradient(to right, #f87171, #f472b6)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>{user?.email?.split('@')[0]}!</span>
                    </h1>
                    {userPlan !== 'Max' && (
                        <Link 
                            to="/membership" 
                            className="btn btn-primary btn-inline" 
                            style={{ 
                                background: 'linear-gradient(135deg, #f87171, #f472b6)',
                                boxShadow: '0 4px 15px rgba(248, 113, 113, 0.3)',
                                padding: '0.6rem 1.5rem',
                                fontSize: '0.95rem',
                                margin: 0,
                                borderRadius: '8px',
                                display: 'inline-flex',
                                alignItems: 'center'
                            }}
                        >
                            Upgrade Plan
                        </Link>
                    )}
                </div>

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
                <div style={{ display: 'flex', flexWrap: 'nowrap', overflowX: 'auto', gap: '1.5rem' }}>
                    {workouts.map(w => (
                        <div key={w.id} className="glass-panel animate-fade-in" style={{ padding: '1.5rem', position: 'relative', display: 'flex', flexDirection: 'column', minWidth: '350px' }}>
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

            {/* Greeting Dialog Modal */}
            {showGreeting && (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(15, 23, 42, 0.8)',
                    backdropFilter: 'blur(8px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    padding: '1rem'
                }}>
                    <div className="glass-panel animate-fade-in" style={{
                        width: '100%',
                        maxWidth: '450px',
                        textAlign: 'center',
                        padding: '2.5rem 2rem',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        background: 'rgba(30, 41, 59, 0.95)'
                    }}>
                        <div style={{
                            fontSize: '3rem',
                            marginBottom: '1rem',
                            background: 'linear-gradient(135deg, #38bdf8, #818cf8)',
                            WebkitBackgroundClip: 'text',
                            color: 'transparent',
                            display: 'inline-block'
                        }}>
                            👋
                        </div>
                        <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem', color: 'white' }}>
                            {visitCount === 1 ? 'Welcome!' : 'Welcome Back!'}
                        </h2>
                        <p style={{ 
                            color: 'var(--text-main)', 
                            fontSize: '1.05rem', 
                            lineHeight: '1.6', 
                            marginBottom: '2rem',
                            background: 'rgba(255, 255, 255, 0.05)',
                            padding: '1rem',
                            borderRadius: '12px',
                            border: '1px solid rgba(255, 255, 255, 0.05)'
                        }}>
                            {getGreetingMessage()}
                        </p>

                        <div className="workout-list">
                            <button 
                                onClick={() => {
                                    setShowGreeting(false);
                                    navigate('/membership');
                                }}
                                className="btn btn-primary"
                                style={{ 
                                    width: '100%',
                                    background: 'linear-gradient(135deg, #f87171, #f472b6)',
                                    boxShadow: '0 4px 15px rgba(248, 113, 113, 0.3)'
                                }}
                            >
                                Upgrade to Premium
                            </button>
                            <button 
                                onClick={() => setShowGreeting(false)}
                                className="btn btn-outline"
                                style={{ width: '100%' }}
                            >
                                Maybe Later
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
