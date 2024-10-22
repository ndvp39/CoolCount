import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import Login from './Login';
import Home from './Home';
import Register from './Register';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // בדיקה אם יש uid ב-localStorage
    const uid = localStorage.getItem('uid-coolcount');
    if (uid) {
      setIsAuthenticated(true);
      // נווט אוטומטית למסך הבית עם ה-uid
      navigate('/home', { state: { uid } });
    }
  }, [navigate]);

  return (
    <Routes>
      <Route path="/" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
      <Route path="/home" element={isAuthenticated ? <Home /> : <Login setIsAuthenticated={setIsAuthenticated} />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}

export default App;
