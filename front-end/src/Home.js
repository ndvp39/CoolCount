import React, { useState } from 'react';
import './Home.css';
import { FaLock, FaLockOpen } from 'react-icons/fa'; // Lock icons

function Home() {
  const [isOpen, setIsOpen] = useState(false); // State for fridge doors

  const toggleFridge = () => {
    setIsOpen(!isOpen); // Toggle fridge doors
  };

  return (
    <div className="home-container">
      <h1 className="fridge-title">My Fridge</h1>
      <div className={`fridge ${isOpen ? 'open' : 'closed'}`}>
        {/* Fridge lock icon at the top */}
        <div className="fridge-header">
          <button className="toggle-btn" onClick={toggleFridge}>
            {isOpen ? <FaLockOpen className="lock-icon" /> : <FaLock className="lock-icon" />}
          </button>
        </div>

        {/* Fridge doors */}
        <div className={`fridge-door-left ${isOpen ? 'open' : 'closed'}`}></div>
        <div className={`fridge-door-right ${isOpen ? 'open' : 'closed'}`}></div>

        {/* Fridge interior */}
        <div className={`fridge-interior ${isOpen ? 'visible' : 'hidden'}`}>


          {/* Drawers */}
          <div className="drawer-container">
            <div className="drawer">Drawer 1</div>
            <div className="drawer">Drawer 2</div>
            <div className="drawer">Drawer 3</div>
            <div className="drawer">Drawer 4</div>
          </div>
        </div>

        {/* Handle for opening the fridge (only when closed) */}
        {!isOpen && (
          <div className="fridge-handle" onClick={toggleFridge}></div>
        )}
      </div>
    </div>
  );
}

export default Home;
