import React from 'react';
import { FaTimes } from 'react-icons/fa'; // ייבוא אייקון הסגירה
import './Modal.css'; // שימוש באותו CSS כמו EditDrawerModal

const SettingsModal = ({
    isSettingsModalOpen,
    toggleSettingsModal,
    arduinoCode,
    setArduinoCode,
    handleSendArduinoCode,
    fridgesList,
    handleSelectFridge,
    handleLogout
}) => {
    if (!isSettingsModalOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="close-button" onClick={toggleSettingsModal}>
                    <FaTimes className="close-icon" />
                </button>
                <h1 className="modal-title" style={{ color: 'white', textAlign: 'left' }}>
                    Settings
                </h1>
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
                            onClick={handleSendArduinoCode}
                            className="save-button ms-2"
                        >
                            Link
                        </button>
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="fridgesList">Select Fridge:</label>
                    <select
                        id="fridgesList"
                        onChange={handleSelectFridge}
                        className="form-control"
                    >
                        {fridgesList.map((id) => (
                            <option key={id} value={id}>
                                Fridge {id}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-group modal-buttons">
                    <button
                        onClick={handleLogout}
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
