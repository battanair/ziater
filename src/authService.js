import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

// 🔹 Proveedor de Google
const provider = new GoogleAuthProvider();

// 🔹 Función para iniciar sesión con Google
export const loginWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        const idToken = await user.getIdToken();

        // Enviar token al backend
        const response = await fetch("http://localhost:5000/auth/google-login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id_token: idToken }),
        });

        const data = await response.json();
        console.log("Respuesta del backend:", data);
        return user;
    } catch (error) {
        console.error("Error en login con Google:", error);
        throw error;
    }
};


// 🔹 Función para registrar usuario
export const register = async (email, password) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error) {
        console.error("Error en el registro:", error);
        throw error;
    }
};

// 🔹 Función para iniciar sesión
export const login = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error) {
        console.error("Error en el login:", error);
        throw error;
    }
};