import React from 'react';
import './EditDrawerModal.css'; 
import { FaTimes } from 'react-icons/fa'; // Import the close icon

const EditDrawerModal = ({ drawerDetails, setDrawerDetails, onSave, onClose }) => {
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="close-button" onClick={onClose}>
                    <FaTimes className="close-icon" /> {/* Close icon */}
                </button>
                <form onSubmit={onSave}>
                    <div className="form-group">
                        <label htmlFor="drawerName">Drawer Name:</label>
                        <input
                            id="drawerName"
                            type="text"
                            placeholder="Enter drawer name"
                            value={drawerDetails.name}
                            onChange={(e) => setDrawerDetails({ ...drawerDetails, name: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="weight">Weight:</label>
                        <input
                            id="weight"
                            type="number"
                            placeholder="Enter weight"
                            value={drawerDetails.weight}
                            onChange={(e) => setDrawerDetails({ ...drawerDetails, weight: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="quantity">Quantity:</label>
                        <input
                            id="quantity"
                            type="number"
                            placeholder="Enter quantity"
                            value={drawerDetails.quantity}
                            onChange={(e) => setDrawerDetails({ ...drawerDetails, quantity: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="lastAddedDate">Date of Last Added Item:</label>
                        <input
                            id="lastAddedDate"
                            type="date"
                            value={drawerDetails.lastAddedDate}
                            onChange={(e) => setDrawerDetails({ ...drawerDetails, lastAddedDate: e.target.value })}
                            // Removed required attribute here
                        />
                    </div>
                    <div className="modal-buttons">
                        <button type="submit" className="save-button">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditDrawerModal;
