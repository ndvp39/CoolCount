import React, { useState } from 'react';
import './Home.css';
import { FaLock, FaLockOpen } from 'react-icons/fa';
import Drawer from './Drawer'; // Ensure this import is correct
import EditDrawerModal from './EditDrawerModal'; 
import Toolbar from './Toolbar'; 
import Draggable from 'react-draggable'; // Import react-draggable
import { ResizableBox } from 'react-resizable'; // Import ResizableBox
import 'react-resizable/css/styles.css'; // Import styles

function Home() {
    const [isOpen, setIsOpen] = useState(false);
    const [drawers, setDrawers] = useState([
        new Drawer('Drawer 1', 0, 0, new Date().toLocaleDateString()),
        new Drawer('Drawer 2', 0, 0, new Date().toLocaleDateString()),
        new Drawer('Drawer 3', 0, 0, new Date().toLocaleDateString()),
        new Drawer('Drawer 4', 0, 0, new Date().toLocaleDateString()),
        new Drawer('Drawer 5', 0, 0, new Date().toLocaleDateString()),
        new Drawer('Drawer 6', 0, 0, new Date().toLocaleDateString()),
    ]);

    const [editingIndex, setEditingIndex] = useState(null);
    const [drawerDetails, setDrawerDetails] = useState({ name: '', weightperitem: 0, weight: 0, quantity: 0, lastAddedDate: '' });
    const [isModalOpen, setIsModalOpen] = useState(false); 
    const [isEditing, setIsEditing] = useState(false); 
    const [isMoving, setIsMoving] = useState(false); // Add isMoving state

    const toggleFridge = () => {
        setIsOpen(!isOpen);
    };

    const editDrawer = (index) => {
        const drawer = drawers[index];
        setDrawerDetails({
            name: drawer.name,
            weightperitem: drawer.weightperitem,
            weight: drawer.weight,
            quantity: drawer.quantity,
            lastAddedDate: drawer.lastAddedDate,
        });
        setEditingIndex(index);
        setIsModalOpen(true); 
    };

    const handleEditSubmit = (event) => {
        event.preventDefault();
        const updatedDrawers = [...drawers];
        updatedDrawers[editingIndex].updateDetails(drawerDetails.name, drawerDetails.weightperitem, drawerDetails.weight, drawerDetails.quantity, drawerDetails.lastAddedDate);
        setDrawers(updatedDrawers);
        setIsModalOpen(false); 
        setEditingIndex(null);
        setIsEditing(false); 
    };

    const handleDeleteDrawer = () => {
        const updatedDrawers = drawers.filter((_, index) => index !== editingIndex);
        setDrawers(updatedDrawers);
        setIsModalOpen(false); 
        setEditingIndex(null);
    };

    const toggleEditing = () => {
        setIsEditing(!isEditing);
    };

    const toggleMoving = () => {
        setIsMoving(!isMoving); // Toggle the moving state
    };

    return (
        <div className="home-container">
            <h1 className="fridge-title">My Fridge</h1>
            <Toolbar 
                onEditToggle={toggleEditing} 
                onMoveToggle={toggleMoving} // Update the function to handle moving
                isEditing={isEditing} 
                isMoving={isMoving} // Pass isMoving state to Toolbar
            />
            
            <div className={`fridge ${isOpen ? 'open' : 'closed'}`}>
                <div className="fridge-header">
                    <button className="toggle-btn" onClick={toggleFridge}>
                        {isOpen ? <FaLockOpen className="lock-icon" /> : <FaLock className="lock-icon" />}
                    </button>
                </div>

                <div className={`fridge-door-left ${isOpen ? 'open' : 'closed'}`}></div>
                <div className={`fridge-door-right ${isOpen ? 'open' : 'closed'}`}></div>

                <div className={`fridge-interior ${isOpen ? 'visible' : 'hidden'}`}>
                    <div className="drawer-container">
                    {drawers.map((drawer, index) => (
                        <Draggable key={index} disabled={!isMoving} onStop={(e, data) => console.log('Moved', data)}>
                            <ResizableBox
                                width={200} // Set initial width
                                height={100} // Set initial height
                                minConstraints={[100, 50]} // Minimum size
                                maxConstraints={[300, 150]} // Maximum size
                                className="drawer" 
                                onResizeStop={(e, { size }) => {
                                    // Handle the size change if necessary
                                    console.log('Resized to:', size);
                                }}
                            >
                                <div onClick={() => isEditing && editDrawer(index)}>
                                    {drawer.name}
                                </div>
                            </ResizableBox>
                        </Draggable>
                    ))}
                    </div>
                </div>

                {!isOpen && (
                    <div className="fridge-handle" onClick={toggleFridge}></div>
                )}
            </div>

            {isModalOpen && (
                <EditDrawerModal
                    drawerDetails={drawerDetails}
                    setDrawerDetails={setDrawerDetails}
                    onSave={handleEditSubmit}
                    onClose={() =>  setIsModalOpen(false)}
                    onDelete={handleDeleteDrawer} // Pass the onDelete function
                />
            )}
        </div>
    );
}

export default Home;


