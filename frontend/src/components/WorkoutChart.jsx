import React, { useMemo } from 'react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, ComposedChart, Line
} from 'recharts';

const WorkoutChart = ({ workouts, nutritionLogs = [] }) => {
    const chartData = useMemo(() => {
        // Group by date
        const grouped = {};

        workouts.forEach(w => {
            const dateObj = new Date(w.date);
            const dateStr = dateObj.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

            if (!grouped[dateStr]) {
                grouped[dateStr] = {
                    date: dateStr,
                    caloriesOut: 0,
                    caloriesIn: 0,
                    duration: 0,
                    sortKey: dateObj.setHours(0, 0, 0, 0)
                };
            }
            grouped[dateStr].caloriesOut += Math.round(w.calories || 0);
            grouped[dateStr].duration += parseInt(w.duration) || 0;
        });

        nutritionLogs.forEach(log => {
            const dateObj = new Date(log.date);
            const dateStr = dateObj.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

            if (!grouped[dateStr]) {
                grouped[dateStr] = {
                    date: dateStr,
                    caloriesOut: 0,
                    caloriesIn: 0,
                    duration: 0,
                    sortKey: dateObj.setHours(0, 0, 0, 0)
                };
            }
            grouped[dateStr].caloriesIn += Math.round(log.calories || 0);
        });

        // Sort by date ascending
        return Object.values(grouped).sort((a, b) => a.sortKey - b.sortKey);
    }, [workouts, nutritionLogs]);

    if (!chartData || chartData.length === 0) {
        return (
            <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', marginBottom: '3rem', color: 'var(--text-muted)' }}>
                No tracking data available to visualize. Add some workouts or nutrition logs to see your beautiful charts!
            </div>
        );
    }

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div style={{
                    background: 'rgba(15, 23, 42, 0.9)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    padding: '1rem',
                    borderRadius: '12px',
                    color: '#fff',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.8)'
                }}>
                    <p style={{ margin: '0 0 0.5rem 0', fontWeight: 'bold', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>{label}</p>
                    {payload.map((entry, index) => (
                        <div key={index} style={{ display: 'flex', justifyContent: 'space-between', gap: '1.5rem', marginTop: '0.6rem' }}>
                            <span style={{ color: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                <div style={{ width: 8, height: 8, borderRadius: '50%', background: entry.color }}></div>
                                {entry.name}:
                            </span>
                            <span style={{ color: '#fff', fontWeight: '600' }}>
                                {entry.value} {entry.name === 'Duration' ? 'min' : 'cal'}
                            </span>
                        </div>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="charts-container" style={{ display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', gap: '2rem', marginBottom: '3rem', animation: 'fade-in 0.5s ease-out', width: '100%', overflowX: 'auto', paddingBottom: '1rem' }}>

            {/* Energy Balance Chart */}
            <div className="glass-panel" style={{ flex: '1 0 350px', minWidth: '350px', padding: '1.5rem', position: 'relative', overflow: 'hidden' }}>
                <div style={{
                    position: 'absolute', top: '-50px', left: '-50px', width: '200px', height: '200px',
                    background: 'radial-gradient(circle, rgba(167, 139, 250, 0.15) 0%, rgba(0,0,0,0) 70%)', borderRadius: '50%'
                }}></div>
                <h3 style={{ marginBottom: '1.5rem', fontSize: '1.2rem', color: '#a78bfa', display: 'flex', alignItems: 'center', gap: '0.5rem', zIndex: 1, position: 'relative' }}>
                    ⚖️ Energy Balance (In vs Out)
                </h3>
                <div style={{ width: '100%', height: 350, zIndex: 1, position: 'relative' }}>
                    <ResponsiveContainer>
                        <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorCaloriesIn" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#a78bfa" stopOpacity={0.9} />
                                    <stop offset="100%" stopColor="#7c3aed" stopOpacity={0.6} />
                                </linearGradient>
                                <linearGradient id="colorCaloriesOut" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#f472b6" stopOpacity={0.9} />
                                    <stop offset="100%" stopColor="#db2777" stopOpacity={0.6} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" vertical={false} />
                            <XAxis dataKey="date" stroke="rgba(255,255,255,0.3)" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }} tickLine={false} axisLine={false} padding={{ left: 15, right: 15 }} />
                            <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }} tickLine={false} axisLine={false} />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
                            <Legend wrapperStyle={{ paddingTop: '10px' }} iconType="circle" />
                            <Bar dataKey="caloriesIn" name="Calories In (Food)" fill="url(#colorCaloriesIn)" radius={[6, 6, 0, 0]} barSize={25} />
                            <Bar dataKey="caloriesOut" name="Calories Out (Burned)" fill="url(#colorCaloriesOut)" radius={[6, 6, 0, 0]} barSize={25} />
                            <Line type="monotone" dataKey="caloriesIn" stroke="#c4b5fd" strokeWidth={0} activeDot={{ r: 0 }} legendType="none" tooltipType="none" />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Trend Area Chart for Burned Calories */}
            <div className="glass-panel" style={{ flex: '1 0 350px', minWidth: '350px', padding: '1.5rem', position: 'relative', overflow: 'hidden' }}>
                <div style={{
                    position: 'absolute', top: '-50px', right: '-50px', width: '150px', height: '150px',
                    background: 'radial-gradient(circle, rgba(129, 140, 248, 0.2) 0%, rgba(0,0,0,0) 70%)', borderRadius: '50%'
                }}></div>
                <h3 style={{ marginBottom: '1.5rem', fontSize: '1.2rem', color: '#818cf8', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    🔥 Burn Trend
                </h3>
                <div style={{ width: '100%', height: 260 }}>
                    <ResponsiveContainer>
                        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorCaloriesBurnedArea" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#818cf8" stopOpacity={0.6} />
                                    <stop offset="95%" stopColor="#818cf8" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" vertical={false} />
                            <XAxis dataKey="date" stroke="rgba(255,255,255,0.3)" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }} tickLine={false} axisLine={false} padding={{ left: 10, right: 10 }} />
                            <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }} tickLine={false} axisLine={false} />
                            <Tooltip content={<CustomTooltip />} />
                            <Area type="monotone" dataKey="caloriesOut" name="Active Burn" stroke="#818cf8" strokeWidth={3} fillOpacity={1} fill="url(#colorCaloriesBurnedArea)" activeDot={{ r: 6, strokeWidth: 0, fill: '#fff' }} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Duration Bar Chart */}
            <div className="glass-panel" style={{ flex: '1 0 350px', minWidth: '350px', padding: '1.5rem', position: 'relative', overflow: 'hidden' }}>
                <div style={{
                    position: 'absolute', top: '-50px', right: '-50px', width: '150px', height: '150px',
                    background: 'radial-gradient(circle, rgba(56, 189, 248, 0.2) 0%, rgba(0,0,0,0) 70%)', borderRadius: '50%'
                }}></div>
                <h3 style={{ marginBottom: '1.5rem', fontSize: '1.2rem', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    ⏱️ Active Duration
                </h3>
                <div style={{ width: '100%', height: 260 }}>
                    <ResponsiveContainer>
                        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorDuration" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#38bdf8" stopOpacity={1} />
                                    <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0.3} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" vertical={false} />
                            <XAxis dataKey="date" stroke="rgba(255,255,255,0.3)" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }} tickLine={false} axisLine={false} padding={{ left: 10, right: 10 }} />
                            <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }} tickLine={false} axisLine={false} />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
                            <Bar dataKey="duration" name="Duration" fill="url(#colorDuration)" radius={[6, 6, 0, 0]} barSize={20} animationDuration={1500} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

        </div>
    );
};

export default WorkoutChart;
