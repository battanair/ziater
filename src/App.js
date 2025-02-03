import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { Routes, Route } from "react-router";
import Container from '@mui/material/Container';
import { routeConfig } from "./routing/routerConfig";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { NavLink } from 'react-router';




const App = () => (
  <div className="app">
   
    
    <Box sx={{background: 'lightgrey', paddingBottom: '50px'}}>
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
     <Container maxWidth="md" sx={{background: 'white', marginTop: '50px', marginBottom: '50px', boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', paddingLeft: 3, paddingRight:3 }}>
    
     <Routes>
        {routeConfig.map((item) => {
          return (
            <>
              <Route path={item.path} element={item.page} />
            </>
          );
        })}
      </Routes>
      </Container>
      </Box>
  </div>
);

export default App;

