import React, { createContext, useContext, useState } from 'react';
import ReactDOM from 'react-dom';
import Popup from './Popup';

const PopupContext = createContext();

export function usePopup() {
  return useContext(PopupContext);
}

export function PopupProvider({ children }) {
  const [popup, setPopup] = useState(null);
  const [popupTarget, setPopupTarget] = useState(null); // יעד להצגת הפופאפ

  const showPopup = (message, type, targetId = null) => {
    setPopup({ message, type });
    setPopupTarget(targetId); // שמירת היעד להצגת הפופאפ
  };

  const hidePopup = () => {
    setPopup(null);
    setPopupTarget(null); // איפוס היעד
  };

  return (
    <PopupContext.Provider value={{ showPopup, hidePopup }}>
      {children}
      {popup && (
        popupTarget
          ? ReactDOM.createPortal(
              <Popup 
                message={popup.message} 
                type={popup.type} 
                onClose={hidePopup} 
              />,
              document.getElementById(popupTarget) // הצגת הפופאפ ביעד המיועד
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
