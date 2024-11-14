import React, { useState } from 'react';
import './Notification';
import 'bootstrap/dist/css/bootstrap.min.css'; // ייבוא עיצובים של בוטסטראפ
import apiService from './apiService';
import { FaEnvelope } from 'react-icons/fa'; // ייבוא אייקון מייל מספריית react-icons

const ShoppingCart = ({ cart, setCart, user_email }) => {

    const [loading, setLoading] = useState(false); // state למעקב אחרי מצב טעינה

    // פונקציה להוספת או הורדת כמות פריטים בעגלת הקניות
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

    const handleSendEmail = async () => {
        setLoading(true); // מתחילים טעינה
        try {
            await apiService.sendEmail(cart, user_email);
            setLoading(false); // סיימנו את שליחת המייל
        } catch (error) {
            console.error("Error sending email", error);
            setLoading(false); // אם קרתה טעות, מסיימים את מצב הטעינה
        }
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
                                    {drawer.name}
                                </div>
                                <div className="quantity-controls">
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
                    {/* כפתור שליחת מייל או אנימציית טעינה */}
                    <button 
                        onClick={handleSendEmail} 
                        className="btn btn-primary"
                        disabled={loading} // לא ניתן ללחוץ אם הטעינה פעילה
                    >
                        {loading ? (
                            <div className="spinner-border spinner-border-sm" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        ) : (
                            <FaEnvelope size={20} />
                        )} 
                    </button>
                </div>
            ) : (
                <p>Your cart is empty.</p>
            )}
        </div>
    );
};

export default ShoppingCart;
