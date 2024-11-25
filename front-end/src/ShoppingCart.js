// ShoppingCart Component
// Displays and manages the shopping cart, allowing quantity updates, adding new items, and sending the cart via email.

import React, { useState } from 'react';
import './Notification'; // Notification-related styling (if applicable)
import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap styling
import apiService from './apiService'; // API service for email sending
import { FaEnvelope, FaPlus } from 'react-icons/fa'; // Icons for email and adding items
import { usePopup } from './PopupContext'; // Popup notifications

const ShoppingCart = ({ cart, setCart, user_email }) => {
    const [loading, setLoading] = useState(false); // Loading state for email sending
    const [editingName, setEditingName] = useState(null); // Tracks which item's name is being edited
    const [newName, setNewName] = useState(''); // Stores the new name for an item
    const { showPopup } = usePopup(); // Accesses popup functions

    // Handles increasing or decreasing the quantity of an item
    const handleQuantityChange = (drawer, action) => {
        const updatedCart = cart
            .map(item => {
                if (item.id === drawer.id) {
                    if (action === 'increase') {
                        item.quantity += 1; // Increases quantity
                    } else if (action === 'decrease') {
                        item.quantity -= 1; // Decreases quantity
                        if (item.quantity === 0) {
                            showPopup("Item has been removed from cart", "success", "popup");
                            return null; // Removes item if quantity is zero
                        }
                    }
                }
                return item;
            })
            .filter(item => item !== null); // Filters out null values (removed items)

        setCart(updatedCart);
    };

    // Sends the cart via email
    const handleSendEmail = async () => {
        setLoading(true); // Starts loading
        try {
            await apiService.sendEmail(cart, user_email); // Sends email via API
            setLoading(false); // Ends loading
            showPopup('Cart sent to email!', 'success', 'popup');
        } catch (error) {
            console.error("Error sending email", error);
            setLoading(false); // Ends loading on error
            showPopup('Error sending cart to email!', 'danger', 'popup');
        }
    };

    // Adds a new product to the cart
    const handleAddNewProduct = () => {
        const newProduct = {
            id: cart.length + 1, // Unique ID for the new item
            name: `New Product`, // Default name for the new product
            quantity: 1, // Initial quantity
        };
        setCart([...cart, newProduct]); // Updates the cart with the new item
    };

    // Updates the name of an item
    const handleNameChange = (drawerId) => {
        const updatedCart = cart.map(item => {
            if (item.id === drawerId) {
                item.name = newName; // Updates the name
            }
            return item;
        });
        setCart(updatedCart);
        setEditingName(null); // Exits edit mode
        setNewName(''); // Resets the new name input
    };

    return (
        <div className="tabletin-container">
            <h3>Shopping Cart</h3>
            {cart.length > 0 ? (
                <div>
                    <ul className="tabletin-list">
                        {cart.map(drawer => (
                            <li key={drawer.id} className="tabletin-item">
                                <div className="drawer-name">
                                    {editingName === drawer.id ? (
                                        <input
                                            type="text"
                                            value={newName}
                                            onChange={(e) => setNewName(e.target.value)}
                                            onBlur={() => handleNameChange(drawer.id)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleNameChange(drawer.id)}
                                            autoFocus
                                        />
                                    ) : (
                                        <span
                                            onClick={() => {
                                                setEditingName(drawer.id); 
                                                setNewName(drawer.name); 
                                            }}
                                        >
                                            {drawer.name}
                                        </span>
                                    )}
                                </div>
                                <div className="quantity-controls mx-2">
                                    <button
                                        className="quantity-btn"
                                        onClick={() => handleQuantityChange(drawer, 'decrease')}
                                    >
                                        -
                                    </button>
                                    <span className="drawer-name mx-3">{drawer.quantity}</span>
                                    <button
                                        className="quantity-btn"
                                        onClick={() => handleQuantityChange(drawer, 'increase')}
                                    >
                                        +
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                    {/* Email send button or loading spinner */}
                    <button
                        onClick={handleSendEmail}
                        className="btn btn-primary mx-2 my-2"
                        disabled={loading} // Disables button during loading
                    >
                        {loading ? (
                            <div className="spinner-border spinner-border-sm" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        ) : (
                            <FaEnvelope size={20} />
                        )}
                    </button>
                    {/* Add new product button */}
                    <button 
                        onClick={handleAddNewProduct} 
                        className="btn btn-primary mx-2"
                    >
                        <FaPlus size={20} />
                    </button>
                </div>
            ) : (
                <p className="no-tabletin">Your cart is empty.</p> // Message if cart is empty
            )}
        </div>
    );
};

export default ShoppingCart;
