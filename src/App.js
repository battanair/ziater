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
import Buscador from './components/Buscador'
import Grid from '@mui/material/Grid2';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';

const App = () => {
  const [auth, setAuth] = React.useState(true);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleChange = (event) => {
    setAuth(event.target.checked);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className="app">
      <Box sx={{ background: 'lightgrey', paddingBottom: '50px' }}>
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static" sx={{
            backgroundColor: 'white',
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
            p: 1,
            width: '100%'
          }}>
            <Toolbar variant="dense">
              <Grid
                container
                direction="row"
                sx={{
                  justifyContent: "space-around",
                  alignItems: "center",
                  width: '100%'
                }}
              >
                <Grid>
                  <NavLink to="/"><img src="../logoziater.png" alt="Logo" style={{ height: "60px", marginLeft: "10px" }} /></NavLink>
                </Grid>
                <Grid>
                  <Buscador />
                </Grid>

                {auth && (
                  <Grid>
                    <IconButton
                      size="large"
                      aria-label="account of current user"
                      aria-controls="menu-appbar"
                      aria-haspopup="true"
                      onClick={handleMenu}
                      color="inherit"
                    >
                      <AccountCircle  sx={{color: 'black', fontSize: '3rem'}}/>
                    </IconButton>
                    <Menu
                      id="menu-appbar"
                      anchorEl={anchorEl}
                      anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                      }}
                      keepMounted
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                      }}
                      open={Boolean(anchorEl)}
                      onClose={handleClose}
                    >
                      <MenuItem onClick={handleClose}>
                      <NavLink to="/dashboard" style={{ marginRight: '10px', textDecoration: 'none', color: 'black' }}>
                          Mi Cuenta
                      </NavLink>
                      </MenuItem>
                      <MenuItem onClick={handleClose}>My account</MenuItem>
                    </Menu>
                  </Grid>)}
              </Grid>
            </Toolbar>
          </AppBar>
        </Box>

        <Container maxWidth="md" sx={{ background: 'white', marginTop: '50px', marginBottom: '50px', boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', paddingLeft: 3, paddingRight: 3 }}>
          <Routes>
            {routeConfig.map((item) => (
              <Route key={item.path} path={item.path} element={item.page} />
            ))}
          </Routes>
        </Container>
      </Box>
    </div>
  );
};

export default App;
