// API Service for managing fridge and drawer-related operations

const APP_ID = '35b35351'; // Application ID for the Edamam API
const APP_KEY = 'dd40ed22e00202893a0c9e4c37a3685d'; // Application Key for the Edamam API
const BASE_URL_R = "https://api.edamam.com/search"; // Base URL for the Edamam API

const BASE_URL = process.env.REACT_APP_API_URL;

// Function to fetch recipes based on a list of ingredients
const fetchRecipes = async (ingredients) => {
    const query = ingredients.join(","); // Joins ingredients into a comma-separated string
    const url = `${BASE_URL_R}?q=${query}&app_id=${APP_ID}&app_key=${APP_KEY}`;
    console.log(APP_ID);
    try {
        const response = await fetch(url); // Sends GET request to the Edamam API
        if (!response.ok) throw new Error("Failed to fetch recipes");

        const data = await response.json(); // Parses response data

        return data.hits; // Returns list of recipes
    } catch (error) {
        console.error("Error fetching recipes:", error);
        throw error; // Re-throws the error for handling in the caller
    }
};

// Function to save drawer data for a user and fridge
const saveDrawers = async (userId, fridgeId, drawers) => {
    try {
        const response = await fetch(`${BASE_URL}/api/users/savedrawers`, { // Sends POST request to save drawers
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: userId,
                fridgeId: fridgeId,
                drawers: drawers
            }), // Sends user ID, fridge ID, and drawer data
        });

        if (response.ok) {
            const data = await response.json();
            return data; // Returns server response
        } else {
            const errorMessage = await response.text();
            throw new Error(`Failed to save drawers: ${errorMessage}`);
        }
    } catch (error) {
        console.error("Error saving drawers:", error);
        throw error; // Re-throws the error
    }
};

// Function to send an email with cart details to the user
const sendEmail = async (cart, email) => {
    const emailData = {
        to: email, // Recipient email address
        subject: "Order Details", // Email subject
        text: `Order summary: ${cart.map(item => `${item.name} x ${item.quantity}`).join("\n")}` // Email content
    };

    try {
        const response = await fetch("send-email", { // Sends POST request to send email
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(emailData),
        });

    } catch (error) {
        console.error("Error sending email:", error);
        alert("Error sending email."); // Alerts the user if email fails
    }
};

// Function to fetch drawers for a specific user and fridge
const getDrawers = async (userId, fridgeId) => {
    try {
        const response = await fetch(`${BASE_URL}/api/users/${userId}/fridges/${fridgeId}`, { // Sends GET request for drawer data
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            const data = await response.json();
            return data; // Returns drawer data
        } else {
            throw new Error('Failed to fetch drawers: ' + response.statusText);
        }
    } catch (error) {
        console.error("Error fetching drawers:", error);
        throw error; // Re-throws the error
    }
};

// Function to fetch fridge IDs for a specific user
const getFridgesId = async (userId) => {
    try {
        const response = await fetch(`${BASE_URL}/api/users/getfridgesid`, { // Sends POST request for fridge IDs
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId }), // Sends user ID in the request body
        });

        if (response.ok) {
            const data = await response.json();
            return data; // Returns fridge IDs
        } else {
            throw new Error('Failed to fetch fridges: ' + response.statusText);
        }
    } catch (error) {
        console.error("Error fetching fridges:", error);
        throw error; // Re-throws the error
    }
};

// Function to send Arduino code to the server for validation
const sendArduinoCode = async (userId, arduinoCode) => {
    try {
        const response = await fetch(`${BASE_URL}/api/savearduinocode`, { // Sends POST request to validate Arduino code
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId, arduinoCode }), // Sends user ID and Arduino code
        });

        if (response.ok) {
            const data = await response.json();
            return data; // Returns server response
        } else {
            throw new Error('Failed: ' + response.statusText);
        }
    } catch (error) {
        console.error("Error saving Arduino code:", error);
        throw error; // Re-throws the error
    }
};

// Exporting all functions for use in other files
export default {
    saveDrawers,
    getDrawers,
    fetchRecipes,
    sendArduinoCode,
    getFridgesId,
    sendEmail
};
