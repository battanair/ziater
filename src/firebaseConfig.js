import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";


const firebaseConfig = {
    apiKey: "AIzaSyCz61R5v83aUEgX_p2jwy_XjbdypGTK8Gc",
    authDomain: "ziater2.firebaseapp.com",
    projectId: "ziater2",
    storageBucket: "ziater2.firebasestorage.app",
    messagingSenderId: "442908543941",
    appId: "1:442908543941:web:4b6320865b60d3ee1619ac",
    measurementId: "G-YJLK9YYMB9"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // Create the auth object
const db = getFirestore(app);
const analytics = getAnalytics(app);


export { auth, db }; // Export the auth object

