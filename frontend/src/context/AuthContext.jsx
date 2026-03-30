import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUser = async () => {
            const token = localStorage.getItem("token") || sessionStorage.getItem("token");
            if (token) {
                try {
                    const { data } = await api.get("/users/me");
                    setUser(data);
                } catch (error) {
                    console.error("Auth check failed", error);
                    localStorage.removeItem("token");
                    sessionStorage.removeItem("token");
                }
            }
            setLoading(false);
        };
        checkUser();
    }, []);

    const login = async (email, password, rememberMe = false) => {
        const formData = new FormData();
        formData.append("username", email);
        formData.append("password", password);

        const { data } = await api.post("/auth/login", formData);

        if (rememberMe) {
            localStorage.setItem("token", data.access_token);
            sessionStorage.removeItem("token");
        } else {
            sessionStorage.setItem("token", data.access_token);
            localStorage.removeItem("token");
        }

        // Fetch user details immediately after login
        const userRes = await api.get("/users/me");
        setUser(userRes.data);
    };

    const register = async (email, password) => {
        await api.post("/auth/register", { email, password });
        // After register, auto login
        await login(email, password);
    };

    const updateProfile = async (profileData) => {
        const { data } = await api.put("/users/me", profileData);
        setUser(data);
    };

    const logout = () => {
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
        setUser(null);
    };

    const deleteAccount = async () => {
        try {
            await api.delete("/users/me");
            logout();
        } catch (error) {
            console.error("Failed to delete account", error);
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, deleteAccount, loading, updateProfile }}>
            {children}
        </AuthContext.Provider>
    );
};
