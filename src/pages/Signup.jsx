import React, { useState } from "react";
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../firebaseConfig";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import MuiCard from "@mui/material/Card";
import { styled } from "@mui/material/styles";
import { GoogleIcon } from "../components/CustomIcons";
import { NavLink } from "react-router";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: "auto",
  boxShadow:
    "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
  [theme.breakpoints.up("sm")]: {
    width: "450px",
  },
}));

const StyledButton = styled(Button)({
  marginTop: "1rem",
  padding: "0.5rem 1.5rem",
  fontSize: "1rem",
  borderRadius: "5px",
  fontWeight: "bold",
  backgroundColor: "black",
  color: "white",
  '&:hover': {
    backgroundColor: "#444",
  }
});

export default function SignUp(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!name || !email || !password) {
      setErrorMessage("All fields are required.");
      return;
    }
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      console.log("User registered successfully");
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      console.log("User signed in with Google");
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <>
      <CssBaseline enableColorScheme />
      <Stack direction="column" justifyContent="center" alignItems="center" spacing={2}>
        <Card variant="outlined">
          <Typography component="h1" variant="h4" fontWeight="bold">REGISTRO</Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <FormControl>
              <FormLabel>Nombre y Apellidos</FormLabel>
              <TextField fullWidth value={name} onChange={(e) => setName(e.target.value)} />
            </FormControl>
            <FormControl>
              <FormLabel>Email</FormLabel>
              <TextField fullWidth value={email} onChange={(e) => setEmail(e.target.value)} />
            </FormControl>
            <FormControl>
              <FormLabel>Contraseña</FormLabel>
              <TextField fullWidth type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </FormControl>
            <StyledButton type="submit" fullWidth variant="contained">Regístrate</StyledButton>
          </Box>
          {errorMessage && <Typography color="error">{errorMessage}</Typography>}
          <Divider>
            <Typography>o</Typography>
          </Divider>
          <StyledButton fullWidth variant="outlined" startIcon={<GoogleIcon />} onClick={handleGoogleSignIn}>
            Regístrate con Google
          </StyledButton>
          <Typography>¿Ya tienes una cuenta? 
          <NavLink to="/login" style={{ marginLeft: '10px', textDecoration: 'underline', color: 'black' }}>
              ¡Entra!
            </NavLink>
          </Typography>
        </Card>
      </Stack>
    </>
  );
}
