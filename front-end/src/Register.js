// Register Component
// Handles user registration using Firebase Authentication and sends user details to the server.

import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap for styling
import { auth } from './firebaseConfig'; // Firebase configuration
import { createUserWithEmailAndPassword } from 'firebase/auth'; // Firebase registration method
import { useNavigate } from 'react-router-dom'; // Navigation hook
import apiService from './apiService';

function Register() {
  const [firstName, setFirstName] = useState(''); // Tracks the first name input
  const [email, setEmail] = useState(''); // Tracks the email input
  const [password, setPassword] = useState(''); // Tracks the password input
  const [error, setError] = useState(''); // Tracks any registration errors
  const navigate = useNavigate(); // Navigation hook for redirecting

  // Redirects the user back to the login page
  const handleBackToLogin = () => {
    navigate('/'); // Redirects to the root login route
  };

  // Handles the registration process
  const handleRegister = async (e) => {
    e.preventDefault(); // Prevents form submission reload

    if (firstName && email && password) { // Checks if all fields are filled
      setError(''); // Clears any previous error messages
      try {
        // Registers the user using Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const uid = userCredential.user.uid; // Retrieves the UID from the registered user
        await apiService.registerUser(uid, email); // Sends UID and email to the server
        alert('Registration successful!');
        navigate('/'); // Redirects to the login page
      } catch (registrationError) {
        setError(registrationError.message); // Sets the registration error message
      }
    } else {
      setError('Please fill in all fields'); // Prompts the user to fill all fields
    }
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

                <button
                  type="submit"
                  className="btn btn-outline-cyan w-100"
                  style={{ color: 'cyan', borderColor: 'cyan' }}
                >
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
