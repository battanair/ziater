import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import MenuIcon from '@mui/icons-material/Menu';
import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Grid from '@mui/material/Grid';
import Buscador from '../components/Buscador';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import handleLogout from './logout'; // Asegúrate de que esto está bien exportado
import { Button } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import logomini from '../logomini.PNG';

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const auth = getAuth();

  // Detectar cambios en la autenticación
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user); // Guarda el usuario si está logueado, si no, lo deja en null
    });

    return () => unsubscribe(); // Cleanup al desmontar
  }, []);

  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const logout = () => {
    handleLogout(); // Ejecuta la función de logout
    handleClose(); // Cierra el menú después de hacer logout
  };

  return (
    <AppBar position="static" sx={{
      backgroundColor: 'white',
      boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
      p: 1,
      width: '100%'
    }}>
      <Toolbar variant="dense">
        <Grid container direction="row" sx={{ justifyContent: "space-around", alignItems: "center", width: '100%' }}>
          <Grid item sx={{ mb: { xs: 2, sm: 0 } }}>
            <NavLink to="/"><img src={logomini} alt="Logo" style={{ height: "135px", marginLeft: "10px" }} /></NavLink>
          </Grid>
          <Grid item sx={{ mb: { xs: 2, sm: 0 } }}>
            <Buscador />
          </Grid>

          {/* Si el usuario NO está logueado, mostramos login y signup */}
          {!user && (
            <Grid item sx={{ mb: { xs: 2, sm: 0 } }}>
              <NavLink to="/login" style={{ marginRight: '10px', textDecoration: 'none', color: 'black' }}>
                Entrar
              </NavLink>
              <NavLink to="/signup" style={{ marginRight: '10px', textDecoration: 'none', color: 'black' }}>
                Registrarse
              </NavLink>
            </Grid>
          )}

          {/* Si el usuario está logueado, mostramos el menú */}
          {user && (
            <Grid item sx={{ mb: { xs: 2, sm: 0 } }}>
              <NavLink to="/dashboard" style={{ textDecoration: "none" }}>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "black",
                    color: "white",
                    "&:hover": { backgroundColor: "#333" },
                    textTransform: "none",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <AccountCircleIcon />
                  Tu cuenta
                </Button>
              </NavLink>
            </Grid>
          )}
        </Grid>
      </Toolbar>
    </AppBar>
  );
}
