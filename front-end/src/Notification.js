import React, { useState } from 'react';
import './Notification.css';
import './Modal.css'; // Import Modal styles
import { FaShoppingCart, FaQuestionCircle } from 'react-icons/fa';
import { usePopup } from './PopupContext';
import Help from "./Help";

const Notification = ({ drawers, addToCart }) => {
    const { showPopup } = usePopup();

    // Filters drawers with low stock
    const getLowWeightDrawers = () => {
        return drawers.filter(drawer => {
            const quantityFromWeight = drawer.getQuantity();
            if (quantityFromWeight > 0) {
                return quantityFromWeight <= drawer.alertLimit;
            }
            return drawer.quantity <= drawer.alertLimit;
        });
    };

    // Handles adding an item to the cart
    const handleAddToCart = (drawer) => {
        addToCart(drawer);
        showPopup("Item has been added to cart", "success", "popup");
    };

    return (
        <div className="tabletin-container">
            <div className="help-header d-flex justify-content-between align-items-center">
                <h3>Low Stock</h3>
                <Help section="LowStock" />
            </div>    
         
            {getLowWeightDrawers().length > 0 ? (
                <div>
                    <ul className="tabletin-list">
                        {getLowWeightDrawers().map(drawer => (
                            <li key={drawer.id} className="tabletin-item noti-item">
                                <span className="drawer-nameN">{drawer.name}</span>
                                <span className="drawer-quantityN">{(drawer.getQuantity() > 0 ? drawer.getQuantity() : drawer.quantity)}</span>
                                <button
                                    className="add-to-cart-btn"
                                    onClick={() => handleAddToCart(drawer)}
                                >
                                    <FaShoppingCart />
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <p className="no-tabletin">No Low-Stock</p>
            )}
        </div>
    );
};

export default Notification;
