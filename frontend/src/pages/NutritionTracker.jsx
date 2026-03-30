import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

const NutritionTracker = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [numMeals, setNumMeals] = useState(3);
    const [meals, setMeals] = useState([]);
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(false);

    // Saved Logs State
    const [savedLogs, setSavedLogs] = useState([]);
    const [saving, setSaving] = useState(false);

    const fetchLogs = async () => {
        try {
            const { data } = await api.get('/nutrition/');
            setSavedLogs(data);
        } catch (error) {
            console.error('Failed to fetch nutrition logs', error);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    const handleSaveLog = async () => {
        if (!analysis) return;
        setSaving(true);
        try {
            await api.post('/nutrition/', {
                calories: analysis.calories,
                protein: analysis.protein,
                carbs: analysis.carbs,
                fat: analysis.fat,
                meals_data: JSON.stringify(analysis.meals)
            });
            alert("Nutrition saved to your diary!");
            fetchLogs();
            reset();
        } catch (error) {
            console.error("Failed to save log", error);
            alert("Failed to save log.");
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteLog = async (id) => {
        if (!window.confirm('Are you sure you want to delete this nutrition log?')) return;
        try {
            await api.delete(`/nutrition/${id}`);
            fetchLogs();
        } catch (error) {
            console.error('Failed to delete', error);
        }
    };

    // Step 1: Initialize Meals
    const handleNumMealsSubmit = (e) => {
        e.preventDefault();
        const initialMeals = Array.from({ length: numMeals }, (_, i) => ({
            name: `Meal ${i + 1}`,
            items: [{ name: '', quantity: 1 }] // Start with 1 empty item
        }));
        setMeals(initialMeals);
        setStep(2);
    };

    // Step 2: Manage Meal Content
    const handleItemChange = (mealIndex, itemIndex, field, value) => {
        const updatedMeals = [...meals];
        updatedMeals[mealIndex].items[itemIndex][field] = value;
        setMeals(updatedMeals);
    };

    const addItemToMeal = (mealIndex) => {
        const updatedMeals = [...meals];
        updatedMeals[mealIndex].items.push({ name: '', quantity: 1 });
        setMeals(updatedMeals);
    };

    const removeItemFromMeal = (mealIndex, itemIndex) => {
        const updatedMeals = [...meals];
        updatedMeals[mealIndex].items.splice(itemIndex, 1);
        setMeals(updatedMeals);
    };

    const handleCalculate = async () => {
        setLoading(true);
        try {
            // Filter out empty items
            const cleanedMeals = meals.map(meal => ({
                ...meal,
                items: meal.items.filter(item => item.name.trim() !== '')
            })).filter(meal => meal.items.length > 0);

            const { data } = await api.post('/nutrition/calculate', { meals: cleanedMeals });
            setAnalysis(data);
            setStep(3);
        } catch (error) {
            console.error("Analysis failed", error);
            alert("Failed to calculate. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const reset = () => {
        setStep(1);
        setAnalysis(null);
        setMeals([]);
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <div className="container" style={{ flex: 1, padding: '2rem', display: 'flex', justifyContent: 'center' }}>
                <div style={{ width: '100%', maxWidth: '800px' }}>

                    {step === 1 && (
                        <div className="glass-panel animate-fade-in" style={{ textAlign: 'center' }}>
                            <h2 style={{ marginBottom: '2rem' }}>How many meals do you eat per day?</h2>
                            <form onSubmit={handleNumMealsSubmit}>
                                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', alignItems: 'center', marginBottom: '2rem' }}>
                                    <button type="button" className="btn btn-outline" onClick={() => setNumMeals(Math.max(1, numMeals - 1))}>-</button>
                                    <span style={{ fontSize: '2rem', fontWeight: 'bold', minWidth: '3rem' }}>{numMeals}</span>
                                    <button type="button" className="btn btn-outline" onClick={() => setNumMeals(Math.min(10, numMeals + 1))}>+</button>
                                </div>
                                <button type="submit" className="btn btn-primary">Next: Enter Foods</button>
                            </form>
                        </div>
                    )}

                    {/* Show Saved Logs on Step 1 */}
                    {step === 1 && (
                        <div style={{ marginTop: '4rem' }} className="animate-fade-in">
                            <h2 style={{ marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem', color: 'var(--primary)' }}>Your Saved Food Diary</h2>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                                {savedLogs.map(log => (
                                    <div key={log.id} className="glass-panel" style={{ padding: '1.5rem', position: 'relative', display: 'flex', flexDirection: 'column' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                                            <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Diary Entry</h3>
                                            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                                {new Date(log.date).toLocaleDateString()}
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                                            <div style={{ background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', padding: '0.25rem 0.75rem', borderRadius: '100px', fontSize: '0.9rem', fontWeight: '500' }}>
                                                🔥 {Math.round(log.calories)} cal
                                            </div>
                                            <div style={{ background: 'rgba(129, 140, 248, 0.1)', color: '#818cf8', padding: '0.25rem 0.75rem', borderRadius: '100px', fontSize: '0.9rem', fontWeight: '500' }}>
                                                🥩 {Math.round(log.protein)}g P
                                            </div>
                                        </div>

                                        <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem', flex: 1 }}>
                                            Carbs: {Math.round(log.carbs)}g | Fat: {Math.round(log.fat)}g
                                        </div>

                                        <button
                                            onClick={() => handleDeleteLog(log.id)}
                                            className="btn-danger"
                                            style={{ position: 'absolute', bottom: '1.5rem', right: '1.5rem', padding: '0.4rem 0.6rem', borderRadius: '6px', border: 'none', cursor: 'pointer' }}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                ))}
                                {savedLogs.length === 0 && (
                                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.02)', borderRadius: '12px' }}>
                                        No logs saved yet. Calculate and save your first day!
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="animate-fade-in">
                            <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>What's in your meals?</h2>
                            <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '2rem' }}>Enter food name (e.g. "Chicken breast") and approx servings.</p>

                            <div style={{ display: 'grid', gap: '2rem' }}>
                                {meals.map((meal, mIndex) => (
                                    <div key={mIndex} className="glass-panel">
                                        <h3 style={{ marginBottom: '1rem', color: 'var(--primary)' }}>{meal.name}</h3>
                                        {meal.items.map((item, iIndex) => (
                                            <div key={iIndex} style={{ display: 'flex', gap: '1rem', marginBottom: '0.5rem' }}>
                                                <input
                                                    placeholder="Food Item (e.g. Rice)"
                                                    value={item.name}
                                                    onChange={e => handleItemChange(mIndex, iIndex, 'name', e.target.value)}
                                                    style={{ flex: 2 }}
                                                />
                                                <input
                                                    type="number"
                                                    placeholder="Qty"
                                                    value={item.quantity}
                                                    onChange={e => handleItemChange(mIndex, iIndex, 'quantity', parseFloat(e.target.value) || 1)}
                                                    style={{ flex: 0.5, minWidth: '60px' }}
                                                />
                                                <button
                                                    type="button"
                                                    className="btn btn-danger"
                                                    onClick={() => removeItemFromMeal(mIndex, iIndex)}
                                                    style={{ padding: '0.5rem' }}
                                                >
                                                    X
                                                </button>
                                            </div>
                                        ))}
                                        <button
                                            type="button"
                                            className="btn btn-outline"
                                            onClick={() => addItemToMeal(mIndex)}
                                            style={{ marginTop: '0.5rem', fontSize: '0.9rem', padding: '0.5rem 1rem' }}
                                        >
                                            + Add Item
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
                                <button className="btn btn-outline" onClick={() => setStep(1)}>Back</button>
                                <button className="btn btn-primary" onClick={handleCalculate} disabled={loading}>
                                    {loading ? 'Calculating...' : 'Calculate Nutrition'}
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 3 && analysis && (
                        <div className="animate-fade-in">
                            <h2 style={{ marginBottom: '2rem', textAlign: 'center' }}>Nutrition Analysis</h2>

                            {/* Summary Cards */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                                <div className="glass-panel" style={{ padding: '1rem', textAlign: 'center', borderColor: 'var(--primary)' }}>
                                    <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Calories</div>
                                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{Math.round(analysis.calories)}</div>
                                </div>
                                <div className="glass-panel" style={{ padding: '1rem', textAlign: 'center' }}>
                                    <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Protein</div>
                                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#818cf8' }}>{Math.round(analysis.protein)}g</div>
                                </div>
                                <div className="glass-panel" style={{ padding: '1rem', textAlign: 'center' }}>
                                    <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Carbs</div>
                                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#facc15' }}>{Math.round(analysis.carbs)}g</div>
                                </div>
                                <div className="glass-panel" style={{ padding: '1rem', textAlign: 'center' }}>
                                    <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Fat</div>
                                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#fca5a5' }}>{Math.round(analysis.fat)}g</div>
                                </div>
                            </div>

                            {/* Suggestions */}
                            {analysis.suggestions && analysis.suggestions.length > 0 && (
                                <div className="glass-panel" style={{ marginBottom: '2rem', borderLeft: '4px solid #facc15' }}>
                                    <h3 style={{ marginBottom: '1rem' }}>Suggestions</h3>
                                    <ul style={{ paddingLeft: '1.5rem' }}>
                                        {analysis.suggestions.map((s, i) => (
                                            <li key={i} style={{ marginBottom: '0.5rem', color: 'var(--text-main)' }}>{s}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Breakdown */}
                            <h3 style={{ marginBottom: '1rem' }}>Meal Breakdown</h3>
                            <div style={{ display: 'grid', gap: '1.5rem' }}>
                                {analysis.meals.map((meal, i) => (
                                    <div key={i} className="glass-panel">
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                            <h4>{meal.name}</h4>
                                            <div style={{ fontWeight: 'bold', color: 'var(--primary)' }}>{Math.round(meal.calories)} cal</div>
                                        </div>
                                        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                                            <span>P: {Math.round(meal.protein)}g</span>
                                            <span>C: {Math.round(meal.carbs)}g</span>
                                            <span>F: {Math.round(meal.fat)}g</span>
                                        </div>
                                        <ul style={{ fontSize: '0.9rem', paddingLeft: '1.2rem', color: 'rgba(255,255,255,0.8)' }}>
                                            {meal.items.map((item, j) => (
                                                <li key={j}>
                                                    {item.quantity}x {item.name}: {Math.round(item.calories)} cal
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>

                            <div style={{ marginTop: '2.5rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                                <button className="btn btn-outline" onClick={reset}>Discard & Calculate Another</button>
                                <button className="btn btn-primary" onClick={handleSaveLog} disabled={saving} style={{ background: 'linear-gradient(to right, #a78bfa, #818cf8)' }}>
                                    {saving ? 'Saving...' : '💾 Save to Diary'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NutritionTracker;
