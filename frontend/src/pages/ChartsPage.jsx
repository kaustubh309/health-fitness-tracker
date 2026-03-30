import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import WorkoutChart from '../components/WorkoutChart';

const ChartsPage = () => {
    const [workouts, setWorkouts] = useState([]);
    const [nutritionLogs, setNutritionLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const [workoutsRes, nutritionRes] = await Promise.all([
                api.get('/workouts/'),
                api.get('/nutrition/')
            ]);
            setWorkouts(workoutsRes.data);
            setNutritionLogs(nutritionRes.data);
        } catch (error) {
            console.error('Failed to fetch data for charts', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div style={{ minHeight: '100vh', paddingBottom: '2rem', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <div className="container animate-fade-in" style={{ flex: 1, paddingTop: '2rem' }}>
                <div style={{ marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
                        <span style={{ background: 'linear-gradient(to right, #a78bfa, #38bdf8)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
                            Analytics & Insights
                        </span>
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
                        Visualize your fitness journey, energy balance, and activity trends.
                    </p>
                </div>

                {loading ? (
                    <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                        Loading your personal analytics...
                    </div>
                ) : (
                    <WorkoutChart workouts={workouts} nutritionLogs={nutritionLogs} />
                )}
            </div>
        </div>
    );
};

export default ChartsPage;
