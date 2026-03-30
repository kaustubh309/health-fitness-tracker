import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Settings from './pages/Settings';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import NutritionTracker from './pages/NutritionTracker';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AboutApp from './pages/AboutApp';
import ExerciseSuggestions from './pages/ExerciseSuggestions';
import ExerciseTutorials from './pages/ExerciseTutorials';
import SplashScreen from './pages/SplashScreen';
import ChartsPage from './pages/ChartsPage';

const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) return <SplashScreen />;

    return user ? children : <Navigate to="/login" />;
};

const AppContent = () => {
    const { loading } = useAuth();
    const [showSplash, setShowSplash] = React.useState(true);

    React.useEffect(() => {
        const timer = setTimeout(() => {
            setShowSplash(false);
        }, 6000); // Wait 6 seconds
        return () => clearTimeout(timer);
    }, []);

    if (loading || showSplash) {
        return <SplashScreen />;
    }

    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route
                path="/"
                element={
                    <PrivateRoute>
                        <Dashboard />
                    </PrivateRoute>
                }
            />
            <Route
                path="/profile"
                element={
                    <PrivateRoute>
                        <Profile />
                    </PrivateRoute>
                }
            />
            <Route
                path="/settings"
                element={
                    <PrivateRoute>
                        <Settings />
                    </PrivateRoute>
                }
            />
            <Route
                path="/nutrition"
                element={
                    <PrivateRoute>
                        <NutritionTracker />
                    </PrivateRoute>
                }
            />
            <Route
                path="/about"
                element={
                    <PrivateRoute>
                        <AboutApp />
                    </PrivateRoute>
                }
            />
            <Route
                path="/exercises"
                element={
                    <PrivateRoute>
                        <ExerciseSuggestions />
                    </PrivateRoute>
                }
            />
            <Route
                path="/exercises/:muscleGroup"
                element={
                    <PrivateRoute>
                        <ExerciseTutorials />
                    </PrivateRoute>
                }
            />
            <Route
                path="/analytics"
                element={
                    <PrivateRoute>
                        <ChartsPage />
                    </PrivateRoute>
                }
            />
        </Routes>
    );
};

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <AppContent />
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;
