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

app.post('/api/users/savedrawers', async (req, res) => {
  const { userId, fridgeId, drawers } = req.body;  // מקבל את המידע מתוך גוף הבקשה
  
  try {
      if (!userId || !fridgeId || !drawers) {
          return res.status(400).json({ message: 'Missing required data' });
      }

      const userDocRef = db.collection('Users').doc(userId);
      const userDoc = await userDocRef.get();

      if (!userDoc.exists) {
          return res.status(404).json({ message: 'User not found' });
      } else {
          const fridges = userDoc.data().fridges || {};
          fridges[fridgeId] = drawers;
          await userDocRef.update({ fridges });
          return res.status(200).json({ message: 'Drawers saved successfully' });
      }
  } catch (error) {
      console.error('Error saving drawers:', error);
      return res.status(500).json({ message: 'Error saving drawers data' });
  }
});




app.post('/api/users', async (req, res) => {
    const { uid, email } = req.body; // קבלת uid מהבקשה
    
    try {
      // שמירה של פרטי המשתמש במסד הנתונים לאחר ההרשמה
      await db.collection('Users').doc(uid).set({ details: email, fridges: {} }); // הוספת המייל לשדה details
      res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error creating user' });
    }
  });

  // נתיב לקבלת IDs של המקררים של המשתמש
app.post('/api/users/getfridgesid', async (req, res) => {
  const { userId } = req.body;
  
  try {
      // קריאת נתוני המשתמש מהדטבייס
      const userDoc = await db.collection('Users').doc(userId).get();

      if (!userDoc.exists) {
          return res.status(404).json({ message: 'User not found' });
      }

      const fridges = userDoc.data().fridges;

      
      // אם אין מקררים, מחזירים רשימה ריקה
      if (!fridges) {
          return res.status(200).json([]);
      }

      // מחזירים את ה-IDs של המקררים
      const fridgeIds = Object.keys(fridges);
      res.json(fridgeIds);
  } catch (error) {
      console.error('Error fetching fridges IDs:', error);
      res.status(500).json({ message: 'Error retrieving fridges data' });
  }
});


  // Endpoint to register Arduino MAC address
app.post('/api/registerArduino', async (req, res) => {
    const { macAddress } = req.body;
  
    try {
      // Reference to the 'Fridges_Users' collection in Firestore
      const fridgeUsersRef = db.collection('Fridges_Users').doc('fridges_users');
  
      // Step 1: Check if the MAC address already exists in 'fridges_users' document
      const fridgeDoc = await fridgeUsersRef.get();
      const fridgesData = fridgeDoc.data();
  
      if (fridgeDoc.exists && fridgesData[macAddress] === undefined) {
        // MAC address does not exist, so we add it with an empty value
        await fridgeUsersRef.update({
          [macAddress]: ""
        });
        res.status(201).json({ message: 'MAC Address registered successfully' });
      } else if (fridgesData[macAddress] === "") {
        // MAC address exists but has an empty value
        res.status(200).json({ message: 'MAC Address already registered but no user assigned' });
      } else {
        // MAC address exists and is associated with a user
        res.status(400).json({ message: 'MAC Address already associated with a user' });
      }
    } catch (error) {
      console.error('Error registering Arduino MAC address:', error);
      res.status(500).json({ message: 'Error' });
    }
  });


  app.post('/api/savearduinocode', async (req, res) => {
    const { userId, arduinoCode } = req.body;
  
    try {
      // Reference to the 'Fridges_Users' collection in Firestore
      const fridgeUsersRef = db.collection('Fridges_Users').doc('fridges_users');
  
      // Step 1: Check if the Arduino code already exists in 'fridges_users' document
      const fridgeDoc = await fridgeUsersRef.get();
      const fridgesData = fridgeDoc.data();
      
      // בדיקת הנתונים במסמך fridges_users עבור קוד הארדוינו
      console.log("fridges_users data:", fridgesData);
  
      if (fridgeDoc.exists && fridgesData[arduinoCode] === "") {
        // הקוד של הארדוינו קיים אך עדיין לא מחובר לאף משתמש
        
        // Step 2: עדכון מסמך fridges_users עם זיהוי המשתמש עבור קוד הארדוינו
        await fridgeUsersRef.update({
          [arduinoCode]: userId
        });
  
        // Step 3: הוספת המקרר למשתמש ב-collection של Users
        const userDocRef = db.collection('Users').doc(userId);
        await userDocRef.set(
          {
            fridges: { [arduinoCode]: {} },
          },
          { merge: true } // שמירה עם המידע הקיים
        );
  
        res.status(201).json({ message: 'Success' });
      } else {
        // במידה ואין התאמה או שהקוד כבר מחובר למשתמש אחר
        console.log(`Arduino code ${arduinoCode} NOT available or already linked`);
        res.status(400).json({ message: 'Arduino code not available or already linked to another user' });
      }
  
    } catch (error) {
      console.error('Error updating user id to Arduino code:', error);
      res.status(500).json({ message: 'Error' });
    }
  });
  
  
  
  
  
  

// נתיב לבדיקת תקינות השרת
app.get('/api/message', (req, res) => {
  res.json({ message: 'Hello from the server!' });
});

// הפעלת השרת
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
