// Login Component
// Handles user authentication and navigation to home page upon successful login.

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Enables navigation between routes
import 'bootstrap/dist/css/bootstrap.min.css'; // Importing Bootstrap for styling
import { auth } from './firebaseConfig'; // Import Firebase configuration
import { signInWithEmailAndPassword } from 'firebase/auth'; // Firebase authentication methods

function Login({ setIsAuthenticated }) {
  // State management for email, password, and error messages
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Hook for navigation

  // Handles the login process
  const handleLogin = async (e) => {
    e.preventDefault(); // Prevents default form submission
    setError(''); // Resets the error message

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password); // Signs in the user
      const user = userCredential.user; // Retrieves user details
      const uid = user.uid; // User ID
      const user_email = user.email; // User email
      
      localStorage.setItem('uid-coolcount', uid); // Stores user ID in local storage
      localStorage.setItem('email-coolcount', user_email); // Stores user ID in local storage
      setIsAuthenticated(true); // Sets the authentication state to true
      
      navigate('/home', { state: { uid, user_email } }); // Navigates to the home page with user details in state
    } catch (error) {
      console.error('Error during login:', error); // Logs the error to the console
      setError('Invalid email or password'); // Displays an error message to the user
    }
  };

  // Redirects the user to the registration page
  const handleRegisterRedirect = () => {
    navigate('/register');
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div
            className="card p-4 shadow-lg bg-dark text-white"
            style={{ borderRadius: '15px', border: '2px solid cyan' }}
          >
            <div className="card-body">
              <h1 className="text-center mb-4" style={{ color: 'cyan' }}>Login</h1>
              <form onSubmit={handleLogin}>
                <div className="form-group mb-3">
                  <label htmlFor="email" className="text-light">Email</label>
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

                <button
                  type="submit"
                  className="btn btn-outline-cyan w-100 mb-3"
                  style={{ color: 'cyan', borderColor: 'cyan' }}
                >
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
