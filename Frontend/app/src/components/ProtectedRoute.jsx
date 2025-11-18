import React from 'react';
import { Navigate } from 'react-router-dom';
import { getToken, getUser } from '../utils/auth';

const ProtectedRoute = ({ children, roles }) => {
  const token = getToken();
  const user = getUser();

  if (!token || !user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" />;
  return children;
};

export default ProtectedRoute;
