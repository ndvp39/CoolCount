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
import Notification from './Notification';

import { useLocation } from 'react-router-dom';
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from 'react-router-dom'; // תצטרך גם לייבא את useNavigate


const generateUniqueId = () => '_' + Math.random().toString(36).substr(2, 9);


const fridgeId = '1';

function Home() {
    const [isOpen, setIsOpen] = useState(false);
    const [drawers, setDrawers] = useState([]);
    const [editingDrawerId, setEditingDrawerId] = useState(null);
    const [drawerDetails, setDrawerDetails] = useState({ name: '', weightperitem: 0, weight: 0, lastAddedDate: '' });
    const [isModalOpen, setIsModalOpen] = useState(false); 
    const [isEditing, setIsEditing] = useState(false); 
    const [isMoving, setIsMoving] = useState(false);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [isLoading, setIsLoading] = useState(false); // מצב טעינה
    const [activeTab, setActiveTab] = useState('statistics'); // הטאב הפעיל
    const [showHandleAndTablet, setShowHandleAndTablet] = useState(false); // בקרה על הצגת הידית והטאבלט

    const location = useLocation();
    const { uid } = location.state || {}; // קבלת ה-uid מתוך ה-state

    const navigate = useNavigate();

    const handleLogout = async () => {
        const auth = getAuth();
        try {
            await signOut(auth);
            console.log("User signed out successfully");
            navigate('/'); // הנח את המשתמש למסך הלוגין
        } catch (error) {
            console.error("Error signing out: ", error);
        }
    };
    
    useEffect(() => {
        const fetchDrawers = async () => {
            try {
                console.log(location.state)
                const data = await apiService.getDrawers(uid, fridgeId);
                // Convert each plain object into an instance of the Drawer class
                const drawerInstances = data.map(drawer => new Drawer(
                    drawer.id, 
                    drawer.name, 
                    drawer.weightperitem, 
                    drawer.weight, 
                    drawer.lastAddedDate, 
                    drawer.x, 
                    drawer.y, 
                    drawer.width, 
                    drawer.height
                ));
                setDrawers(drawerInstances);
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
        setIsLoading(true); // התחלת טעינה
        try {
            const data = await apiService.saveDrawers(uid, fridgeId, drawers);
            console.log("Changes saved successfully:", data);
            setHasUnsavedChanges(false);
        } catch (error) {
            console.error('Failed to save drawers:', error);
        }
        setIsLoading(false); // סיום טעינה
    };

    const toggleFridge = () => {
        setIsOpen(!isOpen);

        // הפעלת ההופעה של הידית והטאבלט לאחר שנייה
        if (isOpen) {
            setTimeout(() => {
                setShowHandleAndTablet(true);
            }, 700); // 1000 מילישניות = שנייה אחת
        } else {
            setShowHandleAndTablet(false); // הסתרת הידית והטאבלט כשהמקרר נפתח מחדש
        }
    };

    const editDrawer = (drawerId) => {
        const drawer = drawers.find(d => d.id === drawerId);
        setDrawerDetails({
            name: drawer.name,
            weightperitem: drawer.weightperitem,
            weight: drawer.weight,
            lastAddedDate: drawer.lastAddedDate,
        });
        setEditingDrawerId(drawerId);
        setIsModalOpen(true); 
    };

    const handleEditSubmit = (event) => {
        event.preventDefault();
        const updatedDrawers = drawers.map(drawer => 
            drawer.id === editingDrawerId
                ? new Drawer(
                    drawer.id, 
                    drawerDetails.name, 
                    drawerDetails.weightperitem, 
                    drawerDetails.weight, 
                    drawerDetails.lastAddedDate, 
                    drawer.x, 
                    drawer.y, 
                    drawer.width, 
                    drawer.height
                ) 
                : drawer
        );
        setDrawers(updatedDrawers);
        setIsModalOpen(false); 
        setEditingDrawerId(null);
    };
    

    const deleteDrawer = () => {
        if (editingDrawerId !== null) {
            const updatedDrawers = drawers
                .filter(drawer => drawer.id !== editingDrawerId) // מסנן את המגירה לפי ה-ID שלה
                .map(drawer => new Drawer( // יוצרים מחדש את כל המגירות הנותרות
                    drawer.id, 
                    drawer.name, 
                    drawer.weightperitem, 
                    drawer.weight, 
                    drawer.lastAddedDate, 
                    drawer.x, 
                    drawer.y, 
                    drawer.width, 
                    drawer.height
                ));
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
        const newDrawer = new Drawer(generateUniqueId(), `New Drawer`, 100, 0, new Date().toLocaleDateString(), 50, 50, 100, 100); 
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
                isSaveDisabled={!hasUnsavedChanges || isLoading}
                isLoading={isLoading} 
            />
            <div className={`fridge open`}>
                <div className="fridge-header">
                    <button className="toggle-btn" onClick={toggleFridge}>
                        {isOpen ? <FaLockOpen className="lock-icon" /> : <FaLock className="lock-icon" />}
                    </button>
                </div>
                <div className={`fridge-door-left ${isOpen ? 'open' : 'closed'}`}></div>
                <div className={`fridge-door-right ${isOpen ? 'open' : 'closed'}`}></div>
                <div className="fridge-footer">
                    <div className="fridge-leg"></div>
                    <div className="fridge-leg"></div>
                </div>
                <div className={`fridge-interior visible`}>
                    <div className="shelf"></div>
                    <div className="shelf"></div>
                    <div className="shelf"></div>
                    {drawers.map((drawer) => (
                        <Draggable
                            className="drawer"
                            key={drawer.id}
                            defaultPosition={{ x: drawer.x, y: drawer.y }} // הגדרת מיקום ראשוני
                            disabled={!isMoving}
                            bounds=".fridge-interior"
                            onStop={(e, data) => {
                                const updatedDrawers = drawers.map(d => 
                                    d.id === drawer.id 
                                        ? new Drawer( // יצירת מופע חדש של Drawer
                                            d.id, 
                                            d.name, 
                                            d.weightperitem, 
                                            d.weight, 
                                            d.lastAddedDate, 
                                            data.x, // עדכון המיקום החדש
                                            data.y, 
                                            d.width, 
                                            d.height
                                        ) 
                                        : d
                                );
                                setDrawers(updatedDrawers);
                                
                            }}
                        >
                            <ResizableBox
                                onClick={() => isEditing && editDrawer(drawer.id)}
                                style={{ position: 'absolute' }}
                                width={drawer.width} // הוספת width מהדאטה
                                height={drawer.height} // הוספת height מהדאטה
                                minConstraints={[100, 50]}
                                maxConstraints={[470, 640]}
                                className="drawer"
                                onResizeStop={(e, { size }) => {
                                    const updatedDrawers = drawers.map(d => 
                                        d.id === drawer.id 
                                            ? new Drawer( // יצירת מופע חדש של Drawer
                                                d.id, 
                                                d.name, 
                                                d.weightperitem, 
                                                d.weight, 
                                                d.lastAddedDate, 
                                                d.x, 
                                                d.y, 
                                                size.width, // עדכון הרוחב החדש
                                                size.height // עדכון הגובה החדש
                                            ) 
                                            : d
                                    );
                                    setDrawers(updatedDrawers);
                                    
                                }}
                            >
                                <div>
                                    {drawer.name}
                                    <br />
                                    {"amount: " + drawer.getQuantity()}
                                </div>
                            </ResizableBox>
                        </Draggable>
                    ))}
                </div>
                {!isOpen && showHandleAndTablet && (
                <>
                <div className="fridge-handle" onClick={toggleFridge}></div>
                <div className="tablet-screen">
                    <div className="tab-container">
                        <div className={`tab ${activeTab === 'statistics' ? 'active' : ''}`} onClick={() => setActiveTab('statistics')}>Statistic</div>
                        <div className={`tab ${activeTab === 'notifications' ? 'active' : ''}`} onClick={() => setActiveTab('notifications')}>Notification</div>
                    </div>
                    <div className="tab-content">
                            {activeTab === 'statistics' ? (
                                <div>
                                    Statistics ...
                                </div>
                            ) : (
                                <div>
                                    <Notification drawers={drawers} />
                                </div>
                            )}
                        </div>
                </div> 
                </>
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
<button onClick={handleLogout}>Logout</button>
        </div>
         
    );
}


export default Home;
