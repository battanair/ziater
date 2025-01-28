// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCz61R5v83aUEgX_p2jwy_XjbdypGTK8Gc",
  authDomain: "ziater2.firebaseapp.com",
  projectId: "ziater2",
  storageBucket: "ziater2.firebasestorage.app",
  messagingSenderId: "442908543941",
  appId: "1:442908543941:web:4b6320865b60d3ee1619ac"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export default app;