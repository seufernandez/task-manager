import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '../hooks/useUser';

export const PrivateRoute = ({ element }) => {
  const { isAuthenticated } = useUser();

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  return <>{element}</>;
};