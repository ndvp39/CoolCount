import React, { useState } from "react";
import { FaQuestionCircle } from "react-icons/fa";
import "./Modal.css"; // CSS for modal styling
import './Notification.css';

// Object containing all the help texts
const helpTexts = {
    shoppingCart: "This tab allows you to manage your cart. You can increase/decrease quantities, add new items, or email your cart.",
    lastUpdated: "This tab shows the last update for each drawer in your fridge, including the date of the most recent change.",
    LowStock: "This tab shows items in your fridge that are running low. You can add them to your shopping list.",
    drawerName: "Enter the name of the drawer. This helps identify it in your fridge.",
    weightPerItem: "Enter the average weight of a single item in this drawer. You can use the calculator to compute this value if needed.",
    weight: "The current total weight of items in the drawer (read-only).",
    quantity: "The estimated number of items based on the weight and weight per item.",
    lastAddedDate: "The date when the most recent item was added to this drawer.",
    alertLimit: "Set a limit to get notified when the quantity falls below this number.",
    default: "No explanation available for this section.",
};

// Help component
const Help = ({ section }) => {
    const [isHelpVisible, setIsHelpVisible] = useState(false);

    // Toggle the visibility of the help modal
    const toggleHelp = () => {
        setIsHelpVisible(!isHelpVisible);
    };

    // Get the help text for the given section
    const helpText = helpTexts[section] || helpTexts.default;

    return (
        <>
            <FaQuestionCircle
                className="help-icon"
                onClick={toggleHelp}
                title="Click for more info"
            />
            {isHelpVisible && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <button className="close-button" onClick={toggleHelp}>
                            &times;
                        </button>
                        <p>{helpText}</p>
                    </div>
                </div>
            )}
        </>
    );
};

export default Help;
