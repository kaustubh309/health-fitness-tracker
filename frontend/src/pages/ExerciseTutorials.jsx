import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const exerciseData = {
    chest: [
        { id: 1, title: 'Barbell Bench Press', videoId: 'hWbUlkb5Ms4', description: 'A compound exercise targeting the pectoralis major.' },
        { id: 2, title: 'Incline Dumbbell Press', videoId: '8fXfwG4ftaQ', description: 'Targets the upper chest muscles.' },
        { id: 3, title: 'Cable Crossovers', videoId: 'NyO5y-G5Ceg', description: 'Great for isolating the chest and getting a good stretch.' },
    ],
    back: [
        { id: 4, title: 'Barbell Deadlift', videoId: 'ZaTM37cfiDs', description: 'A full-body movement that heavily engages the back.' },
        { id: 5, title: 'Pull-ups', videoId: 'RhNyvtK-IaA', description: 'Excellent bodyweight exercise for the lats.' },
        { id: 6, title: 'Bent Over Barbell Row', videoId: 'MXfyuB6DjWE', description: 'Builds thickness in the mid-back.' },
    ],
    legs: [
        { id: 7, title: 'Barbell Squat', videoId: 'MLoZuAkIyZI', description: 'The king of leg exercises, targeting quads, glutes, and hamstrings.' },
        { id: 8, title: 'Romanian Deadlift', videoId: '5rIqP63yWFg', description: 'Focuses on the hamstrings and glutes.' },
        { id: 9, title: 'Leg Press', videoId: 'nDh_BlnLCGc', description: 'A machine-based exercise for overall leg development.' },
    ],
    arms: [
        { id: 10, title: 'Barbell Bicep Curl', videoId: 'ez3YoWf62Eg', description: 'Classic exercise for building bicep mass.' },
        { id: 11, title: 'Tricep Pushdown', videoId: 'Rc7-euA8FDI', description: 'Isolates the triceps using a cable machine.' },
        { id: 12, title: 'Hammer Curls', videoId: 'BRVDS6HVR9Q', description: 'Targets the brachialis and brachioradialis.' },
    ],
    shoulders: [
        { id: 13, title: 'Overhead Press', videoId: 'KP1sYz2VICk', description: 'Builds overall shoulder mass and strength.' },
        { id: 14, title: 'Lateral Raises', videoId: 'Kl3LEzQ5Zqs', description: 'Isolates the medial deltoid for wider shoulders.' },
        { id: 15, title: 'Face Pulls', videoId: 'IeOqdw9WI90', description: 'Important for rear delts and shoulder health.' },
    ],
    core: [
        { id: 16, title: 'Plank', videoId: 'v25dawSzRTM', description: 'Builds core stability and endurance.' },
        { id: 17, title: 'Hanging Leg Raises', videoId: '2n4UqRIJyk4', description: 'Targets the lower abdominals.' },
        { id: 18, title: 'Russian Twists', videoId: '-BzNffL_6YE', description: 'Great for the obliques and rotational strength.' },
    ]
};

const ExerciseTutorials = () => {
    const { muscleGroup } = useParams();

    // Capitalize the muscle group name for the title
    const formattedTitle = muscleGroup
        ? muscleGroup.charAt(0).toUpperCase() + muscleGroup.slice(1)
        : 'Unknown';

    const videos = exerciseData[muscleGroup] || [];

    return (
        <div style={{ minHeight: '100vh', paddingBottom: '2rem' }}>
            <Navbar />
            <div className="container animate-fade-in" style={{ paddingTop: '2rem' }}>
                <div className="glass-panel" style={{ maxWidth: '1000px', margin: '0 auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                        <h1 style={{ margin: 0 }}>{formattedTitle} Exercises</h1>
                        <Link to="/exercises" className="btn btn-outline" style={{ fontSize: '0.9rem' }}>
                            &larr; Back to Categories
                        </Link>
                    </div>

                    {videos.length > 0 ? (
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                            gap: '2rem'
                        }}>
                            {videos.map((video) => (
                                <div key={video.id} className="glass-panel" style={{ padding: '1rem', background: 'rgba(15, 23, 42, 0.4)' }}>
                                    <div style={{
                                        position: 'relative',
                                        paddingBottom: '56.25%', /* 16:9 Aspect Ratio */
                                        height: 0,
                                        overflow: 'hidden',
                                        borderRadius: '8px',
                                        marginBottom: '1rem'
                                    }}>
                                        <iframe
                                            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                                            src={`https://www.youtube.com/embed/${video.videoId}`}
                                            title={video.title}
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        ></iframe>
                                    </div>
                                    <h3 style={{ marginBottom: '0.5rem', fontSize: '1.2rem', color: 'var(--primary)' }}>{video.title}</h3>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.5' }}>
                                        {video.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
                            <p>No tutorial videos found for this muscle group.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ExerciseTutorials;
