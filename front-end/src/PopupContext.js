// PopupContext.js
// Provides a context for managing and displaying popups globally in the application.

import React, { createContext, useContext, useState } from 'react';
import ReactDOM from 'react-dom';
import Popup from './Popup'; // Popup component

// Create a Context for popup management
const PopupContext = createContext();

// Custom hook to access the PopupContext
export function usePopup() {
  return useContext(PopupContext); // Returns the context value (showPopup, hidePopup)
}

// Provider component to manage popup state and provide context to the app
export function PopupProvider({ children }) {
  const [popup, setPopup] = useState(null); // Tracks the current popup state
  const [popupTarget, setPopupTarget] = useState(null); // Tracks the target DOM element for popup display

  // Displays a popup with a message and type, optionally targeting a specific DOM element
  const showPopup = (message, type, targetId = null) => {
    setPopup({ message, type }); // Sets the popup state
    setPopupTarget(targetId); // Sets the target for the popup
  };

  // Hides the currently displayed popup
  const hidePopup = () => {
    setPopup(null); // Resets the popup state
    setPopupTarget(null); // Resets the target
  };

  return (
    <PopupContext.Provider value={{ showPopup, hidePopup }}>
      {children}
      {popup && (
        popupTarget // Checks if a target is specified
          ? ReactDOM.createPortal(
              <Popup 
                message={popup.message} 
                type={popup.type} 
                onClose={hidePopup} 
              />,
              document.getElementById(popupTarget) // Displays the popup in the specified DOM element
            )
          : (
            <Popup 
              message={popup.message} 
              type={popup.type} 
              onClose={hidePopup} 
            />
          )
      )}
    </PopupContext.Provider>
  );
}
