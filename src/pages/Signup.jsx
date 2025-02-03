import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
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
import { GoogleIcon} from "../components/CustomIcons";
import { NavLink } from "react-router";

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

  return (
      <><CssBaseline enableColorScheme /><Stack direction="column" justifyContent="center" alignItems="center" spacing={2}>
      <Card variant="outlined">

        <Typography component="h1" variant="h4">REGISTRO</Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <FormControl>
            <FormLabel>Nombre y Apellidos</FormLabel>
            <TextField fullWidth value={name} onChange={(e) => setName(e.target.value)} />
          </FormControl>
          <FormControl>
            <FormLabel>Email</FormLabel>
            <TextField fullWidth value={email} onChange={(e) => setEmail(e.target.value)}  />
          </FormControl>
          <FormControl>
            <FormLabel>Contraseña</FormLabel>
            <TextField fullWidth type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </FormControl>
          <Button type="submit" fullWidth variant="contained">Regístrate</Button>
        </Box>
        {errorMessage && <Typography color="error">{errorMessage}</Typography>}
        <Divider>
          <Typography>o</Typography>
        </Divider>
        <Button fullWidth variant="outlined" startIcon={<GoogleIcon />}>Registrate con Google</Button>
        <Typography>¿Ya tienes una cuenta? <NavLink to="/login" style={{ marginRight: '10px', textDecoration: 'none', color: 'blue' }}>
                ¡Entra! 
            </NavLink></Typography>
      </Card>
    </Stack></>
  );
}
