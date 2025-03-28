/* global grecaptcha */

import * as React from 'react';
import { useState } from 'react';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../firebaseConfig";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import CssBaseline from '@mui/material/CssBaseline';
import FormControlLabel from '@mui/material/FormControlLabel';
import Divider from '@mui/material/Divider';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import ForgotPassword from '../components/ForgotPassword';
import GoogleLogin from "../components/GoogleLogin";
import { NavLink } from 'react-router-dom';
import { GoogleIcon } from "../components/CustomIcons";

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  [theme.breakpoints.up('sm')]: {
    maxWidth: '450px',
  },
  boxShadow: 'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
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

const GoogleButton = styled(Button)({
  marginTop: "1rem",
  padding: "0.5rem 1.5rem",
  fontSize: "1rem",
  borderRadius: "5px",
  fontWeight: "bold",
  color: "black",
  borderColor: "black",
  '&:hover': {
    backgroundColor: "#f5f5f5",
  }
});

export default function SignIn(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    grecaptcha.enterprise.ready(async () => {
      const token = await grecaptcha.enterprise.execute('6LcpFfwqAAAAAGb3F7Sb-2msdw6jbmGXl0th3jQ1', { action: 'LOGIN' });
      if (token) {
        try {
          await signInWithEmailAndPassword(auth, email, password);
          console.log("Login successful");
        } catch (error) {
          console.error("Login error:", error);
          setError("Invalid email or password");
        }
      } else {
        setError("Captcha verification failed");
      }
    });
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      console.log("Google login successful");
    } catch (error) {
      console.error("Google login error:", error);
      setError("Failed to login with Google");
    }
  };

  return (
    <>
      <CssBaseline enableColorScheme />
      <Stack direction="column" justifyContent="center" alignItems="center" spacing={2}>
        <Card variant="outlined">
          <Typography component="h1" variant="h4" fontWeight="bold">Inicia sesión</Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {error && <Typography color="error">{error}</Typography>}
            <FormControl>
              <FormLabel>Email</FormLabel>
              <TextField type="email" value={email} onChange={(e) => setEmail(e.target.value)} required fullWidth />
            </FormControl>
            <FormControl>
              <FormLabel>Contraseña</FormLabel>
              <TextField type="password" value={password} onChange={(e) => setPassword(e.target.value)} required fullWidth />
            </FormControl>
            <FormControlLabel control={<Checkbox />} label="Remember me" />
            <ForgotPassword open={open} handleClose={handleClose} />
            <StyledButton type="submit" fullWidth variant="contained">Entrar</StyledButton>
            <Link
              component="button"
              type="button"
              onClick={handleClickOpen}
              variant="body2"
              sx={{ alignSelf: 'center', color: 'black', textDecoration: 'underline' }}
            >
              ¿Se te ha olvidado la contraseña? 
            </Link>
          </Box>
          <Divider>o</Divider>
          <GoogleButton fullWidth variant="outlined" startIcon={<GoogleIcon />} onClick={handleGoogleLogin}>
            Entrar con Google
          </GoogleButton>
          <Typography sx={{ textAlign: 'center'}}>
            ¿No tienes una cuenta? 
            <NavLink to="/signup" style={{ marginLeft: '10px', textDecoration: 'underline', color: 'black' }}>
              Regístrate
            </NavLink>
          </Typography>
        </Card>
      </Stack>
    </>
  );
}
