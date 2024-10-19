import React, { useState } from 'react';
import './Toolbar.css';
import 'font-awesome/css/font-awesome.min.css'; // Import Font Awesome CSS

const Toolbar = ({ onEditToggle, isEditing, onMoveToggle, isMoving, onAddDrawer, onSaveChanges, isSaveDisabled, isLoading }) => {
    const [isVisible, setIsVisible] = useState(false);

    const handleToggle = () => {
        setIsVisible(!isVisible);
    };

    return (
        <div className={`toolbar-container ${isVisible ? 'active' : ''}`}>
            <button className="toggle-button" onClick={handleToggle}>
                <i className={`fa ${isVisible ? 'fa-times' : 'fa-plus'}`}></i>
            </button>
            {isVisible && (
                <div className="toolbar">
                    <button className="toolbar-button" onClick={onEditToggle}>
                        <i className={`fa ${isEditing ? 'fa-stop' : 'fa-pencil'}`}></i>
                        {isEditing ? ' Stop Editing' : ' Edit Drawer'}
                    </button>
                    <button className="toolbar-button" onClick={onMoveToggle}>
                        <i className={`fa ${isMoving ? 'fa-lock' : 'fa-arrows-alt'}`}></i>
                        {isMoving ? ' Disable Moving' : ' Enable Moving'}
                    </button>
                    <button className="toolbar-button" onClick={onAddDrawer}>
                        <i className="fa fa-plus"></i>
                        Add Drawer
                    </button>
                    <button
                        className={`toolbar-button ${isSaveDisabled ? 'disabled' : ''}`}
                        onClick={onSaveChanges}
                        disabled={isSaveDisabled}
                    >
                        {isLoading ? (
                            <i className="fa fa-spinner fa-spin"></i> // עיגול טעינה
                        ) : (
                            <i className="fa fa-save"></i>
                        )}
                        {isLoading ? ' Saving...' : ' Save changes'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default Toolbar;
