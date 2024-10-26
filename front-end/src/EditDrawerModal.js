import React from 'react';
import './EditDrawerModal.css'; 
import { FaTimes } from 'react-icons/fa'; // Import the close icon

const EditDrawerModal = ({ drawerDetails, setDrawerDetails, onSave, onClose , onDelete}) => {
    const handleDelete = () => {
        const confirmDelete = window.confirm("Are you sure you want to delete this drawer?");
        if (confirmDelete) {
            onDelete(); // Call the delete function passed as a prop
        }
    };
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
                        <label htmlFor="weightperitem">Weight Per Item (kg):</label>
                        <input
                            id="weightperitem"
                            type="number"
                            placeholder="Enter Weight Per Item (kg)"
                            value={drawerDetails.weightperitem}
                            onChange={(e) => setDrawerDetails({ ...drawerDetails, weightperitem: parseFloat(e.target.value) })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="weight">Weight:</label>
                        <input
                            id="weight"
                            type="number"
                            value={drawerDetails.weight}
                            readOnly
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="quantity">Quantity:</label>
                        <input
                            id="quantity"
                            type="number"
                            value={Math.floor(drawerDetails.weight / drawerDetails.weightperitem)}
                            readOnly
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="lastAddedDate">Date of Last Added Item:</label>
                        <input
                            id="lastAddedDate"
                            type="date"
                            value={drawerDetails.lastAddedDate}
                            onChange={(e) => setDrawerDetails({ ...drawerDetails, lastAddedDate: e.target.value })}
                            
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="alertLimit">Set Alert</label>
                        <input
                            id="alertLimit"
                            type="number"
                            placeholder="Enter limit for alert"
                            value={drawerDetails.alertLimit}
                            onChange={(e) => setDrawerDetails({ ...drawerDetails, alertLimit: e.target.value })}
                        />
                    </div>
                    <div className="modal-buttons">
                        <button type="submit" className="save-button">Save</button>
                        <button type="button" className="delete-button" onClick={handleDelete}>Delete</button>
                    </div>


                </form>
            </div>
        </div>
    );
};

export default EditDrawerModal;
