import React from 'react';

const Notification = ({ drawers }) => {
    const getLowWeightDrawers = () => {
        return drawers.filter(drawer => drawer.getQuantity() <= 2);
    };

    return (
        <div>
            {getLowWeightDrawers().length > 0 ? (
                <ul>
                    {getLowWeightDrawers().map(drawer => (
                        <li key={drawer.id}>
                           Drawer "{drawer.name}" 
                           <br>
                           </br> 
                           Quantity: {drawer.getQuantity()} 
                        </li>
                    ))}
                </ul>
            ) : (
                "No notifications"
            )}
        </div>
    );
};

export default Notification;
