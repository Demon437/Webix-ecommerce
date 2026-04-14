import React, { createContext, useState, useContext, useEffect } from 'react';
import { base44 } from '@/api/base44Client';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [authError, setAuthError] = useState(null);

    useEffect(() => {
        // Check if user is already logged in from localStorage
        const checkAuth = async () => {
            console.log('🔄 Starting auth check...');
            try {
                const currentUser = await base44.auth.me();
                console.log('📦 Auth response:', currentUser);
                if (currentUser) {
                    // Ensure role field exists, default to 'user' if missing
                    const userData = {
                        ...currentUser,
                        role: currentUser.role || 'user'
                    };
                    console.log('✅ Auth check successful. User data:', userData);
                    setUser(userData);
                    setIsAuthenticated(true);
                } else {
                    console.log('❌ No user data from auth check');
                    setIsAuthenticated(false);
                }
            } catch (error) {
                console.error('❌ Auth check failed:', error.message);
                setIsAuthenticated(false);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, []);

    const login = async (email, password) => {
        try {
            const loggedInUser = await base44.auth.login(email, password);
            const userData = {
                ...loggedInUser,
                role: loggedInUser.role || 'user'
            };
            setUser(userData);
            setIsAuthenticated(true);
            console.log('✅ Login successful:', userData);
            return userData;
        } catch (error) {
            throw error;
        }
    };

    const register = async (email, password, name) => {
        try {
            const newUser = await base44.auth.register(email, password, name);
            const userData = {
                ...newUser,
                role: newUser.role || 'user'
            };
            setUser(userData);
            setIsAuthenticated(true);
            return userData;
        } catch (error) {
            throw error;
        }
    };

    const logout = async () => {
        try {
            await base44.auth.logout();
            setUser(null);
            setIsAuthenticated(false);
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const navigateToLogin = () => {
        setUser(null);
        setIsAuthenticated(false);
        window.location.href = '/login';
    };

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated,
            isLoading,
            isLoadingAuth: isLoading,
            isLoadingPublicSettings: false,
            authError,
            login,
            register,
            logout,
            navigateToLogin
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};
