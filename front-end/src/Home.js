import React, { useState, useEffect } from 'react';
import './Home.css';
import { FaLock, FaLockOpen } from 'react-icons/fa';
import Drawer from './Drawer';
import EditDrawerModal from './EditDrawerModal';
import Toolbar from './Toolbar';
import Draggable from 'react-draggable';
import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css';
import apiService from './apiService';

const generateUniqueId = () => '_' + Math.random().toString(36).substr(2, 9);

const userId = '123';
const fridgeId = '1';

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
        const fetchDrawers = async () => {
            try {
                const data = await apiService.getDrawers(userId, fridgeId); // קריאת הפונקציה לקבלת המגירות מהשרת
                setDrawers(data);
            } catch (error) {
                console.error('Failed to load drawers:', error);
            }
        };    
        fetchDrawers();
    }, []);

    useEffect(() => {
        console.log("Drawers updated:", drawers);
        setHasUnsavedChanges(true);
    }, [drawers]);

    const saveChanges = async () => {
        try {
            const data = await apiService.saveDrawers(userId, fridgeId, drawers); // קריאת הפונקציה לשמירת המגירות
            console.log("Changes saved successfully:", data);
            setHasUnsavedChanges(false);
        } catch (error) {
            console.error('Failed to save drawers:', error);
        }
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
        const newDrawer = new Drawer(generateUniqueId(), `New Drawer`, 50, 50, 100, new Date().toLocaleDateString(), 50, 50, 100, 100); // מיקום קבוע בפינה העליונה
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
                                ClassName = "Drawer"
                                key={drawer.id} 
                                style={{ position: 'absolute', top: `${drawer.y}px`, left: `${drawer.x}px` }} // הוספת top ו-left
                                disabled={!isMoving} 
                                bounds=".fridge-interior"
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
                                    onClick={() => isEditing && editDrawer(drawer.id)}
                                    style={{ position: 'absolute'}}
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
                                    <div>
                                        {drawer.name}
                                        <br>
                                        </br>
                                        {"amount: "  +  drawer.quantity}
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
