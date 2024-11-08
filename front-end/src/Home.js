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
import 'font-awesome/css/font-awesome.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import RecipesList from './Recipes.js'

import { useLocation } from 'react-router-dom';
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from 'react-router-dom'; // תצטרך גם לייבא את useNavigate
import 'bootstrap/dist/css/bootstrap.min.css'; // ייבוא עיצובים של בוטסטראפ
import {foodIcons, getFoodIcon} from './FoodIcons';


const generateUniqueId = () => '_' + Math.random().toString(36).substr(2, 9);


const fridgeId = '1';

function Home() {
    const [isOpen, setIsOpen] = useState(false);
    const [drawers, setDrawers] = useState([]);
    const [editingDrawerId, setEditingDrawerId] = useState(null);
    const [drawerDetails, setDrawerDetails] = useState({ name: '', weightperitem: 0, weight: 0, lastAddedDate: '', alertLimit: ''});
    const [isModalOpen, setIsModalOpen] = useState(false); 
    const [isEditing, setIsEditing] = useState(false); 
    const [isMoving, setIsMoving] = useState(false);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [isLoading, setIsLoading] = useState(false); // מצב טעינה
    const [activeTab, setActiveTab] = useState('notifications'); // הטאב הפעיל
    const [showHandleAndTablet, setShowHandleAndTablet] = useState(true); // בקרה על הצגת הידית והטאבלט
    const [recipes, setRecipes] = useState([]); // מצב לאחסון המתכונים שנמצאו
    const location = useLocation();
    const { uid } = location.state || {}; // קבלת ה-uid מתוך ה-state
    const [arduinoCode, setArduinoCode] = useState("");

    const navigate = useNavigate();

    const handleLogout = async () => {
        const auth = getAuth();
        try {
            await signOut(auth);
            console.log("User signed out successfully");
            localStorage.removeItem('uid-coolcount'); // מחק את ה-uid מהlocalStorage
            navigate('/'); // הנח את המשתמש למסך הלוגין
        } catch (error) {
            console.error("Error signing out: ", error);
        }
    };

    const handleSendArduinoCode = async () => {
        console.log("Arduino Code:", arduinoCode);
        try {
            const arduinoCodeResult = await apiService.sendArduinoCode(uid, arduinoCode); // גישה לפונקציה דרך apiService

            // @@@@@@@@@@@@@@@@@@@@@@@@2
            
        } catch (error) {
            console.error("Error send Arduino Code:", error);
        }
    };
    
    useEffect(() => {
        const fetchDrawers = async () => {
            try {
                console.log(location.state)
                const data = await apiService.getDrawers(uid, arduinoCode);
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
                    drawer.height,
                    drawer.alertLimit,

                ));
                setDrawers(drawerInstances);
            } catch (error) {
                console.error('Failed to load drawers:', error);
            }
        };    
        fetchDrawers();
    }, [arduinoCode]);
    

    useEffect(() => {
        console.log("Drawers updated:", drawers);
        setHasUnsavedChanges(true);
    }, [drawers]);

    const saveChanges = async () => {
        setIsLoading(true); // התחלת טעינה
        try {
            const data = await apiService.saveDrawers(uid, arduinoCode, drawers);
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
            alertLimit:drawer.alertLimit,
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
                    drawer.height,
                    drawerDetails.alertLimit
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
                    drawer.height,
                    drawer.alertLimit
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
        const newDrawer = new Drawer(generateUniqueId(), `New Drawer`, 100, 0, new Date().toLocaleDateString(), 50, 50, 100, 100,0); 
        setDrawers([...drawers, newDrawer]);
    };

    const onSearchRecipes = async () => {
        // מסננים את שמות המגירות שבהן הכמות היא מעל 0
        const ingredients = drawers
            .filter(drawer => drawer.getQuantity() > 0) // רק מגירות עם כמות גדולה מ-0
            .map(drawer => drawer.name); // אוספים את שם המגירה

        if (ingredients.length === 0) return; // אם אין מרכיבים לחיפוש, יוצאים מהפונקציה

        try {
            const recipes = await apiService.fetchRecipes(ingredients); // גישה לפונקציה דרך apiService
            setRecipes(recipes); // הנחה שהנתונים מכילים את המתכונים
            console.log('Navigating to recipes with:', recipes);
            navigate('/recipes', { state: { recipes: recipes } });
            
            
        } catch (error) {
            console.error("Error fetching recipes:", error);
        }
    };

    
    return (
        
        <div class="home-container d-flex flex-column justify-content-center align-items-center vh-120 text-white text-center p-3">
            
            <div className="logout-button-container" style={{ position: 'absolute', top: '10px', right: '20px' }}>
                <button onClick={handleLogout} className="btn btn-danger">
                    <i className="fas fa-sign-out-alt"></i> {/* אייקון של התנתקות */}
                </button>
            </div>

            {/* שדה להזנת קוד Arduino וכפתור Send */}
            <div className="arduino-code-container" style={{ position: 'absolute', top: '10px', right: '100px' }}>
                <input
                    type="text"
                    placeholder="Enter Arduino Code"
                    value={arduinoCode}
                    onChange={(e) => setArduinoCode(e.target.value)}
                    className="form-control"
                    style={{ display: 'inline', width: '150px', marginRight: '10px' }}
                />
                <button onClick={handleSendArduinoCode} className="btn btn-primary">
                    Confirm
                </button>
            </div>

            <h1 class="fridge-title display-4 text-centerz text-light">My Fridge</h1>
            <br></br>
            <Toolbar
                onEditToggle={toggleEditing}
                onMoveToggle={toggleMoving}
                isEditing={isEditing}
                isMoving={isMoving}
                onAddDrawer={addDrawer}
                onSearchRecipes={onSearchRecipes}
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
                       <div class="row justify-content-center shelf-spacing">
                            <div class="col-12">
                                <div class="shelf"></div> 
                            </div>
                            </div>
                        <div class="row justify-content-center shelf-spacing">
                            <div class="col-12">
                            <div class="shelf"></div> 
                            </div>
                            </div>
                        <div class="row justify-content-center  shelf-spacing">
                            <div class="col-12">
                            <div class="shelf"></div>
                            </div>
                        </div>
                        <div class="row justify-content-center  shelf-spacing">
                            <div class="col-12">
                            <div class="shelf"></div>
                            </div>
                        </div>
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
                                            d.height,
                                            d.alertLimit
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
                                                size.height, // עדכון הגובה החדש
                                                d.alertLimit
                                            ) 
                                            : d
                                    );
                                    setDrawers(updatedDrawers);
                                    
                                }}
                            >
                                
                         <div>
                            {getFoodIcon(drawer.name)} {}
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
                    <div className="tab-container d-flex justify-content-around">
                        <div className={`tab ${activeTab === 'notifications' ? 'active' : ''}`} onClick={() => setActiveTab('notifications')}>
                        <i className="fa fa-bell"></i> {/* אייקון של התראה */}
                        </div>
                        <div className={`tab ${activeTab === 'statistics' ? 'active' : ''}`} onClick={() => setActiveTab('statistics')}>
                        <i className="fa fa-chart-bar"></i> {/* אייקון של סטטיסטיקה */}
                        </div>

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
        </div>
         
    );
}


export default Home;
