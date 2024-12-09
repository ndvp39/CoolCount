import React, { useState } from 'react';
import { FaQuestionCircle } from 'react-icons/fa';
import './Notification.css';
import Help from "./Help";

const LastUpdated = ({ drawers }) => {


    return (
        <div className="tabletin-container">
            <div className="help-header d-flex justify-content-start align-items-center">
                <div className="help-title-container d-flex align-items-center">
                    <h3 className="help-title">Last Updated</h3>
                    <Help section="lastUpdated" />
                </div>
            </div>


            {drawers.length > 0 ? (
                <ul className="tabletin-list">
                    {drawers.map((drawer) => (
                        <li key={drawer.id} className="tabletin-item statistics-item">
                            <div className="drawer-info">
                            {/*<span className="drawer-nameN">{drawer.name.length > 8 ? drawer.name.substring(0, 8) + '...' : drawer.name + "'s drawer"}</span>*/}
                            <span className="drawer-nameN">{drawer.name + "'s drawer"}</span>
                            <span className="drawer-date">{drawer.lastAddedDate || 'No update available'}</span>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="no-tabletin">No drawers</p>
            )}
        </div>
    );
};

export default LastUpdated;
