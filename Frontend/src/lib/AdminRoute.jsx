import React, { useContext } from 'react';
import { AuthContext } from './AuthContext';
import { useNavigate } from 'react-router-dom';

/**
 * AdminRoute Component
 * Protects admin pages by checking user role
 * Redirects to login if user is not an admin
 */
export const AdminRoute = ({ children }) => {
    const { user, isLoading } = useContext(AuthContext);
    const navigate = useNavigate();

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p>Loading...</p>
                </div>
            </div>
        );
    }

    // Check if user is authenticated and is admin
    if (!user || user.role !== 'admin') {
        // Redirect to login
        navigate('/login');
        return null;
    }

    // User is admin, render the component
    return children;
};

export default AdminRoute;
