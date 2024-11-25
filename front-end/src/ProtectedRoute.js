// ProtectedRoute Component
// Ensures that only authenticated users can access certain routes.

import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ isAuthenticated, children }) {
  // If the user is not authenticated, redirect to the login page
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // If the user is authenticated, render the child components
  return children;
}

export default ProtectedRoute;
