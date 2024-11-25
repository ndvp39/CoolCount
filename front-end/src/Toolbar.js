// Toolbar Component
// A responsive toolbar with a hamburger menu to manage drawer actions and app settings.

import React, { useState } from 'react';
import './Toolbar.css';
import 'font-awesome/css/font-awesome.min.css'; // Import Font Awesome CSS

const Toolbar = ({
    onEditToggle, // Toggles editing mode
    isEditing, // Indicates if editing mode is active
    onMoveToggle, // Toggles moving mode
    isMoving, // Indicates if moving mode is active
    onAddDrawer, // Adds a new drawer
    onSaveChanges, // Saves changes
    isSaveDisabled, // Indicates if save button is disabled
    isLoading, // Indicates if save action is loading
    onSearchRecipes, // Initiates recipe search
    isRefresh, // Refreshes the data
    onSettings // Opens settings modal
}) => {
    const [isVisible, setIsVisible] = useState(false); // Tracks visibility of the hamburger menu

    // Toggles the hamburger menu visibility
    const handleToggle = () => {
        setIsVisible(!isVisible);
    };

    // Executes the passed action and closes the menu
    const handleButtonClick = (action) => {
        action();
        setIsVisible(false);
    };

    return (
        <div className="hamburger-toolbar-container">
            {/* Hamburger menu button */}
            <button className="hamburger-menu-button" onClick={handleToggle}>
                <i className={`fa ${isVisible ? 'fa-times' : 'fa-bars'}`}></i>
            </button>

            {/* Menu content */}
            {isVisible && (
                <div className="hamburger-menu-content">
                    <button className="toolbar-button" onClick={() => handleButtonClick(onEditToggle)}>
                        <i className={`fa ${isEditing ? 'fa-stop' : 'fa-pencil'}`}></i>
                        {isEditing ? ' Stop Editing' : ' Edit Drawer'}
                    </button>
                    <button className="toolbar-button" onClick={() => handleButtonClick(onMoveToggle)}>
                        <i className={`fa ${isMoving ? 'fa-lock' : 'fa-arrows-alt'}`}></i>
                        {isMoving ? ' Disable Moving' : ' Enable Moving'}
                    </button>
                    <button className="toolbar-button" onClick={() => handleButtonClick(onAddDrawer)}>
                        <i className="fa fa-plus"></i>
                        Add Drawer
                    </button>
                    <button className="toolbar-button" onClick={() => handleButtonClick(onSearchRecipes)}>
                        <i className="fa fa-search"></i>
                        Search Recipes
                    </button>
                    <button
                        className={`toolbar-button ${isSaveDisabled ? 'disabled' : ''}`}
                        onClick={() => handleButtonClick(onSaveChanges)}
                        disabled={isSaveDisabled}
                    >
                        {isLoading ? (
                            <i className="fa fa-spinner fa-spin"></i> // Loading spinner
                        ) : (
                            <i className="fa fa-save"></i>
                        )}
                        {isLoading ? ' Saving...' : ' Save changes'}
                    </button>
                    <button className="toolbar-button" onClick={() => handleButtonClick(isRefresh)}>
                        <i className="fa fa-sync"></i>
                        Refresh
                    </button>
                    <button className="toolbar-button" onClick={() => handleButtonClick(onSettings)}>
                        <i className="fa fa-cogs"></i>
                        Settings
                    </button>
                </div>
            )}
        </div>
    );
};

export default Toolbar;
