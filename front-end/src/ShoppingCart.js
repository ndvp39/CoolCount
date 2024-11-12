import React from 'react';
import './ShoppingCart.css'; // קובץ CSS עבור עיצוב עגלת הקניות

const ShoppingCart = ({ cart, setCart }) => {

    // פונקציה להוסיף פריט לעגלת הקניות
    const handleQuantityChange = (drawer, action) => {
        const updatedCart = cart.map(item => {
            if (item.id === drawer.id) {
                if (action === 'increase') {
                    item.quantity += 1;
                } else if (action === 'decrease' && item.quantity > 1) {
                    item.quantity -= 1;
                }
            }
            return item;
        });
        setCart(updatedCart);
    };

    return (
        <div className="shopping-cart-container">
            <h3>Shopping Cart</h3>
            {cart.length > 0 ? (
                <ul className="shopping-cart-list">
                    {cart.map(drawer => (
                        <li key={drawer.id} className="cart-item">
                            <span className="item-name">{drawer.name}</span>
                            <div className="quantity-controls">
                                <button 
                                    className="quantity-btn" 
                                    onClick={() => handleQuantityChange(drawer, 'decrease')}
                                >
                                    -
                                </button>
                                <span className="item-quantity">{drawer.quantity}</span>
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
            ) : (
                <p>Your cart is empty.</p>
            )}
        </div>
    );
};

export default ShoppingCart;
