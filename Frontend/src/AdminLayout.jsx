import React, { useEffect } from 'react';
import { useAuth } from './lib/AuthContext';
import { Navigate } from 'react-router-dom';

const AdminLayout = ({ children, currentPageName }) => {
    const { user, isLoading, isAuthenticated } = useAuth();

    // Check if current page is admin page
    const isAdminPage = currentPageName?.includes('Admin');

    // Debug logs (optional but useful)
    useEffect(() => {
        if (isAdminPage) {
            console.log('🔍 ADMIN PAGE ACCESS CHECK:');
            console.log('  - isLoading:', isLoading);
            console.log('  - isAuthenticated:', isAuthenticated);
            console.log('  - user:', user);
            console.log('  - role:', user?.role);
            console.log('  - isAdmin:', user?.role === 'admin');
        }
    }, [isLoading, user, isAuthenticated, isAdminPage]);

    // 🔄 1. Loading State
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p>Checking access...</p>
                </div>
            </div>
        );
    }

    // 🚫 2. Block Non-Admin Access (MAIN FIX)
    if (isAdminPage && (!isAuthenticated || !user || user.role !== 'admin')) {
        console.warn('❌ Access Denied: Non-admin tried to access admin page');

        return <Navigate to="/" replace />;
        // OR use below if you want login redirect:
        // return <Navigate to="/login" replace />;
    }

    // ✅ 3. Allow Admin Pages
    if (isAdminPage) {
        return <>{children}</>;
    }

    // ✅ 4. Normal Pages
    return <>{children}</>;
};

export default AdminLayout;