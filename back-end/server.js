const express = require('express'); // Import the Express framework
const cors = require('cors'); // Middleware for handling CORS
const { initializeApp, cert } = require('firebase-admin/app'); // Firebase Admin SDK initialization
const { getFirestore } = require('firebase-admin/firestore'); // Firestore database service
const SerialPort = require('serialport'); // Serial port for Arduino communication
const nodemailer = require('nodemailer'); // For sending emails
require('dotenv').config();

const serviceAccount = {
    type: process.env.FIREBASE_TYPE,
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: process.env.FIREBASE_AUTH_URI,
    token_uri: process.env.FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_CERT_URL,
    client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL
  };


// Initialize the Express app
const app = express();

// Middleware setup 
app.use(cors()); // Allow cross-origin requests
app.use(express.json()); // Parse incoming JSON payloads

// Firebase Admin SDK initialization
initializeApp({
  credential: cert(serviceAccount), // Use the provided service account key
});

const db = getFirestore(); // Initialize Firestore database instance

// Route to handle weight updates from Arduino
app.post('/api/weight', async (req, res) => {
    const { mac_address, sensor_id, weight } = req.body; // Extract data from the request body
    console.log(req.body);

    if (!mac_address || !sensor_id || !weight) {
        return res.status(400).send("Missing required fields: mac_address, sensor_id, or weight.");
    }

    try {
        // Retrieve user relation based on the MAC address
        const userRelateRef = db.collection('Fridges_Users').doc('fridges_users');
        const userRelateDoc = await userRelateRef.get();

        if (!userRelateDoc.exists) {
            return res.status(404).send("fridges_users document not found.");
        }

        const userId = userRelateDoc.data()[mac_address]; // Get user ID from MAC address

        // Fetch user document
        const userRef = db.collection('Users').doc(userId);
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            return res.status(404).send("User not found.");
        }

        const userDataFromUsers = userDoc.data(); // Get user data

        // Update weight in the user's fridge sensor
        if (userDataFromUsers.fridges &&
            userDataFromUsers.fridges[mac_address] &&
            userDataFromUsers.fridges[mac_address][sensor_id]) {
            userDataFromUsers.fridges[mac_address][sensor_id].weight = weight;
        } else {
            return res.status(404).send("Sensor or drawer not found.");
        }

        // Save updated fridge data to Firestore
        await userRef.update({ fridges: userDataFromUsers.fridges });
        res.status(200).send(`Weight updated to ${weight} for sensor ${sensor_id} successfully!`);
    } catch (error) {
        console.error("Error updating weight:", error);
        res.status(500).send("Error updating weight.");
    }
});

// Route to fetch drawers from a fridge
app.post('/api/users/drawers', async (req, res) => {
    const { userId, fridgeId } = req.body; // Retrieve userId and fridgeId from request body

    try {
        const userDoc = await db.collection('Users').doc(userId).get(); // Fetch user document

        if (!userDoc.exists) {
            return res.status(404).json({ message: 'User not found' });
        }

        const fridges = userDoc.data().fridges;
        const fridgeDrawers = fridges[fridgeId]; // Get drawers for the fridge

        if (!fridgeDrawers) {
            return res.status(404).json({ message: 'Fridge not found' });
        }

        res.json(fridgeDrawers); // Return drawers as JSON
    } catch (error) {
        console.error('Error getting drawers:', error);
        res.status(500).json({ message: 'Error retrieving drawers data' });
    }
});


