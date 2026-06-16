import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { FaCheck, FaCrown, FaRocket, FaSeedling, FaTimes } from 'react-icons/fa';

const Membership = () => {
    const { user } = useAuth();
    const [billingCycle, setBillingCycle] = useState('yearly'); // 'monthly' or 'yearly'
    const [currentPlan, setCurrentPlan] = useState('Free');
    const [showCheckout, setShowCheckout] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [checkoutSuccess, setCheckoutSuccess] = useState(false);

    // Mock payment form state
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvv, setCvv] = useState('');
    const [cardName, setCardName] = useState('');
    const [formError, setFormError] = useState('');

    useEffect(() => {
        if (user) {
            const plan = localStorage.getItem(`fit_track_plan_${user.email}`) || 'Free';
            setCurrentPlan(plan);
        }
    }, [user]);

    const handleSelectPlan = (plan) => {
        if (plan === 'Free') {
            // Downgrade or select Free
            if (user) {
                localStorage.setItem(`fit_track_plan_${user.email}`, 'Free');
                setCurrentPlan('Free');
            }
            return;
        }
        setSelectedPlan(plan);
        setShowCheckout(true);
        setCheckoutSuccess(false);
        setFormError('');
    };

    const handlePaymentSubmit = (e) => {
        e.preventDefault();
        if (!cardNumber || !expiry || !cvv || !cardName) {
            setFormError('Please fill in all payment details.');
            return;
        }
        if (cardNumber.replace(/\s/g, '').length < 16) {
            setFormError('Please enter a valid 16-digit card number.');
            return;
        }

        // Simulate API call
        setTimeout(() => {
            if (user) {
                localStorage.setItem(`fit_track_plan_${user.email}`, selectedPlan);
                setCurrentPlan(selectedPlan);
            }
            setCheckoutSuccess(true);
            // Auto close modal after 2 seconds
            setTimeout(() => {
                setShowCheckout(false);
                setCheckoutSuccess(false);
                setCardNumber('');
                setExpiry('');
                setCvv('');
                setCardName('');
            }, 2000);
        }, 1000);
    };

    // Calculate Prices based on billing cycle
    const getProPrice = () => {
        return billingCycle === 'yearly' ? '$17' : '$20';
    };

    return (
        <div style={{ minHeight: '100vh', paddingBottom: '4rem', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            
            <div className="container animate-fade-in" style={{ flex: 1, paddingTop: '3rem', maxWidth: '1100px', width: '100%' }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <h1 style={{ fontSize: '2.8rem', marginBottom: '1rem', fontWeight: '800' }}>
                        Elevate Your Fitness Journey
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto 2rem auto' }}>
                        Unlock premium features, deep AI coaching insights, and personalized routines to maximize your potential.
                    </p>

                    {/* Billing Cycle Toggle */}
                    <div style={{ 
                        display: 'inline-flex', 
                        alignItems: 'center', 
                        background: 'rgba(15, 23, 42, 0.6)', 
                        padding: '0.4rem', 
                        borderRadius: '50px',
                        border: '1px solid var(--glass-border)'
                    }}>
                        <button 
                            onClick={() => setBillingCycle('monthly')}
                            style={{
                                padding: '0.6rem 1.5rem',
                                borderRadius: '50px',
                                border: 'none',
                                cursor: 'pointer',
                                fontWeight: '600',
                                fontSize: '0.95rem',
                                transition: 'all 0.3s ease',
                                background: billingCycle === 'monthly' ? 'white' : 'transparent',
                                color: billingCycle === 'monthly' ? 'var(--bg-dark)' : 'var(--text-muted)'
                            }}
                        >
                            Monthly
                        </button>
                        <button 
                            onClick={() => setBillingCycle('yearly')}
                            style={{
                                padding: '0.6rem 1.5rem',
                                borderRadius: '50px',
                                border: 'none',
                                cursor: 'pointer',
                                fontWeight: '600',
                                fontSize: '0.95rem',
                                transition: 'all 0.3s ease',
                                background: billingCycle === 'yearly' ? 'white' : 'transparent',
                                color: billingCycle === 'yearly' ? 'var(--bg-dark)' : 'var(--text-muted)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}
                        >
                            Yearly 
                            <span style={{ 
                                background: 'linear-gradient(135deg, #38bdf8, #818cf8)', 
                                color: 'white', 
                                padding: '0.15rem 0.5rem', 
                                borderRadius: '50px', 
                                fontSize: '0.75rem',
                                fontWeight: 'bold'
                            }}>
                                Save 15%
                            </span>
                        </button>
                    </div>
                </div>

                {/* Plan Cards Flex Container */}
                <div style={{ 
                    display: 'flex', 
                    flexDirection: 'row', 
                    gap: '2rem',
                    justifyContent: 'center',
                    flexWrap: 'wrap',
                    alignItems: 'stretch',
                    width: '100%'
                }}>
                    
                    {/* Free Plan */}
                    <div className="glass-panel" style={{
                        display: 'flex',
                        flexDirection: 'column',
                        border: currentPlan === 'Free' ? '2px solid var(--primary)' : '1px solid var(--glass-border)',
                        position: 'relative',
                        transition: 'transform 0.3s ease',
                        transform: currentPlan === 'Free' ? 'scale(1.02)' : 'none',
                        flex: '1 1 300px',
                        maxWidth: '350px'
                    }}>
                        {currentPlan === 'Free' && (
                            <div style={{
                                position: 'absolute',
                                top: '-12px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                                color: 'white',
                                padding: '0.25rem 1rem',
                                borderRadius: '50px',
                                fontSize: '0.8rem',
                                fontWeight: 'bold',
                                boxShadow: '0 4px 10px rgba(56, 189, 248, 0.4)'
                            }}>
                                Current Plan
                            </div>
                        )}
                        <div style={{ paddingBottom: '2rem', borderBottom: '1px solid var(--glass-border)' }}>
                            <div style={{ color: 'var(--primary)', fontSize: '2rem', marginBottom: '1rem' }}>
                                <FaSeedling />
                            </div>
                            <h2 style={{ fontSize: '1.75rem', margin: '0 0 0.5rem 0' }}>Free</h2>
                            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', minHeight: '40px' }}>
                                Essential tracking tools for individuals starting out.
                            </p>
                            <div style={{ margin: '1.5rem 0 2rem 0', display: 'flex', alignItems: 'baseline' }}>
                                <span style={{ fontSize: '2.5rem', fontWeight: '800' }}>$0</span>
                            </div>
                            <button 
                                onClick={() => handleSelectPlan('Free')}
                                disabled={currentPlan === 'Free'}
                                className={`btn ${currentPlan === 'Free' ? 'btn-outline' : 'btn-primary'}`}
                                style={{ 
                                    width: '100%', 
                                    opacity: currentPlan === 'Free' ? 0.7 : 1,
                                    cursor: currentPlan === 'Free' ? 'default' : 'pointer'
                                }}
                            >
                                {currentPlan === 'Free' ? 'Current Plan' : 'Downgrade to Free'}
                            </button>
                        </div>
                        <div style={{ paddingTop: '2rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                            <p style={{ fontWeight: '600', marginBottom: '1rem', fontSize: '0.95rem' }}>Features include:</p>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                <li style={{ display: 'flex', gap: '0.75rem', fontSize: '0.95rem', color: 'var(--text-main)' }}>
                                    <FaCheck style={{ color: '#10b981', flexShrink: 0, marginTop: '3px' }} />
                                    <span>Track up to 5 workouts per week</span>
                                </li>
                                <li style={{ display: 'flex', gap: '0.75rem', fontSize: '0.95rem', color: 'var(--text-main)' }}>
                                    <FaCheck style={{ color: '#10b981', flexShrink: 0, marginTop: '3px' }} />
                                    <span>Log daily nutrition & calorie totals</span>
                                </li>
                                <li style={{ display: 'flex', gap: '0.75rem', fontSize: '0.95rem', color: 'var(--text-main)' }}>
                                    <FaCheck style={{ color: '#10b981', flexShrink: 0, marginTop: '3px' }} />
                                    <span>Standard muscle group recommendations</span>
                                </li>
                                <li style={{ display: 'flex', gap: '0.75rem', fontSize: '0.95rem', color: 'var(--text-main)' }}>
                                    <FaCheck style={{ color: '#10b981', flexShrink: 0, marginTop: '3px' }} />
                                    <span>Basic activity history charts</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Pro Plan */}
                    <div className="glass-panel" style={{
                        display: 'flex',
                        flexDirection: 'column',
                        border: currentPlan === 'Pro' ? '2px solid #818cf8' : '1px solid var(--glass-border)',
                        position: 'relative',
                        transition: 'transform 0.3s ease',
                        transform: currentPlan === 'Pro' ? 'scale(1.02)' : 'none',
                        background: 'linear-gradient(180deg, rgba(30, 41, 59, 0.8) 0%, rgba(30, 41, 59, 0.4) 100%)',
                        flex: '1 1 300px',
                        maxWidth: '350px'
                    }}>
                        {currentPlan === 'Pro' && (
                            <div style={{
                                position: 'absolute',
                                top: '-12px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                background: 'linear-gradient(135deg, #818cf8, #a78bfa)',
                                color: 'white',
                                padding: '0.25rem 1rem',
                                borderRadius: '50px',
                                fontSize: '0.8rem',
                                fontWeight: 'bold',
                                boxShadow: '0 4px 10px rgba(129, 140, 248, 0.4)'
                            }}>
                                Current Plan
                            </div>
                        )}
                        <div style={{ paddingBottom: '2rem', borderBottom: '1px solid var(--glass-border)' }}>
                            <div style={{ color: '#818cf8', fontSize: '2rem', marginBottom: '1rem' }}>
                                <FaRocket />
                            </div>
                            <h2 style={{ fontSize: '1.75rem', margin: '0 0 0.5rem 0' }}>Pro</h2>
                            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', minHeight: '40px' }}>
                                Deep AI insights and limitless health logs for enthusiasts.
                            </p>
                            <div style={{ margin: '1.5rem 0 2rem 0', display: 'flex', alignItems: 'baseline', gap: '0.3rem' }}>
                                <span style={{ fontSize: '2.5rem', fontWeight: '800' }}>{getProPrice()}</span>
                                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                    {billingCycle === 'yearly' ? 'USD / month billed annually' : 'USD / month'}
                                </span>
                            </div>
                            <button 
                                onClick={() => handleSelectPlan('Pro')}
                                disabled={currentPlan === 'Pro'}
                                className="btn btn-primary"
                                style={{ 
                                    width: '100%', 
                                    background: currentPlan === 'Pro' ? 'rgba(255, 255, 255, 0.1)' : 'linear-gradient(135deg, #818cf8, #38bdf8)',
                                    color: currentPlan === 'Pro' ? 'var(--text-muted)' : 'white',
                                    border: currentPlan === 'Pro' ? '1px solid var(--glass-border)' : 'none',
                                    cursor: currentPlan === 'Pro' ? 'default' : 'pointer',
                                    boxShadow: currentPlan === 'Pro' ? 'none' : '0 4px 15px rgba(129, 140, 248, 0.3)'
                                }}
                            >
                                {currentPlan === 'Pro' ? 'Current Plan' : 'Get Pro plan'}
                            </button>
                        </div>
                        <div style={{ paddingTop: '2rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                            <p style={{ fontWeight: '600', marginBottom: '1rem', fontSize: '0.95rem' }}>Everything in Free and:</p>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                <li style={{ display: 'flex', gap: '0.75rem', fontSize: '0.95rem', color: 'var(--text-main)' }}>
                                    <FaCheck style={{ color: '#10b981', flexShrink: 0, marginTop: '3px' }} />
                                    <span>Unlimited workout & nutrition logging</span>
                                </li>
                                <li style={{ display: 'flex', gap: '0.75rem', fontSize: '0.95rem', color: 'var(--text-main)' }}>
                                    <FaCheck style={{ color: '#10b981', flexShrink: 0, marginTop: '3px' }} />
                                    <span>Deep AI analysis & instant advice on every logged workout</span>
                                </li>
                                <li style={{ display: 'flex', gap: '0.75rem', fontSize: '0.95rem', color: 'var(--text-main)' }}>
                                    <FaCheck style={{ color: '#10b981', flexShrink: 0, marginTop: '3px' }} />
                                    <span>Detailed macros tracker & calorie goals</span>
                                </li>
                                <li style={{ display: 'flex', gap: '0.75rem', fontSize: '0.95rem', color: 'var(--text-main)' }}>
                                    <FaCheck style={{ color: '#10b981', flexShrink: 0, marginTop: '3px' }} />
                                    <span>Access to all HD exercise tutorial videos</span>
                                </li>
                                <li style={{ display: 'flex', gap: '0.75rem', fontSize: '0.95rem', color: 'var(--text-main)' }}>
                                    <FaCheck style={{ color: '#10b981', flexShrink: 0, marginTop: '3px' }} />
                                    <span>Personalized weekly wellness insights</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Max Plan */}
                    <div className="glass-panel" style={{
                        display: 'flex',
                        flexDirection: 'column',
                        border: currentPlan === 'Max' ? '2px solid #a78bfa' : '1px solid var(--glass-border)',
                        position: 'relative',
                        transition: 'transform 0.3s ease',
                        transform: currentPlan === 'Max' ? 'scale(1.02)' : 'none',
                        flex: '1 1 300px',
                        maxWidth: '350px'
                    }}>
                        {currentPlan === 'Max' && (
                            <div style={{
                                position: 'absolute',
                                top: '-12px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                background: 'linear-gradient(135deg, #a78bfa, #c084fc)',
                                color: 'white',
                                padding: '0.25rem 1rem',
                                borderRadius: '50px',
                                fontSize: '0.8rem',
                                fontWeight: 'bold',
                                boxShadow: '0 4px 10px rgba(167, 139, 250, 0.4)'
                            }}>
                                Current Plan
                            </div>
                        )}
                        <div style={{ paddingBottom: '2rem', borderBottom: '1px solid var(--glass-border)' }}>
                            <div style={{ color: '#a78bfa', fontSize: '2rem', marginBottom: '1rem' }}>
                                <FaCrown />
                            </div>
                            <h2 style={{ fontSize: '1.75rem', margin: '0 0 0.5rem 0' }}>Max</h2>
                            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', minHeight: '40px' }}>
                                Professional support, custom training programs, and elite coaching.
                            </p>
                            <div style={{ margin: '1.5rem 0 2rem 0', display: 'flex', alignItems: 'baseline', gap: '0.3rem' }}>
                                <span style={{ fontSize: '2.5rem', fontWeight: '800' }}>From $100</span>
                                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                    USD / month billed monthly
                                </span>
                            </div>
                            <button 
                                onClick={() => handleSelectPlan('Max')}
                                disabled={currentPlan === 'Max'}
                                className="btn btn-outline"
                                style={{ 
                                    width: '100%', 
                                    background: currentPlan === 'Max' ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                                    color: currentPlan === 'Max' ? 'var(--text-muted)' : '#a78bfa',
                                    borderColor: currentPlan === 'Max' ? 'var(--glass-border)' : '#a78bfa',
                                    cursor: currentPlan === 'Max' ? 'default' : 'pointer'
                                }}
                            >
                                {currentPlan === 'Max' ? 'Current Plan' : 'Get Max plan'}
                            </button>
                            <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.75rem', marginBlockEnd: 0 }}>
                                No commitment · Cancel anytime
                            </p>
                        </div>
                        <div style={{ paddingTop: '2rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                            <p style={{ fontWeight: '600', marginBottom: '1rem', fontSize: '0.95rem' }}>Everything in Pro, plus:</p>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                <li style={{ display: 'flex', gap: '0.75rem', fontSize: '0.95rem', color: 'var(--text-main)' }}>
                                    <FaCheck style={{ color: '#10b981', flexShrink: 0, marginTop: '3px' }} />
                                    <span>Direct chat channel with professional certified coach</span>
                                </li>
                                <li style={{ display: 'flex', gap: '0.75rem', fontSize: '0.95rem', color: 'var(--text-main)' }}>
                                    <FaCheck style={{ color: '#10b981', flexShrink: 0, marginTop: '3px' }} />
                                    <span>Custom monthly training and meal program plans</span>
                                </li>
                                <li style={{ display: 'flex', gap: '0.75rem', fontSize: '0.95rem', color: 'var(--text-main)' }}>
                                    <FaCheck style={{ color: '#10b981', flexShrink: 0, marginTop: '3px' }} />
                                    <span>Weekly live 1-on-1 coaching video consultation calls</span>
                                </li>
                                <li style={{ display: 'flex', gap: '0.75rem', fontSize: '0.95rem', color: 'var(--text-main)' }}>
                                    <FaCheck style={{ color: '#10b981', flexShrink: 0, marginTop: '3px' }} />
                                    <span>Priority support 24/7 with immediate response times</span>
                                </li>
                                <li style={{ display: 'flex', gap: '0.75rem', fontSize: '0.95rem', color: 'var(--text-main)' }}>
                                    <FaCheck style={{ color: '#10b981', flexShrink: 0, marginTop: '3px' }} />
                                    <span>Family synchronization for up to 5 active accounts</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                </div>
            </div>

            {/* Checkout Dialog Modal */}
            {showCheckout && (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(15, 23, 42, 0.85)',
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
                        position: 'relative',
                        padding: '2.5rem 2rem 2rem 2rem',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        background: 'rgba(30, 41, 59, 0.95)'
                    }}>
                        <button 
                            onClick={() => setShowCheckout(false)}
                            style={{
                                position: 'absolute',
                                top: '1rem',
                                right: '1rem',
                                background: 'transparent',
                                border: 'none',
                                color: 'var(--text-muted)',
                                cursor: 'pointer',
                                fontSize: '1.2rem'
                            }}
                        >
                            <FaTimes />
                        </button>

                        {checkoutSuccess ? (
                            <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                                <div style={{ 
                                    width: '70px', 
                                    height: '70px', 
                                    borderRadius: '50%', 
                                    background: 'rgba(16, 185, 129, 0.15)', 
                                    color: '#10b981',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '2rem',
                                    marginBottom: '1.5rem'
                                }}>
                                    <FaCheck />
                                </div>
                                <h2 style={{ fontSize: '1.8rem', color: 'white', marginBottom: '0.5rem' }}>Upgrade Successful!</h2>
                                <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
                                    Welcome to FitTrack <strong>{selectedPlan}</strong>! Enjoy your premium experience.
                                </p>
                            </div>
                        ) : (
                            <div>
                                <h2 style={{ fontSize: '1.6rem', marginBottom: '0.5rem', textAlign: 'center' }}>
                                    Upgrade to {selectedPlan}
                                </h2>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', textAlign: 'center', marginBottom: '2rem' }}>
                                    {selectedPlan === 'Pro' 
                                        ? `You will be charged ${getProPrice()}/month ${billingCycle === 'yearly' ? '(billed annually)' : ''}`
                                        : 'You will be charged $100/month (billed monthly)'
                                    }
                                </p>

                                {formError && (
                                    <div style={{ 
                                        color: '#fca5a5', 
                                        background: 'rgba(239, 68, 68, 0.1)', 
                                        border: '1px solid rgba(239, 68, 68, 0.3)',
                                        padding: '0.75rem', 
                                        borderRadius: '8px', 
                                        marginBottom: '1rem',
                                        fontSize: '0.9rem',
                                        textAlign: 'center'
                                    }}>
                                        {formError}
                                    </div>
                                )}

                                <form onSubmit={handlePaymentSubmit}>
                                    <div className="form-group">
                                        <label>Cardholder Name</label>
                                        <input 
                                            type="text" 
                                            placeholder="Jane Doe" 
                                            required
                                            value={cardName}
                                            onChange={e => setCardName(e.target.value)}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Card Number</label>
                                        <input 
                                            type="text" 
                                            placeholder="xxxx xxxx xxxx xxxx" 
                                            required
                                            maxLength="19"
                                            value={cardNumber}
                                            onChange={e => {
                                                // Format input as xxxx xxxx xxxx xxxx
                                                const val = e.target.value.replace(/\D/g, '');
                                                const matches = val.match(/\d{4,16}/g);
                                                const match = (matches && matches[0]) || '';
                                                const parts = [];

                                                for (let i = 0, len = match.length; i < len; i += 4) {
                                                    parts.push(match.substring(i, i + 4));
                                                }

                                                if (parts.length > 0) {
                                                    setCardNumber(parts.join(' '));
                                                } else {
                                                    setCardNumber(val);
                                                }
                                            }}
                                        />
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                        <div className="form-group">
                                            <label>Expiry (MM/YY)</label>
                                            <input 
                                                type="text" 
                                                placeholder="MM/YY" 
                                                required
                                                maxLength="5"
                                                value={expiry}
                                                onChange={e => {
                                                    // Format expiration date
                                                    let val = e.target.value.replace(/\D/g, '');
                                                    if (val.length > 2) {
                                                        val = val.substring(0, 2) + '/' + val.substring(2, 4);
                                                    }
                                                    setExpiry(val);
                                                }}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>CVV</label>
                                            <input 
                                                type="password" 
                                                placeholder="***" 
                                                required
                                                maxLength="3"
                                                value={cvv}
                                                onChange={e => setCvv(e.target.value.replace(/\D/g, ''))}
                                            />
                                        </div>
                                    </div>

                                    <button 
                                        type="submit" 
                                        className="btn btn-primary" 
                                        style={{ 
                                            width: '100%', 
                                            marginTop: '1.5rem',
                                            background: 'linear-gradient(135deg, #10b981, #059669)',
                                            boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)'
                                        }}
                                    >
                                        Pay & Upgrade Now
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Membership;
