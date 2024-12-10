import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import Login from './Login';
import Home from './Home';
import Register from './Register';
import RecipesList from './Recipes';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const uid = localStorage.getItem('uid-coolcount');
    if (uid) {
      setIsAuthenticated(true);
      const user_email = localStorage.getItem('email-coolcount');
      navigate('/home', { state: { uid, user_email } });
    }
  }, [navigate]);

  return (
      <Routes>
        <Route path="/" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/home" element={isAuthenticated ? <Home /> : <Login setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/recipes" element={isAuthenticated ? <RecipesList /> : <Login setIsAuthenticated={setIsAuthenticated} />} />
      </Routes>
  );
}

export default App;
