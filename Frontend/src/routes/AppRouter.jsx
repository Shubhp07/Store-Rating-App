import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Auth Pages
import Login from '../pages/auth/Login';
import Signup from '../pages/auth/Signup';

// Admin Pages
import AdminDashboard from '../pages/admin/Dashboard';
import AdminUsers from '../pages/admin/Users';
import AdminStores from '../pages/admin/Stores';
import UserStores from '../pages/user/Stores';
import OwnerDashboard from '../pages/owner/Dashboard';
import ChangePassword from '../pages/auth/ChangePassword';

import ProtectedRoute from './ProtectedRoute';
import RoleRoute from './RoleRoute';
import MainLayout from '../components/common/MainLayout';
import { useAuth } from '../hooks/useAuth';

const AppRouter = () => {
  const { user } = useAuth();

  const defaultRoute = () => {
    if (!user) return '/login';
    if (user.role === 'admin') return '/admin/dashboard';
    if (user.role === 'store_owner') return '/owner/dashboard';
    return '/user/stores'; 
  };

  return (
    <Routes>
      <Route path="/" element={<Navigate to={defaultRoute()} replace />} />
      <Route path="/login" element={!user ? <Login /> : <Navigate to={defaultRoute()} replace />} />
      <Route path="/signup" element={!user ? <Signup /> : <Navigate to={defaultRoute()} replace />} />

      {/* Protected Routes wrapped in MainLayout */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/change-password" element={<ChangePassword />} />
          
          {/* Admin Routes */}
          <Route element={<RoleRoute allowedRoles={['admin']} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/stores" element={<AdminStores />} />
          </Route>

          {/* Normal User Routes */}
          <Route element={<RoleRoute allowedRoles={['user']} />}>
            <Route path="/user/stores" element={<UserStores />} />
          </Route>

          {/* Store Owner Routes */}
          <Route element={<RoleRoute allowedRoles={['store_owner']} />}>
            <Route path="/owner/dashboard" element={<OwnerDashboard />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRouter;
