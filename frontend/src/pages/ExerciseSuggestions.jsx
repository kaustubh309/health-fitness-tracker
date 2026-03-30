import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const muscleGroups = [
    { id: 'chest', name: 'Chest', image: '/images/chest.png', description: 'Pectoral muscles' },
    { id: 'back', name: 'Back', image: '/images/back.png', description: 'Lats, rhomboids, lower back' },
    { id: 'legs', name: 'Legs', image: '/images/legs.png', description: 'Quads, hamstrings, calves, glutes' },
    { id: 'arms', name: 'Arms', image: '/images/arms.png', description: 'Biceps, triceps, forearms' },
    { id: 'shoulders', name: 'Shoulders', image: '/images/shoulders.png', description: 'Deltoids, traps' },
    { id: 'core', name: 'Core', image: '/images/core.png', description: 'Abs, obliques' },
];

const ExerciseSuggestions = () => {
    return (
        <div style={{ minHeight: '100vh', paddingBottom: '2rem' }}>
            <Navbar />
            <div className="container animate-fade-in" style={{ paddingTop: '2rem' }}>
                <div className="glass-panel" style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Exercise Suggestions</h1>
                    <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '2rem' }}>
                        Select a muscle group to view tutorial videos and exercises.
                    </p>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '1.5rem'
                    }}>
                        {muscleGroups.map((group) => (
                            <Link
                                key={group.id}
                                to={`/exercises/${group.id}`}
                                style={{ textDecoration: 'none' }}
                            >
                                <div className="glass-panel" style={{
                                    padding: '1.5rem',
                                    textAlign: 'center',
                                    transition: 'transform 0.2s, box-shadow 0.2s',
                                    cursor: 'pointer',
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center'
                                }}
                                    onMouseOver={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-5px)';
                                        e.currentTarget.style.boxShadow = '0 10px 25px rgba(56, 189, 248, 0.2)';
                                    }}
                                    onMouseOut={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.1)';
                                    }}
                                >
                                    <div style={{ marginBottom: '1rem', height: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <img src={group.image} alt={group.name} style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))', borderRadius: '8px' }} />
                                    </div>
                                    <h3 style={{ color: 'var(--text-main)', marginBottom: '0.5rem' }}>{group.name}</h3>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>{group.description}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExerciseSuggestions;
