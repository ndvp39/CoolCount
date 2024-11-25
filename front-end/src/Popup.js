// Popup Component
// Displays a temporary popup notification with a message and close functionality.

import React, { useEffect, useState } from 'react';
import './Popup.css'; // CSS file for popup styling

function Popup({ message, type, onClose }) {
  const [isVisible, setIsVisible] = useState(true); // Tracks visibility of the popup

  // Automatically hides the popup after 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false); // Triggers the fade-out animation
      setTimeout(onClose, 500); // Calls the onClose callback after fade-out animation
    }, 2000);

    return () => clearTimeout(timer); // Cleans up the timer on unmount
  }, [onClose]);

  // Determines the CSS class based on the popup type and visibility
  const alertTypeClass = `alert alert-${type} alert-dismissible ${isVisible ? 'fade-in' : 'fade-out'}`;

  return (
    <div className={alertTypeClass} role="alert">
      {message} {/* Displays the message */}
      <button 
        type="button" 
        className="btn-close" 
        aria-label="Close" 
        onClick={() => { 
          setIsVisible(false); // Hides the popup on button click
          setTimeout(onClose, 500); // Calls the onClose callback after fade-out animation
        }}>
      </button>
    </div>
  );
}

export default Popup;