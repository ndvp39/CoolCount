// SettingsModal Component
// Displays a settings modal for linking Arduino, selecting a fridge, and logging out.

import React from 'react';
import { FaTimes } from 'react-icons/fa'; // Close icon
import './Modal.css'; // Reuses the CSS file from EditDrawerModal

const SettingsModal = ({
    isSettingsModalOpen, // Indicates if the modal is open
    toggleSettingsModal, // Toggles the visibility of the modal
    arduinoCode, // Arduino MAC address input value
    setArduinoCode, // Updates the Arduino MAC address input
    handleSendArduinoCode, // Links the Arduino MAC address
    fridgesList, // List of available fridges
    handleSelectFridge, // Handles fridge selection from the dropdown
    handleLogout // Logs out the user
}) => {
    if (!isSettingsModalOpen) return null; // Renders nothing if the modal is not open

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                {/* Close button to toggle the modal visibility */}
                <button className="close-button" onClick={toggleSettingsModal}>
                    <FaTimes className="close-icon" />
                </button>
                <h1 className="modal-title" style={{ color: 'white', textAlign: 'left' }}>
                    Settings
                </h1>
                
                {/* Arduino MAC address input field */}
                <div className="form-group my-3">
                    <label htmlFor="arduinoCode">Arduino MAC:</label>
                    <div className="d-flex align-items-center">
                        <input
                            type="text"
                            id="arduinoCode"
                            placeholder="Enter Arduino MAC"
                            value={arduinoCode}
                            onChange={(e) => setArduinoCode(e.target.value)}
                            className="form-control"
                        />
                        <button
                            onClick={handleSendArduinoCode} // Links the Arduino MAC address
                            className="save-button ms-2"
                        >
                            Link
                        </button>
                    </div>
                </div>

                {/* Dropdown for selecting a fridge */}
                <div className="form-group">
                    <label htmlFor="fridgesList">Select Fridge:</label>
                    <select
                        id="fridgesList"
                        onChange={handleSelectFridge} // Handles fridge selection
                        className="form-control"
                    >
                        {fridgesList.map((id) => (
                            <option key={id} value={id}>
                                Fridge {id}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Logout button */}
                <div className="form-group modal-buttons">
                    <button
                        onClick={handleLogout} // Logs out the user
                        className="delete-button"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;
