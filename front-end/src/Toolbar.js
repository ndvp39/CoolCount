import React, { useState } from 'react';
import './Toolbar.css';
import 'font-awesome/css/font-awesome.min.css'; // Import Font Awesome CSS

const Toolbar = ({
    onEditToggle,
    isEditing,
    onMoveToggle,
    isMoving,
    onAddDrawer,
    onSaveChanges,
    isSaveDisabled,
    isLoading,
    onSearchRecipes,
    isRefresh,
    onSettings
}) => {
    const [isVisible, setIsVisible] = useState(false);

    const handleToggle = () => {
        setIsVisible(!isVisible); // פתיחה/סגירה של התפריט
    };

    return (
        <div className="hamburger-toolbar-container">
            {/* כפתור תפריט 3 פסים */}
            <button className="hamburger-menu-button" onClick={handleToggle}>
                <i className={`fa ${isVisible ? 'fa-times' : 'fa-bars'}`}></i>
            </button>

            {/* תוכן התפריט */}
            {isVisible && (
                <div className="hamburger-menu-content">
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
                    <button className="toolbar-button" onClick={onSearchRecipes}>
                        <i className="fa fa-search"></i>
                        Search Recipes
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
                    {/* הכפתור החדש */}
                    <button className="toolbar-button" onClick={() => isRefresh()}>
                        <i className="fa fa-sync"></i>
                        Refresh
                    </button>
                    <button className="toolbar-button" onClick={onSettings}>
                        <i className="fa fa-cogs"></i>
                        Settings
                    </button>
                </div>
            )}
        </div>
    );
};

export default Toolbar;
