import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectUserRole } from '../redux/slices/userSlice';

const RootRedirect = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const userRole = useSelector(selectUserRole);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const role = (userRole || '').toString().toLowerCase();
  if (role === 'admin') {
    return <Navigate to="/admin/home" replace />;
  }
  
  return <Navigate to="/user/home" replace />;
};

export default RootRedirect;