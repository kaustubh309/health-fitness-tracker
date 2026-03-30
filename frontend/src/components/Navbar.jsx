import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaBars, FaTimes } from 'react-icons/fa';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        setIsMobileMenuOpen(false);
        navigate('/login');
    };

    const isActive = (path) => {
        return location.pathname === path ? 'active' : '';
    };

    const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

    const closeMenu = () => setIsMobileMenuOpen(false);

    return (
        <nav style={{
            padding: '1rem 0',
            background: 'rgba(15, 23, 42, 0.8)',
            backdropFilter: 'blur(10px)',
            borderBottom: '1px solid var(--glass-border)',
            position: 'sticky',
            top: 0,
            zIndex: 100
        }}>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link to="/" style={{ textDecoration: 'none' }} onClick={closeMenu}>
                    <h2 style={{ margin: 0, fontSize: '1.5rem', background: 'linear-gradient(to right, #38bdf8, #818cf8)', WebkitBackgroundClip: 'text', color: 'transparent' }}>
                        FitTrack
                    </h2>
                </Link>

                {/* Desktop Menu */}
                <div className="desktop-menu" style={{ gap: '1.5rem' }}>
                    {user ? (
                        <>
                            <Link to="/about" className={`nav-link ${isActive('/about')}`}>About</Link>
                            <Link to="/" className={`nav-link ${isActive('/')}`}>Home</Link>
                            <Link to="/nutrition" className={`nav-link ${isActive('/nutrition')}`}>Nutrition</Link>
                            <Link to="/exercises" className={`nav-link ${isActive('/exercises')}`}>Exercises</Link>
                            <Link to="/analytics" className={`nav-link ${isActive('/analytics')}`}>Analytics</Link>
                            <Link to="/profile" className={`nav-link ${isActive('/profile')}`}>Profile</Link>
                            <Link to="/settings" className={`nav-link ${isActive('/settings')}`}>My Account</Link>
                            <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="btn btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>Login</Link>
                            <Link to="/register" className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>Sign Up</Link>
                        </>
                    )}
                </div>

                {/* Mobile Toggle */}
                <div className="mobile-toggle" onClick={toggleMenu}>
                    {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="glass-panel" style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    margin: '1rem',
                    padding: '2rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '1.5rem',
                    zIndex: 99
                }}>
                    {user ? (
                        <>
                            <Link to="/about" className={`nav-link ${isActive('/about')}`} onClick={closeMenu}>About</Link>
                            <Link to="/" className={`nav-link ${isActive('/')}`} onClick={closeMenu}>Home</Link>
                            <Link to="/nutrition" className={`nav-link ${isActive('/nutrition')}`} onClick={closeMenu}>Nutrition</Link>
                            <Link to="/exercises" className={`nav-link ${isActive('/exercises')}`} onClick={closeMenu}>Exercises</Link>
                            <Link to="/analytics" className={`nav-link ${isActive('/analytics')}`} onClick={closeMenu}>Analytics</Link>
                            <Link to="/profile" className={`nav-link ${isActive('/profile')}`} onClick={closeMenu}>Profile</Link>
                            <Link to="/settings" className={`nav-link ${isActive('/settings')}`} onClick={closeMenu}>My Account</Link>
                            <button onClick={handleLogout} className="btn btn-outline" style={{ width: '100%' }}>
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="btn btn-outline" style={{ width: '100%' }} onClick={closeMenu}>Login</Link>
                            <Link to="/register" className="btn btn-primary" style={{ width: '100%' }} onClick={closeMenu}>Sign Up</Link>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
