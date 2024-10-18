// apiService.js


// פונקציה לשמירת המגירות של המשתמש
const saveDrawers = async (userId, fridgeId, drawers) => {
    try {
        const response = await fetch(`api/users/${userId}/${fridgeId}`, {
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

// פונקציה לקבלת המגירות של המשתמש מהשרת
const getDrawers = async (userId, fridgeId) => {
    try {
        const response = await fetch(`api/users/${userId}/${fridgeId}`, {
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


export default {
    saveDrawers,
    getDrawers,
};