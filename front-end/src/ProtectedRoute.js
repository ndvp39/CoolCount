import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ isAuthenticated, children }) {
  if (!isAuthenticated) {
    // אם המשתמש לא מחובר, מפנה אותו למסך ההתחברות
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
