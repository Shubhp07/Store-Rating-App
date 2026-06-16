import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const ProtectedRoute = () => {
  const { token, loading } = useAuth();

  if (loading) return null; // You could replace this with a Spinner component later

  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
