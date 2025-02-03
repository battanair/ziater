import React, { useState } from "react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebaseConfig"; // Importa tu instancia de auth
import { gapi } from "gapi-script";
import { useEffect } from "react";
import Button from '@mui/material/Button';
import { GoogleIcon } from "./CustomIcons";

const GoogleLogin = () => {
  const [error, setError] = useState(null);

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      // Redirige al usuario a la página de inicio o a la página protegida
    } catch (error) {
      setError(error.message);
    }
  };

  // Inicializa Google Sign-In (solo una vez)
  useEffect(() => {
    const initClient = () => {
      gapi.client.init({
        clientId: "442908543941-hlmj83s1alduquorv5rlh6q3ptcj82qs.apps.googleusercontent.com", // Reemplaza con tu ID de cliente
        scope: "profile email",
      });
    };

    gapi.load("client:auth2", initClient);
  }, []);

  return (
    <div>
      {error && <p>{error}</p>}
      <Button fullWidth variant="outlined" onClick={handleGoogleLogin} startIcon={<GoogleIcon />}>Inicia sesión de Google</Button>

    </div>
  );
};

export default GoogleLogin;
