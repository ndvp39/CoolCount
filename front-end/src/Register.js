import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { auth } from './firebaseConfig'; // יבוא של הגדרת Firebase
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function registerUser(uid, email) {
    try {
      const response = await fetch('http://localhost:3000/api/users', {
        method: 'POST', // שיטת הבקשה
        headers: {
          'Content-Type': 'application/json', // סוג התוכן
        },
        body: JSON.stringify({ uid, email }), // המרת הנתונים ל-JSON
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
      console.log(data.message); // הדפסת הודעת הצלחה
    } catch (error) {
      console.error('Error registering user:', error);
    }
  }

  const handleBackToLogin = () => {
    navigate('/'); // הפניה חזרה לעמוד ההתחברות
  };

  const handleRegister = async (e) => {
    e.preventDefault();
  
    // בדיקה פשוטה: לוודא שכל השדות מלאים
    if (firstName && email && password) {
      setError('');
      try {
        // הרשמת המשתמש ב-Firebase
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const uid = userCredential.user.uid; // קבלת ה-UID של המשתמש
        await registerUser(uid, email); // שליחת UID ומייל לשרת
        alert('Registration successful!');
        navigate('/'); // הפניה לדף ההרשמה
      } catch (registrationError) {
        setError(registrationError.message); // הצגת שגיאת הרשמה
      }
    } else {
      setError('Please fill in all fields');
    }
  };
  

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card p-4 shadow-lg bg-dark text-white" style={{ borderRadius: '15px', border: '2px solid cyan' }}>
            <div className="card-body">
              <h1 className="text-center mb-4" style={{ color: 'cyan' }}>Register</h1>
              <form onSubmit={handleRegister}>
                <div className="form-group mb-3">
                  <label htmlFor="firstName" className="text-light">First Name</label>
                  <input
                    type="text"
                    className="form-control bg-secondary text-white"
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>
  
                <div className="form-group mb-3">
                  <label htmlFor="email" className="text-light">Email</label>
                  <input
                    type="email"
                    className="form-control bg-secondary text-white"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
  
                <div className="form-group mb-3">
                  <label htmlFor="password" className="text-light">Password</label>
                  <input
                    type="password"
                    className="form-control bg-secondary text-white"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
  
                {error && <p className="text-danger text-center mb-3">{error}</p>}
  
                <button type="submit" className="btn btn-outline-cyan w-100" style={{ color: 'cyan', borderColor: 'cyan' }}>
                  Register
                </button>
              </form>
              <button 
                onClick={handleBackToLogin} 
                className="btn btn-outline-cyan w-100" 
                style={{ color: 'cyan', borderColor: 'cyan' }}
              >
                Back to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
