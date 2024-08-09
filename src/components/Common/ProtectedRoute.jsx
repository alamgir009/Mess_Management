// components/Common/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children }) => {
  const userLog = useSelector((state) => state.userLogs.userLog);

  if (!userLog) {
    // If the user is not logged in, redirect to the login page
    return <Navigate to="/signin" replace />;
  }

  // If the user is logged in, render the protected component
  return children;
};

export default ProtectedRoute;
