import React, { createContext, useContext, useState } from 'react';
import Popup from './Popup';

const PopupContext = createContext();

export function usePopup() {
  return useContext(PopupContext);
}

export function PopupProvider({ children }) {
  const [popup, setPopup] = useState(null);

  const showPopup = (message, type) => {
    setPopup({ message, type });
  };

  const hidePopup = () => {
    setPopup(null);
  };

  return (
    <PopupContext.Provider value={{ showPopup, hidePopup }}>
      {children}
      {popup && (
        <Popup 
          message={popup.message} 
          type={popup.type} 
          onClose={hidePopup} 
        />
      )}
    </PopupContext.Provider>
  );
}
