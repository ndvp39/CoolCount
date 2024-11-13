import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { auth } from './firebaseConfig'; // יבוא של הגדרת Firebase
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import './Login.css';
import apiService from './apiService';

function Login({ setIsAuthenticated }) {
  const [email, setEmail] = useState(''); // שדה דוא"ל במקום שם משתמש
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); // איפוס הודעת שגיאה
  
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user; // קבלת פרטי המשתמש
      const uid = user.uid; // קבלת ה-uid
      const user_email = user.email;

      console.log(uid)
      localStorage.setItem('uid-coolcount', user.uid);
      setIsAuthenticated(true); // קובע שהמשתמש מחובר
      alert('Login successful!');
      
      navigate('/home', { state: { uid, user_email } }); // הפניה ל-HOME עם ה-uid בתוך state
    } catch (error) {
      console.error('Error during login:', error); // הדפסת השגיאה
      setError('Invalid email or password'); // הצגת שגיאה מתאימה
    }
  };
  
  

  const handleRegisterRedirect = () => {
    navigate('/register'); // הפניה לדף ההרשמה
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card p-4 shadow-lg bg-dark text-white" style={{ borderRadius: '15px', border: '2px solid cyan' }}>
            <div className="card-body">
              <h1 className="text-center mb-4" style={{ color: 'cyan' }}>Login</h1>
              <form onSubmit={handleLogin}>
                <div className="form-group mb-3">
                  <label htmlFor="email" className="text-light">Email</label> {/* שונה לשדה דוא"ל */}
                  <input
                    type="email"
                    id="email"
                    className="form-control bg-secondary text-white"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
  
                <div className="form-group mb-3">
                  <label htmlFor="password" className="text-light">Password</label>
                  <input
                    type="password"
                    id="password"
                    className="form-control bg-secondary text-white"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
  
                {error && <p className="text-danger text-center mb-3">{error}</p>}
  
                <button type="submit" className="btn btn-outline-cyan w-100 mb-3" style={{ color: 'cyan', borderColor: 'cyan' }}>
                  Login
                </button>
  
                <button
                  type="button"
                  className="btn btn-link text-light w-100 text-center"
                  onClick={handleRegisterRedirect}
                >
                  Don't have an account? Register here
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
