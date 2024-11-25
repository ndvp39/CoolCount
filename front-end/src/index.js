// This is the entry point of the React application

// Imports React and necessary libraries
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Global CSS for the app
import App from './App'; // Main application component
import { BrowserRouter } from 'react-router-dom'; // Enables routing for the app
import { PopupProvider } from './PopupContext'; // Provides context for popup notifications


// Renders the application into the root element in the DOM
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode> {/* Enforces best practices and highlights potential problems */}
    <BrowserRouter> {/* Wraps the application to enable routing */}
      <PopupProvider> {/* Wraps the application to provide popup context */}
        <App /> {/* Main component of the application */}
      </PopupProvider>
    </BrowserRouter>
  </React.StrictMode>
);

