import React, { useState, useEffect } from 'react';
import './Home.css';
import { FaLock, FaLockOpen } from 'react-icons/fa';
import Drawer from './Drawer';
import EditDrawerModal from './EditDrawerModal';
import Toolbar from './Toolbar';
import Draggable from 'react-draggable';
import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css';

const generateUniqueId = () => '_' + Math.random().toString(36).substr(2, 9);

function Home() {
    const [isOpen, setIsOpen] = useState(false);
    const [drawers, setDrawers] = useState([
        //new Drawer(generateUniqueId(), 'New Drawer', 0, 0, 0, new Date().toLocaleDateString()),
    ]);

    const [editingDrawerId, setEditingDrawerId] = useState(null);
    const [drawerDetails, setDrawerDetails] = useState({ name: '', weightperitem: 0, weight: 0, quantity: 0, lastAddedDate: '' });
    const [isModalOpen, setIsModalOpen] = useState(false); 
    const [isEditing, setIsEditing] = useState(false); 
    const [isMoving, setIsMoving] = useState(false);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    useEffect(() => {
        console.log("Drawers updated:", drawers);
        setHasUnsavedChanges(true);
    }, [drawers]);

    const saveChanges = () => {
        console.log("Saving changes to server...", drawers);
        setHasUnsavedChanges(false);
    };

    const toggleFridge = () => {
        setIsOpen(!isOpen);
    };

    const editDrawer = (drawerId) => {
        const drawer = drawers.find(d => d.id === drawerId);
        setDrawerDetails({
            name: drawer.name,
            weightperitem: drawer.weightperitem,
            weight: drawer.weight,
            quantity: drawer.quantity,
            lastAddedDate: drawer.lastAddedDate,
        });
        setEditingDrawerId(drawerId);
        setIsModalOpen(true); 
    };

    const handleEditSubmit = (event) => {
        event.preventDefault();
        const updatedDrawers = drawers.map(drawer => 
            drawer.id === editingDrawerId 
                ? { ...drawer, ...drawerDetails }
                : drawer
        );
        setDrawers(updatedDrawers);
        setIsModalOpen(false); 
        setEditingDrawerId(null);
    };

    const deleteDrawer = () => {
        if (editingDrawerId !== null) {
            const updatedDrawers = drawers.filter(drawer => drawer.id !== editingDrawerId);
            setDrawers(updatedDrawers);
            setIsModalOpen(false);
            setEditingDrawerId(null);
            setDrawerDetails({ name: '' });
        }
    };

    const toggleEditing = () => {
        setIsEditing(!isEditing);
    };

    const toggleMoving = () => {
        setIsMoving(!isMoving);
    };

    const addDrawer = () => {
        const newDrawer = new Drawer(generateUniqueId(), `New Drawer`, 0, 0, 100, new Date().toLocaleDateString(),0,0,100,100); // מיקום התחלתי קבוע
        setDrawers([...drawers, newDrawer]); // שמירת המיקום של כל מגירה כפי שהוא והוספת מגירה חדשה בסוף
    };


    return (
        <div className="home-container">
            <h1 className="fridge-title">My Fridge</h1>
            <Toolbar 
                onEditToggle={toggleEditing} 
                onMoveToggle={toggleMoving}
                isEditing={isEditing} 
                isMoving={isMoving} 
                onAddDrawer={addDrawer} 
                onSaveChanges={saveChanges} 
                isSaveDisabled={!hasUnsavedChanges} 
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

                        {drawers.map((drawer) => (
                            <Draggable 
                                key={drawer.id} 
                                disabled={!isMoving} 
                                onStop={(e, data) => {
                                    const updatedDrawers = drawers.map(d => 
                                        d.id === drawer.id 
                                            ? { ...d, x: data.x, y: data.y }
                                            : d
                                    );
                                    setDrawers(updatedDrawers);
                                }}
                            >
                                <ResizableBox
                                    width={200} 
                                    height={100} 
                                    minConstraints={[100, 50]} 
                                    maxConstraints={[300, 150]} 
                                    className="drawer" 
                                    onResizeStop={(e, { size }) => {
                                        const updatedDrawers = drawers.map(d => 
                                            d.id === drawer.id 
                                                ? { ...d, width: size.width, height: size.height }
                                                : d
                                        );
                                        setDrawers(updatedDrawers);
                                    }}
                                >
                                    <div onClick={() => isEditing && editDrawer(drawer.id)}>
                                        {drawer.name}
                                    </div>
                                </ResizableBox>
                            </Draggable>
                        ))}

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
                    onDelete={deleteDrawer}
                />
            )}
        </div>
    );
}

export default Home;
