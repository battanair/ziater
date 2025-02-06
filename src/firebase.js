import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCz61R5v83aUEgX_p2jwy_XjbdypGTK8Gc",
    authDomain: "ziater2.firebaseapp.com",
    projectId: "ziater2",
    storageBucket: "ziater2.firebasestorage.app",
    messagingSenderId: "442908543941",
    appId: "1:442908543941:web:4b6320865b60d3ee1619ac"
};

// ✅ Verifica si ya existe una instancia antes de inicializar Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };