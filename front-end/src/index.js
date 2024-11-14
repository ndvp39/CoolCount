import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom'; // ייבוא BrowserRouter
import { PopupProvider } from './PopupContext'; // ייבוא PopupProvider

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter> {/* עטוף את App ב-BrowserRouter */}
      <PopupProvider> {/* עטוף את כל האפליקציה ב-PopupProvider */}
        <App />
      </PopupProvider>
    </BrowserRouter>
  </React.StrictMode>
);
