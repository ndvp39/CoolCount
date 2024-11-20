import React, { useState } from 'react';
import './Notification';
import 'bootstrap/dist/css/bootstrap.min.css'; // ייבוא עיצובים של בוטסטראפ
import apiService from './apiService';
import { FaEnvelope, FaPlus } from 'react-icons/fa'; // ייבוא אייקונים מספריית react-icons
import { usePopup } from './PopupContext';



const ShoppingCart = ({ cart, setCart, user_email }) => {
    const [loading, setLoading] = useState(false); // state למעקב אחרי מצב טעינה
    const [editingName, setEditingName] = useState(null); // state למעקב אחרי המוצר שנערך
    const [newName, setNewName] = useState(''); // state לשם החדש של המוצר
    const { showPopup } = usePopup();

  
    // פונקציה להוספת או הורדת כמות פריטים בעגלת הקניות
    const handleQuantityChange = (drawer, action) => {
        const updatedCart = cart.map(item => {
            if (item.id === drawer.id) {
                if (action === 'increase') {
                    item.quantity += 1;
                } else if (action === 'decrease') {
                    item.quantity -= 1;
                    // אם הכמות שווה ל-0, נמחק את הפריט מהעגלה
                    if (item.quantity === 0) {
                        showPopup("Item has been removed from cart", "success","popup");
                        return null; // מחזיר null כדי להיפטר מהפריט

                    }
                }
            }
            return item;
        }).filter(item => item !== null); // מסנן את הערכים null, כלומר מסיר את הפריטים שאין להם כמות
    
        setCart(updatedCart);
    };
    

    const handleSendEmail = async () => {
        setLoading(true); // מתחילים טעינה
        try {
            await apiService.sendEmail(cart, user_email);
            setLoading(false); // סיימנו את שליחת המייל
            showPopup('cart sent to email!', 'success','popup');
        } catch (error) {
            console.error("Error sending email", error);
            setLoading(false); // אם קרתה טעות, מסיימים את מצב הטעינה
            showPopup('Error sending cart to email!', 'danger','popup');
        }
    };

    // פונקציה להוספת מוצר חדש לעגלת הקניות
    const handleAddNewProduct = () => {
        const newProduct = {
            id: cart.length + 1, // יצירת מזהה ייחודי חדש
            name: `New Product`, // שם זמני למוצר החדש
            quantity: 1
        };
        setCart([...cart, newProduct]); // הוספת המוצר החדש לעגלת הקניות
    };

    // פונקציה לעדכון שם המוצר
    const handleNameChange = (drawerId) => {
        const updatedCart = cart.map(item => {
            if (item.id === drawerId) {
                item.name = newName;
            }
            return item;
        });
        setCart(updatedCart);
        setEditingName(null); // מסיימים את מצב העריכה
        setNewName(''); // מאפסים את השם החדש
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
                                        <span onClick={() => { setEditingName(drawer.id); setNewName(drawer.name); }}>
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
                    {/* כפתור שליחת מייל או אנימציית טעינה */}
                    <button 
                        onClick={handleSendEmail} 
                        className="btn btn-primary mx-2 my-2"
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
                    <button 
                        onClick={handleAddNewProduct} 
                        className="btn btn-primary mx-2"
                    >
                        <FaPlus size={20} />
                    </button>
                </div>
            ) : (
                <p className="no-tabletin">Your cart is empty.</p>
            )}
        </div>
    );
};

export default ShoppingCart;
