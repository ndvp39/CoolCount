// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyB1suBaIGZ4r3KD_Ye_u9HPI-XC4Pjfskg",
    authDomain: "coolcount-f0d43.firebaseapp.com",
    projectId: "coolcount-f0d43",
    storageBucket: "coolcount-f0d43.appspot.com",
    messagingSenderId: "833833682083",
    appId: "1:833833682083:web:6312eedc88da002cb8eb16",
    measurementId: "G-7STQZGBWXD"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
