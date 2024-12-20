import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function PrivateRoute({ children, userType }) {
  const { auth } = useContext(AuthContext);

  // Check if user is authenticated and has the correct role
  if (!auth.token || auth.userType !== userType) {
    return <Navigate to="/login" />;
  }

  return children;
}

export default PrivateRoute;
