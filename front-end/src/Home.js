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
import ShoppingCart from './ShoppingCart';
import 'font-awesome/css/font-awesome.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

import { useLocation } from 'react-router-dom';
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from 'react-router-dom'; // תצטרך גם לייבא את useNavigate
import 'bootstrap/dist/css/bootstrap.min.css'; // ייבוא עיצובים של בוטסטראפ
import {foodIcons, getFoodIcon} from './FoodIcons';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { usePopup } from './PopupContext';


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
    const [cart, setCart] = useState([]); // ניהול מצב עגלת הקניות
    const [showHandleAndTablet, setShowHandleAndTablet] = useState(true); // בקרה על הצגת הידית והטאבלט
    const [recipes, setRecipes] = useState([]); // מצב לאחסון המתכונים שנמצאו
    const location = useLocation();
    const { uid, user_email } = location.state || {}; // קבלת ה-user מתוך ה-state
    const [arduinoCode, setArduinoCode] = useState("");
    const { showPopup } = usePopup();
    const [isRefresh, setIsRefresh] = useState(false);
    

    
    // הוספת סטייטים עבור רשימת האיידי של המקררים
    const [fridgesList, setFridgesList] = useState([]); 
    const [selectedFridgeId, setSelectedFridgeId] = useState(null);
    const [isListVisible, setListVisible] = useState(false);

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
            showPopup("Arduino linked successfully", "success","popup");
            
        } catch (error) {
            console.error("Error send Arduino Code:", error);
            showPopup("Arduino linked error, check the arduino code again", "danger","popup");
        }
    };
    useEffect(() => {
        const fetchFridges = async () => {
            try {
                const fridgesId = await apiService.getFridgesId(uid);
                setFridgesList(fridgesId);
                if (fridgesId.length > 0) {
                    setSelectedFridgeId(fridgesId[0]); // בוחר את המקרר הראשון כדי להציג את המגירות שלו
                }
            } catch (error) {
                console.error('Failed to load Fridges:', error);
            }
        };
        fetchFridges();
    }, []);
    
    useEffect(() => {
        const fetchDrawers = async () => {
            // בדיקה אם selectedFridgeId תקין
            if (!selectedFridgeId) {
                return;
            }
    
            try {
                console.log(selectedFridgeId); // לוג למטרת דיבוג
                const data = await apiService.getDrawers(uid, selectedFridgeId);
    
                // המרה של כל אובייקט למופע של המחלקה Drawer
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
    }, [selectedFridgeId, isRefresh]);
    
    

    useEffect(() => {
        console.log("Drawers updated:", drawers);
        setHasUnsavedChanges(true);
    }, [drawers]);

    // פונקציה להציג או להסתיר את רשימת המקררים
    const toggleList = () => {
        setListVisible(!isListVisible);
    };

    // פונקציה לעדכון האיידי שנבחר
    const handleSelectFridge = (event) => {
        setSelectedFridgeId(event.target.value);
    };

    const saveChanges = async () => {
        setIsLoading(true); // התחלת טעינה
        try {
            const data = await apiService.saveDrawers(uid, selectedFridgeId, drawers);
            console.log("Changes saved successfully:", data);
            showPopup("Changes saved successfully", "success","popup");
            setHasUnsavedChanges(false);
        } catch (error) {
            console.error('Failed to save drawers:', error);
            showPopup("Failed to save drawers, try again.", "danger","popup");
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

    const refreshDrawers = () => {
        setIsRefresh((prev) => !prev); // משנה את הערך של isRefresh
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
    
    const addToCart = (drawer) => {
        const existingDrawer = cart.find(item => item.id === drawer.id);
        if (existingDrawer) {
            // אם המגירה כבר קיימת בעגלה, עדכון הכמות
            const updatedCart = cart.map(item => 
                item.id === drawer.id ? { ...item, quantity: item.quantity + 1 } : item
            );
            setCart(updatedCart);
        } else {
            // אם המגירה לא קיימת בעגלה, הוספה עם כמות 1
            setCart([...cart, { ...drawer, quantity: 1 }]);
        }
    };
    
    return (
        
        <div className="container-fluid d-flex flex-column justify-content-center align-items-center text-white text-center p-3">
         
         <div className="container mt-4">
        <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: 'transparent', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)' }}>
            <button 
            className="navbar-toggler" 
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#navbarNav" 
            aria-controls="navbarNav" 
            aria-expanded="false" 
            aria-label="Toggle navigation"
            style={{ border: 'none' }}
            >
            <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
                <li className="nav-item">
                <div className="d-flex align-items-center">
                    <input
                    type="text"
                    placeholder="Arduino MAC"
                    value={arduinoCode}
                    onChange={(e) => setArduinoCode(e.target.value)}
                    className="form-control rounded-pill border-0 shadow-sm"
                    style={{ width: '150px', marginRight: '10px', padding: '8px' }}
                    />
                    <button 
                    onClick={handleSendArduinoCode} 
                    className="toggle-btn rounded-pill shadow-sm" 
                    style={{ width: '60px', marginLeft: '10px', padding: '8px' }}
                    >
                    Link
                    </button>
                </div>
                </li>
                <li className="nav-item">
                <button 
                    onClick={handleLogout} 
                    className="btn btn-danger rounded-pill shadow-sm" 
                    style={{ padding: '8px' }}
                >
                    <i className="fas fa-sign-out-alt"></i>
                </button>
                </li>
                {/* כפתור לפתיחת רשימת המקררים */}  
                <li className="nav-item mt-2">
                    <select 
                    onChange={handleSelectFridge} 
                    className="form-control rounded-pill"
                    style={{ width: '200px', fontSize: '14px' }}
                    >
                    {fridgesList.map(id => (
                        <option key={id} value={id}>Fridge {id}</option>
                    ))}
                    </select>
                </li>


            </ul>
            </div>
        </nav>
        </div>        
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
                isRefresh={refreshDrawers}
            />
            <div className={`fridge open`}>
                <div className="fridge-header" id="popup">
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
                       <div className="row justify-content-center shelf-spacing">
                            <div className="col-12">
                                <div className="shelf"></div> 
                            </div>
                            </div>
                        <div className="row justify-content-center shelf-spacing">
                            <div className="col-12">
                            <div className="shelf"></div> 
                            </div>
                            </div>
                        <div className="row justify-content-center  shelf-spacing">
                            <div className="col-12">
                            <div className="shelf"></div>
                            </div>
                        </div>
                        <div className="row justify-content-center  shelf-spacing">
                            <div className="col-12">
                            <div className="shelf"></div>
                            </div>
                        </div>
                    {drawers.map((drawer) => (
                        <Draggable
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
                    <div className="tab-container d-flex justify-content-around position-sticky">
                        <div className={`tab ${activeTab === 'notifications' ? 'active' : ''}`} onClick={() => setActiveTab('notifications')}>
                            <i className="fa fa-bell"></i> {/* אייקון של התראה */}
                        </div>
                        <div className={`tab ${activeTab === 'statistics' ? 'active' : ''}`} onClick={() => setActiveTab('statistics')}>
                            <i className="fa fa-chart-bar"></i> {/* אייקון של סטטיסטיקה */}
                        </div>
                        <div className={`tab ${activeTab === 'cart' ? 'active' : ''}`} onClick={() => setActiveTab('cart')}>
                            <i className="fa fa-shopping-cart "></i> {/* אייקון של עגלת קניות */}
                        </div>
                    </div>

                    <div className="tab-content">
                        {activeTab === 'statistics' ? (
                            <div>
                                Statistics ...
                            </div>
                        ) : activeTab === 'notifications' ? (
                            <Notification drawers={drawers} addToCart={addToCart} />
                        ) : activeTab === 'cart' ? (
                            <ShoppingCart cart={cart} setCart={setCart} user_email={user_email}/>
                        ) : null}
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