// Route to save updated drawers
app.post('/api/users/savedrawers', async (req, res) => {
    const { userId, fridgeId, drawers } = req.body;

    try {
        if (!userId || !fridgeId || !drawers) {
            return res.status(400).json({ message: 'Missing required data' });
        }

        const userDocRef = db.collection('Users').doc(userId);
        const userDoc = await userDocRef.get();

        if (!userDoc.exists) {
            return res.status(404).json({ message: 'User not found' });
        }

        const existingFridge = (userDoc.data().fridges || {})[fridgeId] || [];
        const drawersUpdated = drawers.map((drawer, index) => {
            const existingDrawer = existingFridge[index] || {};
            return {
                ...drawer,
                weight: existingDrawer.weight ?? drawer.weight,
            };
        });

        const fridges = userDoc.data().fridges || {};
        fridges[fridgeId] = drawersUpdated;

        await userDocRef.update({ fridges });
        res.status(200).json({ message: 'Drawers saved successfully' });
    } catch (error) {
        console.error('Error saving drawers:', error);
        res.status(500).json({ message: 'Error saving drawers data' });
    }
});

// Route to create a new user
app.post('/api/users', async (req, res) => {
    const { uid, email } = req.body;

    try {
        await db.collection('Users').doc(uid).set({
            details: email,
            fridges: {'Default': {}},
        });
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error creating user' });
    }
});

// Route to fetch fridge IDs
app.post('/api/users/getfridgesid', async (req, res) => {
    const { userId } = req.body;

    try {
        const userDoc = await db.collection('Users').doc(userId).get();

        if (!userDoc.exists) {
            return res.status(404).json({ message: 'User not found' });
        }

        const fridges = userDoc.data().fridges;

        if (!fridges) {
            return res.status(200).json([]);
        }

        const fridgeIds = Object.keys(fridges);
        res.json(fridgeIds);
    } catch (error) {
        console.error('Error fetching fridges IDs:', error);
        res.status(500).json({ message: 'Error retrieving fridges data' });
    }
});

// Route to register Arduino MAC address
app.post('/api/registerArduino', async (req, res) => {
    const { mac_address } = req.body;

    try {
        const fridgeUsersRef = db.collection('Fridges_Users').doc('fridges_users');
        const fridgeDoc = await fridgeUsersRef.get();
        const fridgesData = fridgeDoc.data();

        if (fridgeDoc.exists && fridgesData[mac_address] === undefined) {
            await fridgeUsersRef.update({ [mac_address]: "" });
            res.status(201).json({ message: 'MAC Address registered successfully' });
        } else if (fridgesData[mac_address] === "") {
            res.status(200).json({ message: 'MAC Address already registered but no user assigned' });
        } else {
            res.status(400).json({ message: 'MAC Address already associated with a user' });
        }
    } catch (error) {
        console.error('Error registering Arduino MAC address:', error);
        res.status(500).json({ message: 'Error' });
    }
});

// Route to link Arduino code to user
app.post('/api/savearduinocode', async (req, res) => {
    const { userId, arduinoCode } = req.body;

    try {
        const fridgeUsersRef = db.collection('Fridges_Users').doc('fridges_users');
        const fridgeDoc = await fridgeUsersRef.get();
        const fridgesData = fridgeDoc.data();

        if (fridgeDoc.exists && fridgesData[arduinoCode] === "") {
            await fridgeUsersRef.update({ [arduinoCode]: userId });

            const userDocRef = db.collection('Users').doc(userId);
            await userDocRef.set(
                { fridges: { [arduinoCode]: {} } },
                { merge: true }
            );

            res.status(201).json({ message: 'Success' });
        } else {
            res.status(400).json({ message: 'Arduino code not available or already linked' });
        }
    } catch (error) {
        console.error('Error updating user id to Arduino code:', error);
        res.status(500).json({ message: 'Error' });
    }
});

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "market.monitor.b@gmail.com",
        pass: "jwhj qkys tdsr wiav", // Application-specific password
    },
});

// Route to send email
app.post("/send-email", (req, res) => {
    const { to, subject, text } = req.body;

    const mailOptions = {
        from: "test@gmail.com",
        to: to,
        subject: subject,
        text: text,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).send(error.toString());
        }
        res.status(200).send("Email sent: " + info.response);
    });
});

// Health check route
app.get('/', (req, res) => {
    res.json({ message: 'CoolCount - server is running...' });
});

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
