// apiService.js

const APP_ID = '35b35351';
const APP_KEY = 'dd40ed22e00202893a0c9e4c37a3685d';
const BASE_URL = "https://api.edamam.com/search";


//https://api.edamam.com/search?q=egg,בננה&app_id=35b35351&app_key=dd40ed22e00202893a0c9e4c37a3685d
console.log('APP_ID:', APP_ID);
console.log('APP_KEY:', APP_KEY);


// פונקציה לחיפוש מתכונים על בסיס רשימת מוצרים
const fetchRecipes = async (ingredients) => {
    const query = ingredients.join(",");
    const url = `${BASE_URL}?q=${query}&app_id=${APP_ID}&app_key=${APP_KEY}`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch recipes");

        const data = await response.json();
        console.log('Items: ',data)

        return data.hits; // מחזיר את רשימת המתכונים

    } catch (error) {
        console.error("Error fetching recipes:", error);
        throw error;
    }

};


const saveDrawers = async (userId, fridgeId, drawers) => {
    try {
        const response = await fetch(`/api/users/savedrawers`, { // הנתיב הנכון
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // חשוב לציין שזה JSON
            },
            body: JSON.stringify({
                userId: userId,
                fridgeId: fridgeId,
                drawers: drawers
            }),
        });

        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            const errorMessage = await response.text();
            throw new Error(`Failed to save drawers: ${errorMessage}`);
        }
    } catch (error) {
        console.error("Error saving drawers:", error);
        throw error;
    }
};


// פונקציה לשליחת מייל דרך השרת
const sendEmail = async (cart, email) => {
    const emailData = {
        to: email, // כתובת הנמען
        subject: "Order Details",
        text: `Order summary: ${cart.map(item => `${item.name} x ${item.quantity}`).join(", ")}`
    };

    try {
        const response = await fetch("send-email", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(emailData),
        });

        if (response.ok) {
            alert("Email sent successfully!");
        } else {
            alert("Failed to send email.");
        }
    } catch (error) {
        console.error("Error sending email:", error);
        alert("Error sending email.");
    }
};



// פונקציה לקבלת המגירות של המשתמש ממקרר מסוים
const getDrawers = async (userId, fridgeId) => {
    try {
        const response = await fetch(`api/users/${userId}/fridges/${fridgeId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            throw new Error('Failed to fetch drawers: ' + response.statusText);
        }
    } catch (error) {
        console.error("Error fetching drawers:", error);
        throw error;
    }
};

const getFridgesId = async (userId) => {
    try {
        const response = await fetch(`/api/users/getfridgesid`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId }), // שולח את userId בגוף הבקשה
        });

        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            throw new Error('Failed to fetch fridges: ' + response.statusText);
        }
    } catch (error) {
        console.error("Error fetching fridges:", error);
        throw error;
    }
};


// שליחת קוד הארדוינו לשרת לאימות, הפונקציה תחזיר אם אומת ותקשר בדטבייס בין המשתמש למקרר (קוד הארדוינו, ותשנה את האיידי של המקרר (את שםהאיידי של הקולקשן לקוד הארדיונ שזה המקרר))
const sendArduinoCode = async (userId, arduinoCode) => {
    try {
        const response = await fetch(`api/savearduinocode`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({userId, arduinoCode}),
        });

        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            throw new Error('Failed : ' + response.statusText);
        }
    } catch (error) {
        console.error("Error saving arduino code:", error);
        throw error;
    }
};


export default {
    saveDrawers,
    getDrawers,
    fetchRecipes,
    sendArduinoCode,
    getFridgesId,
    sendEmail
};