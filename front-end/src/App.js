import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// index.js או App.js
import 'bootstrap/dist/css/bootstrap.min.css';

import Login from './Login';
import Home from './Home';
import Register from './Register'; // ייבוא של דף ההרשמה

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/home" element={isAuthenticated ? <Home /> : <Login />} />
          <Route path="/register" element={<Register />} /> {/* נתיב ההרשמה */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
