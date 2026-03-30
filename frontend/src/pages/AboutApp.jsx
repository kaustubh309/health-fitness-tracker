import React from 'react';
import Navbar from '../components/Navbar';

const AboutApp = () => {
    return (
        <div style={{ minHeight: '100vh', paddingBottom: '2rem' }}>
            <Navbar />
            <div className="container animate-fade-in" style={{ paddingTop: '2rem' }}>
                <h1 style={{ marginBottom: '1.5rem', fontSize: '2.5rem', textAlign: 'center' }}>
                    Welcome to <span style={{ background: 'linear-gradient(to right, #38bdf8, #818cf8)', WebkitBackgroundClip: 'text', color: 'transparent' }}>FitTrack</span>
                </h1>

                <div className="glass-panel" style={{ marginBottom: '2rem', background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.9))' }}>
                    <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                        <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>Your Journey to a Healthier You Starts Here</h2>
                        <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', fontSize: '1.1rem', maxWidth: '800px', margin: '0 auto' }}>
                            FitTrack is your personal health command center. Designed with simplicity and power in mind, we help you align your fitness goals with actionable data and intelligent insights. Whether you're tracking a morning run or planning your weekly meals, FitTrack is here to support every step of your journey.
                        </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                        <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '2rem', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.05)', transition: 'transform 0.2s', cursor: 'default' }} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💪</div>
                            <h3 style={{ fontSize: '1.4rem', color: '#38bdf8', marginBottom: '1rem' }}>
                                Activity Tracking
                            </h3>
                            <p style={{ fontSize: '1rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                                Effortlessly log your workouts. From high-intensity interval training to yoga, track your duration and let our system calculate calories burned based on metabolic equivalents.
                            </p>
                        </div>

                        <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '2rem', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.05)', transition: 'transform 0.2s', cursor: 'default' }} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🥗</div>
                            <h3 style={{ fontSize: '1.4rem', color: '#818cf8', marginBottom: '1rem' }}>
                                Nutrition Management
                            </h3>
                            <p style={{ fontSize: '1rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                                Fuel your body right. Monitor your daily caloric intake and get detailed macro-nutrient breakdowns. Our database helps you make informed decisions about your diet.
                            </p>
                        </div>

                        <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '2rem', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.05)', transition: 'transform 0.2s', cursor: 'default' }} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🧠</div>
                            <h3 style={{ fontSize: '1.4rem', color: '#c084fc', marginBottom: '1rem' }}>
                                Smart Analysis
                            </h3>
                            <p style={{ fontSize: '1rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                                Gain insights that matter. Receive AI-generated feedback on your activities and visualize your progress with intuitive charts and statistics.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutApp;
