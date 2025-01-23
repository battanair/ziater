import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { NavLink } from 'react-router';

export default function Navbar() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{
          backgroundColor: 'white',
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', // Sombra sutil debajo
          p: 1,
        }}>
        <Toolbar variant="dense">
          <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 , color: 'black'}}>
            <MenuIcon />
          </IconButton>
          <NavLink to="/"><img src="../logoziater.png" alt="Logo" style={{ height: "60px", marginLeft: "10px" }} /></NavLink>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
