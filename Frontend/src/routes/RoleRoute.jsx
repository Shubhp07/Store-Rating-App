import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const RoleRoute = ({ allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (!user || !allowedRoles.includes(user.role)) {
    // Redirect users to their specific dashboard if they try to access unauthorized pages
    if (user) {
        if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
        if (user.role === 'store_owner') return <Navigate to="/owner/dashboard" replace />;
        return <Navigate to="/user/stores" replace />;
    }
    return <Navigate to="/login" replace />; 
  }

  return <Outlet />;
};

export default RoleRoute;
