import React from 'react';

const SplashScreen = () => {
    return (
        <div style={{
            height: '100vh',
            width: '100vw',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#121212',
            position: 'fixed',
            top: 0,
            left: 0,
            zIndex: 9999
        }}>
            <h1 style={{
                fontSize: '4.5rem',
                marginBottom: '2rem',
                background: 'linear-gradient(to right, #38bdf8, #818cf8)',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                fontWeight: 'bold',
                letterSpacing: '-1px'
            }}>
                FitTrack
            </h1>

            <div className="splash-spinner"></div>

            <style>
                {`
                .splash-spinner {
                    width: 50px;
                    height: 50px;
                    border: 4px solid rgba(56, 189, 248, 0.2);
                    border-radius: 50%;
                    border-top-color: #38bdf8;
                    animation: splashSpin 1s ease-in-out infinite;
                }
                
                @keyframes splashSpin {
                    to { transform: rotate(360deg); }
                }

                /* Add a subtle fade-in animation to the splash text */
                @keyframes pulseText {
                    0% { opacity: 0.8; transform: scale(0.98); }
                    50% { opacity: 1; transform: scale(1); }
                    100% { opacity: 0.8; transform: scale(0.98); }
                }
                `}
            </style>
        </div>
    );
};

export default SplashScreen;
