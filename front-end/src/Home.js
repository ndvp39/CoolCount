import React, { useState } from 'react';
import './Home.css';
import { FaLock, FaLockOpen } from 'react-icons/fa';
import Drawer from './Drawer'; 
import EditDrawerModal from './EditDrawerModal'; 
import Toolbar from './Toolbar'; 
import Draggable from 'react-draggable'; 
import { ResizableBox } from 'react-resizable'; 
import 'react-resizable/css/styles.css'; 

function Home() {
    const [isOpen, setIsOpen] = useState(false);
    const [drawers, setDrawers] = useState([
        new Drawer('Drawer 1', 0, 0, 0, new Date().toLocaleDateString()),
        new Drawer('Drawer 2', 0, 0, 0, new Date().toLocaleDateString()),
        new Drawer('Drawer 3', 0, 0, 0, new Date().toLocaleDateString()),
        new Drawer('Drawer 4', 0, 0, 0, new Date().toLocaleDateString()),
        new Drawer('Drawer 5', 0, 0, 0, new Date().toLocaleDateString()),
        new Drawer('Drawer 6', 0, 0, 0, new Date().toLocaleDateString()),
    ]);

    const [editingIndex, setEditingIndex] = useState(null);
    const [drawerDetails, setDrawerDetails] = useState({ name: '', weightperitem: 0, weight: 0, quantity: 0, lastAddedDate: '' });
    const [isModalOpen, setIsModalOpen] = useState(false); 
    const [isEditing, setIsEditing] = useState(false); 
    const [isMoving, setIsMoving] = useState(false); 

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

    const deleteDrawer = () => {
        if (editingIndex !== null) {
            const updatedDrawers = drawers.filter((_, index) => index !== editingIndex);
            setDrawers(updatedDrawers);
            setIsModalOpen(false);
            setEditingIndex(null);
            setDrawerDetails({ name: '' });
        }
    };

    const toggleEditing = () => {
        setIsEditing(!isEditing);
    };

    const toggleMoving = () => {
        setIsMoving(!isMoving);
    };

    // Function to add a new drawer
    const addDrawer = () => {
        const newDrawerIndex = drawers.length + 1; // Determine the next drawer index
        const newDrawer = new Drawer(`Drawer ${newDrawerIndex}`, 0, 0, 0, new Date().toLocaleDateString());
        setDrawers([...drawers, newDrawer]);
    };

    return (
        <div className="home-container">
            <h1 className="fridge-title">My Fridge</h1>
            <Toolbar 
                onEditToggle={toggleEditing} 
                onMoveToggle={toggleMoving}
                isEditing={isEditing} 
                isMoving={isMoving} 
                onAddDrawer={addDrawer} // Pass the addDrawer function
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
                                width={200} 
                                height={100} 
                                minConstraints={[100, 50]} 
                                maxConstraints={[300, 150]} 
                                className="drawer" 
                                onResizeStop={(e, { size }) => {
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
                    onClose={() => setIsModalOpen(false)}
                    onDelete={deleteDrawer} // Pass the delete function
                />
            )}
        </div>
    );
}

export default Home;
