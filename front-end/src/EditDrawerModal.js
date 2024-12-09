import React from 'react';
import { useEffect, useState } from 'react';
import './Modal.css'; 
import { FaTimes, FaCalculator } from 'react-icons/fa'; // Import the close and calculator icons
import Help from "./Help";

// Modal component for editing drawer details
const EditDrawerModal = ({ drawerDetails, setDrawerDetails, onSave, onClose, onDelete }) => {
    
    const [showCalculatorPopup, setShowCalculatorPopup] = useState(false); // Tracks if the calculator popup is visible
    const [amount, setAmount] = useState(0); // Amount of items to calculate weight per item
    const [calculatedWeight, setCalculatedWeight] = useState(null); // Stores the calculated weight per item

    // Handles the deletion of the drawer
    const handleDelete = () => {
        const confirmDelete = window.confirm("Are you sure you want to delete this drawer?"); // Asks for confirmation
        if (confirmDelete) {
            onDelete(); // Calls the delete function passed as a prop
        }
    };

    // Calculates weight per item whenever `amount` or `drawerDetails.weight` changes
    useEffect(() => {
        if (amount > 0 && drawerDetails.weight > 0) {  // Ensures both values are valid
            const result = drawerDetails.weight / amount; // Calculates weight per item
            setCalculatedWeight(result); // Updates the state with the result
        } else {
            setCalculatedWeight(0);  // Resets the result if values are invalid
        }
    }, [amount, drawerDetails.weight]); // Dependencies that trigger the calculation


    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="close-button" onClick={onClose}>
                    <FaTimes className="close-icon" /> 
                </button>
                <form onSubmit={onSave}>
                    <div className="form-group">
                        <label htmlFor="drawerName">Drawer Name: 
                        <Help section="drawerName"  />
                        </label>
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
                        <label htmlFor="weightperitem">
                            Weight Per Item (kg):
                            <Help section="weightPerItem" />
                            <button
                                onClick={(e) => {
                                    e.preventDefault(); 
                                    setShowCalculatorPopup(true);
                                }}
                                style={{
                                    background: 'none',
                                    color: 'white',
                                    border: 'none',
                                    cursor: 'pointer',
                                    marginLeft: '8px',
                                }}
                            >
                                <FaCalculator size={20} />
                            </button>
                        </label>
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
                        <label htmlFor="weight">Weight:
                        <Help section="weight" />
                        </label>
                        <input
                            id="weight"
                            type="number"
                            value={drawerDetails.weight < 0 ? 0 : drawerDetails.weight} 
                            readOnly
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="quantity">Quantity:
                        <Help section="quantity" />
                        </label>
                        <input
                            id="quantity"
                            type="number"
                            placeholder="Enter quantity"
                            value={
                                drawerDetails.weight > 0 && drawerDetails.weightperitem > 0
                                    ? Math.floor(drawerDetails.weight / drawerDetails.weightperitem)
                                    : drawerDetails.quantity // השתמש בערך מהמשתמש אם המשקל הוא 0
                            }
                            onChange={(e) => {
                                if (drawerDetails.weight <= 0 || drawerDetails.weightperitem <= 0) {
                                    setDrawerDetails({ ...drawerDetails, quantity: parseInt(e.target.value) });
                                }
                            }}
                            readOnly={drawerDetails.weight > 0 && drawerDetails.weightperitem > 0} 
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="lastAddedDate">Date of Last Added Item:
                            <Help section="lastAddedDate" />
                        </label>
                        <input
                            className="custom-date-input"
                            id="lastAddedDate"
                            type="date"
                            value={(() => {
                                if (drawerDetails.lastAddedDate.includes(".")) {
                                    const [day, month, year] = drawerDetails.lastAddedDate.split(".");
                                    return `${year}-${month}-${day}`;
                                }
                                return drawerDetails.lastAddedDate;
                            })()}
                            onChange={(e) => {
                                const [year, month, day] = e.target.value.split("-");
                                const formattedDate = `${day}.${month}.${year}`;
                                setDrawerDetails({ ...drawerDetails, lastAddedDate: formattedDate });
                            }}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="alertLimit">Set Limit
                        <Help section="alertLimit" />
                        </label>
                        <input
                            id="alertLimit"
                            type="number"
                            placeholder="Enter limit for alert"
                            value={drawerDetails.alertLimit}
                            onChange={(e) => setDrawerDetails({ ...drawerDetails, alertLimit: e.target.value })}
                        />
                    </div>
                    <div className="modal-buttons">
                        <button type="submit" className="save-button me-2">Save</button>
                        <button type="button" className="delete-button" onClick={handleDelete}>Delete</button>
                    </div>
                </form>
            </div>

       {/* Calculator Popup */}
       {showCalculatorPopup && (
                <div className="modal-content">
                    <button
                        className="close-button"
                        onClick={() => setShowCalculatorPopup(false)}
                    >
                    <FaTimes size={20} color="white" />
                    </button>
                    <h3 style={{ color: 'white'}}>Calculate Weight Per Item</h3>
                    <div className="form-group my-3">
                    <label>Amount of Items:</label>                       
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => {
                                setAmount(parseInt(e.target.value));
                            }}
                            placeholder="Enter amount of items"
                        />
                    </div>
                    <div className="form-group">
                    <label>Drawer Weight (kg):</label>  
                        <input
                            type="number"
                            value={drawerDetails.weight} 
                            readOnly
                        />
                    </div>
                    <div className="">
                        {(calculatedWeight !== null && !isNaN(calculatedWeight)) && (
                            <p>Recommended Weight per Item: <br />{calculatedWeight.toFixed(2)} kg</p>
                        )}
                    </div>
                    <div className="d-flex justify-content-center">
                        <button 
                            onClick={() => setDrawerDetails({ ...drawerDetails, weightperitem: parseFloat(calculatedWeight.toFixed(2)) })} 
                            className="save-button"
                        >
                            Set
                        </button>
                    </div>



                </div>
            )}


        </div>
    );
};

export default EditDrawerModal;
