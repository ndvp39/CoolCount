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


// פונקציה לשמירת המגירות של המשתמש במקרר מסוים
const saveDrawers = async (userId, fridgeId, drawers) => {
    try {
        const response = await fetch(`api/users/${userId}/fridges/${fridgeId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(drawers),
        });

        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            throw new Error('Failed to save drawers: ' + response.statusText);
        }
    } catch (error) {
        console.error("Error saving drawers:", error);
        throw error;
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
    sendArduinoCode
};