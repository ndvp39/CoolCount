const express = require('express'); // asdasd
const cors = require('cors');
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const serviceAccount = require('./firebase-key.json'); // החלף את הנתיב לקובץ ה-JSON שלך
const SerialPort = require('serialport');


// הגדרת היישום Express
const app = express();

// שימוש ב-CORS ובפענוח גוף JSON
app.use(cors());
app.use(express.json());

// אתחול Firebase Admin SDK עם אישורים (צריך את קובץ ה-config שלך)
initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore(); //dsdsd 

// פונקציה שתדפיס את הפלט של הארדוינו
/*app.post('/api/weight', (req, res) => {
    const weightData = req.body; // קבלת הנתונים מהארדוינו
    console.log("Weight received:", weightData.weight); // הדפסת המשקל שנשלח מהארדוינו
  
    // שליחה של תגובה ללקוח
    res.json({ message: "Weight received", weight: weightData.weight });
  });
*/

app.post('/api/weight', async (req, res) => {
    const weightData = req.body;
    console.log(weightData.weight);
    const uid= "6z5EApKWaFO765mCBkpIL3vW0xo1"

    if (weightData === undefined || !weightData.weight) {
        return res.status(400).send("Missing required fields: weight.");
    }
    
    try {
        const userRef = db.collection('Users').doc(uid);
        
        const userDoc = await userRef.get();
        if (!userDoc.exists) {
            console.log("ERROR1");
            return res.status(404).send("User not found.");
        }
        
        const userData = userDoc.data();
        console.log(userData);
        // עדכון ערך ה-weight במיקום המתאים
        if (userData.fridges && userData.fridges['2'] && userData.fridges['2']['1']) {
            userData.fridges['1']['0'].weight = weightData.weight;
        } else {
            return res.status(404).send("Drawer not found.");
        }

        // שמירה של הנתונים המעודכנים
        await userRef.update({ fridges: userData.fridges });

        res.status(200).send(`Weight updated to ${weightData.weight} successfully!`);
    } catch (error) {
        console.error("Error updating weight:", error);
        res.status(500).send("Error updating weight.");
    }
});




// נתיב לקבלת המגירות של המקרר (GET)
app.get('/api/users/:userId/fridges/:fridgeId', async (req, res) => {
    const { userId, fridgeId } = req.params;
    
    try {
        // קריאת נתוני המגירות מהדטבייס לפי userId ו-fridgeId
        const userDoc = await db.collection('Users').doc(userId).get();

        if (!userDoc.exists) {
            return res.status(404).json({ message: 'User not found' });
        }

        const fridges = userDoc.data().fridges;
        const fridgeDrawers = fridges[fridgeId];

        if (!fridgeDrawers) {
            return res.status(404).json({ message: 'Fridge not found' });
        }

        res.json(fridgeDrawers);
    } catch (error) {
        console.error('Error getting drawers:', error);
        res.status(500).json({ message: 'Error retrieving drawers data' });
    }
});

// נתיב לשמירת המגירות של המקרר (POST)
app.post('/api/users/:userId/fridges/:fridgeId', async (req, res) => {
    const { userId, fridgeId } = req.params;
    const drawers = req.body; // המגירות שנשלחות בבקשה

    try {
        const userDocRef = db.collection('Users').doc(userId);
        const userDoc = await userDocRef.get();

        if (!userDoc.exists) {
            // אם המשתמש לא קיים, צור מסמך חדש
            await userDocRef.set({
                fridges: {
                    [fridgeId]: drawers
                }
            });
        } else {
            // אם המשתמש קיים, עדכן את המקרר הרלוונטי
            const fridges = userDoc.data().fridges || {};
            fridges[fridgeId] = drawers;
            
            await userDocRef.update({ fridges });
        }

        res.status(200).json({ message: 'Drawers saved successfully' });
    } catch (error) {
        console.error('Error saving drawers:', error);
        res.status(500).json({ message: 'Error saving drawers data' });
    }
});

app.post('/api/users', async (req, res) => {
    const { uid, email } = req.body; // קבלת uid מהבקשה
    
    try {
      // שמירה של פרטי המשתמש במסד הנתונים לאחר ההרשמה
      await db.collection('Users').doc(uid).set({ details: email, fridges: {1:null} }); // הוספת המייל לשדה details
      res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error creating user' });
    }
  });
  
  

// נתיב לבדיקת תקינות השרת
app.get('/api/message', (req, res) => {
  res.json({ message: 'Hello from the server!' });
});

// הפעלת השרת
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
