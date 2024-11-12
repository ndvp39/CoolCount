import React from 'react';
import './Notification.css'; 
import { FaShoppingCart } from 'react-icons/fa'; // אייקון של עגלת קניות

const Notification = ({ drawers,addToCart  }) => {
    const getLowWeightDrawers = () => {
        return drawers.filter(drawer => drawer.getQuantity() <= drawer.alertLimit,
    );
    };

    const handleAddToCart = (drawer) => {
        addToCart(drawer); // פונקציה שמוסיפה את המגירה לעגלת הקניות
    };

    return (
        <div className="notifications-container">
    {getLowWeightDrawers().length > 0 ? (
        <div>
            <h3>Low Stock</h3>
            <ul className="notifications-list">
                {getLowWeightDrawers().map(drawer => (
                    <li key={drawer.id} className="notification-item">
                        <span className="drawer-name">  {drawer.name}</span>
                        <span className="drawer-quantity">  {drawer.getQuantity()}</span>
                        <button 
                            className="add-to-cart-btn" 
                            onClick={() => handleAddToCart(drawer)}
                        >
                            <FaShoppingCart /> {/* אייקון של עגלת קניות */}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    ) : (
        <p className="no-notifications">no notifications</p>
    )}
</div>

    );
};

export default Notification;
