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
          <Grid>
            <NavLink to="/"><img src="../logoziater.png" alt="Logo" style={{ height: "60px", marginLeft: "10px" }} /></NavLink>
          </Grid>
          <Grid>
            <Buscador />
          </Grid>

          {/* Si el usuario NO está logueado, mostramos login y signup */}
          {!user && (
            <Grid>
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
            <Grid>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle sx={{ color: 'black', fontSize: '3rem' }} />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                keepMounted
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleClose}>
                  <NavLink to="/dashboard" style={{ textDecoration: 'none', color: 'black' }}>
                    Dashboard
                  </NavLink>
                </MenuItem>
                <MenuItem onClick={logout}>
                  Cerrar sesión
                </MenuItem>
              </Menu>
            </Grid>
          )}
        </Grid>
      </Toolbar>
    </AppBar>
  );
}
