import * as React from 'react';
import { useState } from 'react';
import { signInWithEmailAndPassword } from "firebase/auth";
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
import { NavLink } from 'react-router';

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

export default function SignIn(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("Login successful");
    } catch (error) {
      console.error("Login error:", error);
      setError("Invalid email or password");
    }
  };

  return (
   <>
      <CssBaseline enableColorScheme />
      <Stack direction="column" justifyContent="space-between" sx={{marginBottom: '50px', padding: 2 }}>
        <Card variant="outlined">
          <Typography component="h1" variant="h4">Inicia sesión</Typography>
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
            <Button type="submit" fullWidth variant="contained">Entrar</Button>
            <Link
              component="button"
              type="button"
              onClick={handleClickOpen}
              variant="body2"
              sx={{ alignSelf: 'center' }}
            >
              ¿Se te ha olvidado la contraseña? 
            </Link>
          </Box>
          <Divider>or</Divider>
          <GoogleLogin />
          <Typography sx={{ textAlign: 'center'}}>
            ¿No tienes una cuenta? 
            <NavLink to="/Signup" style={{  marginLeft: '10px', textDecoration: 'none', color: 'blue' }}>
                Signup
            </NavLink>
          </Typography>
        </Card>
      </Stack></>
   
  );
}
