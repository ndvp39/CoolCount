import React from 'react';
import './Notification.css'; 

const Notification = ({ drawers }) => {
    const getLowWeightDrawers = () => {
        return drawers.filter(drawer => drawer.getQuantity() <= drawer.alertLimit,
    );
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
