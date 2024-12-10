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
import LastUpdated from './LastUpdated';
import ShoppingCart from './ShoppingCart';
import 'font-awesome/css/font-awesome.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

import { useLocation } from 'react-router-dom';
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import {getFoodIcon} from './FoodIcons';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { usePopup } from './PopupContext';
import SettingsModal from './SettingsModal';
import RecipesList from './Recipes';
import AboutModal from './AboutModal';

const generateUniqueId = () => '_' + Math.random().toString(36).substr(2, 9);


function Home() {
    const [isOpen, setIsOpen] = useState(false);
    const [drawers, setDrawers] = useState([]);
    const [editingDrawerId, setEditingDrawerId] = useState(null);
    const [drawerDetails, setDrawerDetails] = useState({ name: '', weightperitem: 0, weight: 0, lastAddedDate: '', alertLimit: ''});
    const [isModalOpen, setIsModalOpen] = useState(false); 
    const [isMoving, setIsMoving] = useState(false);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('notifications');
    const [cart, setCart] = useState([]);
    const [showHandleAndTablet, setShowHandleAndTablet] = useState(true);
    const [recipes, setRecipes] = useState([]);
    const location = useLocation();
    const { uid, user_email } = location.state || {};
    const [arduinoCode, setArduinoCode] = useState("");
    const { showPopup } = usePopup();
    const [isRefresh, setIsRefresh] = useState(false);
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
    const [isRecipesModalOpen, setIsRecipesModalOpen] = useState(false);
    const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);

    const [fridgesList, setFridgesList] = useState([]); 
    const [selectedFridgeId, setSelectedFridgeId] = useState(null);

    const navigate = useNavigate();
    
    // Logs out the user and redirects to the login page
    const handleLogout = async () => {
        const auth = getAuth();
        try {
            await signOut(auth);
            localStorage.removeItem('uid-coolcount');
            localStorage.removeItem('email-coolcount');
            navigate('/');
        } catch (error) {
            showPopup("Error signing out", "danger","popup");
        }
    };

    // Sends Arduino code to the server
    const handleSendArduinoCode = async () => {
        try {
            const arduinoCodeResult = await apiService.sendArduinoCode(uid, arduinoCode);
            showPopup("Arduino linked successfully", "success","popup");
            
        } catch (error) {
            showPopup("Arduino linked error, check the arduino code again", "danger","popup");
        }
    };

    // Fetches list of fridges when the component is mounted
    useEffect(() => {
        const fetchFridges = async () => {
            try {
                showPopup("loading Fridges, please wait", "success","popup");
                const fridgesId = await apiService.getFridgesId(uid);
                setFridgesList(fridgesId);
                if (fridgesId.length > 0) {
                    setSelectedFridgeId(fridgesId[fridgesId.length - 1]); // take last added fridge
                }
            } catch (error) {
                showPopup("Failed to load Fridges", "danger","popup");
            }
        };
        fetchFridges();
    }, []);

    // Fetches drawers whenever the selected fridge changes or refresh flag is toggled
    useEffect(() => {
        const fetchDrawers = async () => {
            if (!selectedFridgeId) {
                return;
            }
    
            try {
                const data = await apiService.getDrawers(uid, selectedFridgeId);
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
                    drawer.quantity
                ));
                setDrawers(drawerInstances);
                if(drawerInstances.length > 0){ // setDrawers() async func so using drawerInstances and not drawers
                    showPopup("refreshed succesfuly!", "success","popup");
                }
                else{
                    showPopup("No drawers to fetch", "danger","popup");
                }
            } catch (error) {
                showPopup("Failed to load drawers, please refresh", "danger","popup");
            }
        };
    
        fetchDrawers();
    }, [selectedFridgeId, isRefresh]);
    
    // Toggles the settings modal
    const toggleSettingsModal = () => {
        setIsSettingsModalOpen(!isSettingsModalOpen);
    };

     // Function to toggle the About popup
     const toggleAboutModal = () => {
        setIsAboutModalOpen(!isAboutModalOpen);
    };
    
    useEffect(() => {
        setHasUnsavedChanges(true);
    }, [drawers]);

    const handleSelectFridge = (event) => {
        setSelectedFridgeId(event.target.value);
    };

    // Saves changes to the drawers
    const saveChanges = async () => {
        showPopup("saving changes...", "success","popup");
        setIsLoading(true);
        try {
            const data = await apiService.saveDrawers(uid, selectedFridgeId, drawers);
            showPopup("Changes saved successfully", "success","popup");
            setHasUnsavedChanges(false);
        } catch (error) {
            showPopup("Failed to save drawers, try again.", "danger","popup");
        }
        setIsLoading(false);
    };

    // Toggles the fridge open/close state
    const toggleFridge = () => {
        setIsOpen(!isOpen);

        if (isOpen) {
            setTimeout(() => {
                setShowHandleAndTablet(true);
            }, 700);
        } else {
            setShowHandleAndTablet(false);
        }
    };

    // Refreshes the drawer data
    const refreshDrawers = () => {
        setIsRefresh((prev) => !prev);
        showPopup("refreshing...", "success","popup");
    };
    
    // Opens the modal to edit a specific drawer
    const editDrawer = (drawerId) => {
        const drawer = drawers.find(d => d.id === drawerId);
        setDrawerDetails({
            name: drawer.name,
            weightperitem: drawer.weightperitem,
            weight: drawer.weight,
            lastAddedDate: drawer.lastAddedDate,
            alertLimit:drawer.alertLimit,
            quantity:drawer.quantity
        });
        setEditingDrawerId(drawerId);
        setIsModalOpen(true); 
    };

    // Submits edits to the drawer
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
                    drawerDetails.alertLimit,
                    drawerDetails.quantity
                ) 
                : drawer
        );
        setDrawers(updatedDrawers);
        setIsModalOpen(false); 
        setEditingDrawerId(null);
    };
    
    // Deletes a drawer
    const deleteDrawer = () => {
        if (editingDrawerId !== null) {
            const updatedDrawers = drawers
                .filter(drawer => drawer.id !== editingDrawerId)
                .map(drawer => new Drawer(
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
                    drawer.quantity
                ));
            setDrawers(updatedDrawers);
            setIsModalOpen(false);
            setEditingDrawerId(null);
            setDrawerDetails({ name: '' });
            showPopup("Drawer deleted successfully", "success","popup");
        }
    };
    

    const toggleMoving = () => {
        setIsMoving(!isMoving);
    };

    // Adds a new drawer
    const addDrawer = () => {
        const newDrawer = new Drawer(generateUniqueId(), `New Drawer`, 0, 0, new Date().toLocaleDateString(), 50, 50, 100, 100,0); 
        setDrawers([...drawers, newDrawer]);
    };
    
    // Searches for recipes based on drawer contents
    const onSearchRecipes = async () => {
        const ingredients = drawers
            .filter(drawer => drawer.getQuantity() > 0 || drawer.quantity > 0)
            .map(drawer => drawer.name);
    
        if (ingredients.length === 0) return;
    
        try {
            const recipesData = await apiService.fetchRecipes(ingredients);
            setRecipes(recipesData);
            setIsRecipesModalOpen(true);
        } catch (error) {
            showPopup("Error fetching recipes", "danger","popup");
        }
    };
    
    // Adds a drawer item to the shopping cart    
    const addToCart = (drawer) => {
        const existingDrawer = cart.find(item => item.id === drawer.id);
        if (existingDrawer) {
            const updatedCart = cart.map(item => 
                item.id === drawer.id ? { ...item, quantity: item.quantity + 1 } : item
            );
            setCart(updatedCart);
        } else {
            setCart([...cart, { ...drawer, quantity: 1 }]);
        }
    };
    
    return (
        
        <div className="container-fluid d-flex flex-column justify-content-center align-items-center text-white text-center p-3">

        <div className="container mt-4">

        </div>        
            <br></br>
            <Toolbar
                onMoveToggle={toggleMoving}
                isMoving={isMoving}
                onAddDrawer={addDrawer}
                onSearchRecipes={onSearchRecipes}
                onSaveChanges={saveChanges}
                isSaveDisabled={!hasUnsavedChanges || isLoading}
                isLoading={isLoading}
                isRefresh={refreshDrawers}
                onSettings={toggleSettingsModal}
                onAbout={toggleAboutModal} 
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
                            defaultPosition={{ x: drawer.x, y: drawer.y }}
                            disabled={!isMoving}
                            bounds=".fridge-interior"
                            onStop={(e, data) => {
                                const updatedDrawers = drawers.map(d =>
                                    d.id === drawer.id
                                        ? new Drawer(
                                            d.id,
                                            d.name,
                                            d.weightperitem,
                                            d.weight,
                                            d.lastAddedDate,
                                            data.x,
                                            data.y,
                                            d.width,
                                            d.height,
                                            d.alertLimit,
                                            d.quantity
                                        )
                                        : d
                                );
                                setDrawers(updatedDrawers);
                            }}
                        >
                            <ResizableBox
                                style={{ position: "absolute" }}
                                width={drawer.width}
                                height={drawer.height}
                                minConstraints={[100, 50]}
                                maxConstraints={[470, 640]}
                                className="drawer"
                                onResizeStop={(e, { size }) => {
                                    const updatedDrawers = drawers.map(d =>
                                        d.id === drawer.id
                                            ? new Drawer(
                                                d.id,
                                                d.name,
                                                d.weightperitem,
                                                d.weight,
                                                d.lastAddedDate,
                                                d.x,
                                                d.y,
                                                size.width,
                                                size.height,
                                                d.alertLimit,
                                                d.quantity
                                            )
                                            : d
                                    );
                                    setDrawers(updatedDrawers);
                                }}
                            >
                                <div className="drawer-wrapper">

                                <div className="drawer-settings-icon" onClick={() => editDrawer(drawer.id)}>
                                    <i className="fas fa-pen" style={{ color: "white" }}></i>
                                </div>

                                <div className="drawer-content">
                                    <div className="drawer-name">
                                    {getFoodIcon(drawer.name)} {drawer.name}
                                    </div>
                                    <div className="drawer-quantity">
                                    {"X " + (drawer.getQuantity() > 0 ? drawer.getQuantity() : drawer.quantity)}
                                    </div>
                                </div>
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
                            <i className="fa fa-bell"></i>
                        </div>
                        <div className={`tab ${activeTab === 'lastupdate' ? 'active' : ''}`} onClick={() => setActiveTab('lastupdate')}>
                            <i className="fa fa-clock"></i>
                        </div>
                        <div className={`tab ${activeTab === 'cart' ? 'active' : ''}`} onClick={() => setActiveTab('cart')}>
                            <i className="fa fa-shopping-cart "></i>
                        </div>
                    </div>
                    <div className="tab-content">
                        {activeTab === 'lastupdate' ? (
                            <LastUpdated drawers={drawers} /> 
                        ) : activeTab === 'notifications' ? (
                            <Notification drawers={drawers} addToCart={addToCart} />
                        ) : activeTab === 'cart' ? (
                            <ShoppingCart cart={cart} setCart={setCart} user_email={user_email} />
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
            {isSettingsModalOpen && (
            <SettingsModal
                isSettingsModalOpen={isSettingsModalOpen}
                toggleSettingsModal={toggleSettingsModal}
                arduinoCode={arduinoCode}
                setArduinoCode={setArduinoCode}
                handleSendArduinoCode={handleSendArduinoCode}
                fridgesList={fridgesList}
                handleSelectFridge={handleSelectFridge}
                handleLogout={handleLogout}
            />
            )}
             {isAboutModalOpen && (
                <AboutModal
                    isOpen={() => setIsAboutModalOpen(true)}
                    onClose={() => setIsAboutModalOpen(false)}
                />
            )}
            {isRecipesModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <button className="close-button" onClick={() => setIsRecipesModalOpen(false)}>
                            &times;
                        </button>
                        <RecipesList recipes={recipes} />
                    </div>
                </div>
            )}
          
        </div>

       
         
    );
    
}

export default Home;
