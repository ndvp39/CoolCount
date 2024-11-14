import React, { useEffect, useState } from 'react';
import './Popup.css'; // נוודא שזאת תיקיית ה-CSS שלך

function Popup({ message, type, onClose }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 500); // נותן זמן לאנימציה של סגירה
    }, 2000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const alertTypeClass = `alert alert-${type} alert-dismissible ${isVisible ? 'fade-in' : 'fade-out'}`;

  return (
    <div className={alertTypeClass} role="alert">
      {message}
      <button 
        type="button" 
        className="btn-close" 
        aria-label="Close" 
        onClick={() => { setIsVisible(false); setTimeout(onClose, 500); }}>
      </button>
    </div>
  );
}

export default Popup;
