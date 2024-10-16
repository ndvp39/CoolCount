import React from 'react';
import './Toolbar.css';

const Toolbar = ({ onEditToggle, isEditing, onMoveToggle, isMoving }) => {
    return (
        <div className="toolbar">
            <button onClick={onEditToggle}>
                {isEditing ? 'Stop Editing' : 'Edit Drawer'}
            </button>
            <button onClick={onMoveToggle}>
                {isMoving ? 'Stop Moving' : 'Start Moving'} {/* Update button text */}
            </button>
        </div>
    );
};

export default Toolbar;
