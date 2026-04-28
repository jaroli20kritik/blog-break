import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedToken = localStorage.getItem('restaurant_token');
        const savedUser = localStorage.getItem('restaurant_user');
        if (savedToken && savedUser) {
            setToken(savedToken);
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    const login = (tokenData, userData) => {
        setToken(tokenData);
        setUser(userData);
        localStorage.setItem('restaurant_token', tokenData);
        localStorage.setItem('restaurant_user', JSON.stringify(userData));
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('restaurant_token');
        localStorage.removeItem('restaurant_user');
    };

    const isOwner = user?.role === 'Owner';

    return (
        <AuthContext.Provider value={{ user, token, login, logout, isOwner, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be inside AuthProvider');
    return ctx;
};
