import React, { useState } from 'react';
import './Home.css';
import { FaLock, FaLockOpen } from 'react-icons/fa';
import Drawer from './Drawer';
import EditDrawerModal from './EditDrawerModal'; // Import the modal

function Home() {
    const [isOpen, setIsOpen] = useState(false);
    const [drawers, setDrawers] = useState([
        new Drawer('Drawer 1', 0, 0, new Date().toLocaleDateString()),
        new Drawer('Drawer 2', 0, 0, new Date().toLocaleDateString()),
        new Drawer('Drawer 3', 0, 0, new Date().toLocaleDateString()),
        new Drawer('Drawer 4', 0, 0, new Date().toLocaleDateString()),
    ]);

    const [editingIndex, setEditingIndex] = useState(null);
    const [drawerDetails, setDrawerDetails] = useState({ name: '', weight: 0, quantity: 0, lastAddedDate: '' });
    const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility

    const toggleFridge = () => {
        setIsOpen(!isOpen);
    };

    const editDrawer = (index) => {
        const drawer = drawers[index];
        setDrawerDetails({
            name: drawer.name,
            weight: drawer.weight,
            quantity: drawer.quantity,
            lastAddedDate: drawer.lastAddedDate,
        });
        setEditingIndex(index);
        setIsModalOpen(true); // Open the modal
    };

    const handleEditSubmit = (event) => {
        event.preventDefault();
        const updatedDrawers = [...drawers];
        updatedDrawers[editingIndex].updateDetails(drawerDetails.name, drawerDetails.weight, drawerDetails.quantity, drawerDetails.lastAddedDate);
        setDrawers(updatedDrawers);
        setIsModalOpen(false); // Close the modal
        setEditingIndex(null);
    };

    return (
        <div className="home-container">
            <h1 className="fridge-title">My Fridge</h1>
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
                            <div className="drawer" key={index} onClick={() => editDrawer(index)}>
                                {drawer.name}
                            </div>
                        ))}
                    </div>
                </div>

                {!isOpen && (
                    <div className="fridge-handle" onClick={toggleFridge}></div>
                )}
            </div>

            {/* Show modal if it is open */}
            {isModalOpen && (
                <EditDrawerModal
                    drawerDetails={drawerDetails}
                    setDrawerDetails={setDrawerDetails}
                    onSave={handleEditSubmit}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </div>
    );
}

export default Home;
