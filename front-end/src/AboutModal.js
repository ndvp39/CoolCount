import React from 'react';
import './Modal.css';

const AboutModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="close-button" onClick={onClose}>
                    &times;
                </button>
                <h2>About CoolCount</h2>
                <p>
                    CoolCount is a smart fridge management app designed to help you effortlessly organize and track your refrigerator contents.
                </p>
                <ul>
                    <li><strong>Visual Display:</strong> Easily view your fridge divided into drawers, making organization simple and intuitive.</li>
                    <li><strong>Real-Time Updates:</strong> Stay informed with live weight tracking to monitor the quantities of items in your fridge.</li>
                    <li><strong>Alerts & Shopping Lists:</strong> Set alerts for low-stock items and manage your shopping list directly within the app.</li>
                    <li><strong>Recipe Suggestions:</strong> Discover recipes tailored to the ingredients currently available in your fridge.</li>
                </ul>
                <p>
                    CoolCount helps you save time, reduce waste, and keep your fridge organized and efficient.
                </p>

            </div>
        </div>
    );
};

export default AboutModal;
