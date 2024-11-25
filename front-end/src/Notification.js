// Notification Component
// Displays drawers with low stock and allows adding them to the shopping cart.

import React from 'react';
import './Notification.css'; 
import { FaShoppingCart } from 'react-icons/fa'; // Shopping cart icon
import { usePopup } from './PopupContext'; // Popup notification context

const Notification = ({ drawers, addToCart }) => {
    const { showPopup } = usePopup(); // Accesses the popup function from context
  
    // Filters drawers to find those with quantities below or equal to the alert limit
    const getLowWeightDrawers = () => {
        return drawers.filter(drawer => drawer.getQuantity() <= drawer.alertLimit);
    };

    // Handles adding a drawer item to the shopping cart and shows a popup
    const handleAddToCart = (drawer) => {
        addToCart(drawer); // Adds the drawer to the cart
        showPopup("Item has been added to cart", "success", "popup"); // Shows a success popup
    };
    
    return (
        <div className="tabletin-container">
            {getLowWeightDrawers().length > 0 ? ( // Checks if there are low stock drawers
                <div>
                    <h3>Low Stock</h3>
                    <ul className="tabletin-list">
                        {getLowWeightDrawers().map(drawer => ( // Iterates through low stock drawers
                            <li key={drawer.id} className="tabletin-item noti-item">
                                <span className="drawer-name">{drawer.name}</span> {/* Drawer name */}
                                <span className="drawer-quantity">{drawer.getQuantity()}</span> {/* Drawer quantity */}
                                <button 
                                    className="add-to-cart-btn" 
                                    onClick={() => handleAddToCart(drawer)} // Adds item to cart
                                >
                                    <FaShoppingCart /> {/* Shopping cart icon */}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <p className="no-tabletin">No Notifications</p> // Message if no low stock drawers
            )}
        </div>
    );
};

export default Notification;
