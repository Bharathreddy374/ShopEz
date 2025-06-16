import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const userType = localStorage.getItem('userType');

  if (!token || !allowedRoles.includes(userType)) {
    return <Navigate to="/auth" replace />;
  }

  return children;
};

export default ProtectedRoute;
