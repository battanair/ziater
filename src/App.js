import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import Container from '@mui/material/Container';
import { routeConfig } from "./routing/routerConfig";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Grid from '@mui/material/Grid';
import Buscador from './components/Buscador';
import { AuthProvider } from "./components/AuthContext";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Navbar from './components/Navbar';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CookieConsent from "./components/CookieConsent";
import { CookieProvider } from "./context/CookieContext"; // Import CookieProvider
import Footer from './components/Footer';

const App = () => {
  const theme = createTheme({
    palette: {
      primary: {
        main: "#000000", // Color principal negro
        dark: "#000000",  // Sobrescribe el azul oscuro
        light: "#000000",
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            color: "#000000",
            "&:hover": {
              backgroundColor: "#333333", // Cambia el fondo en hover
            },
            "&:focus": {
              backgroundColor: "#222222",
            },
            "&:active": {
              backgroundColor: "#111111",
            },
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: "#000000",
          },
        },
      },
      MuiTypography: {
        styleOverrides: {
          root: {
            color: "#000000",
          },
        },
      },
      MuiLink: {
        styleOverrides: {
          root: {
            color: "#000000",
            "&:hover": {
              color: "#333333",
            },
          },
        },
      },
    },
  });

  const [user, setUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const auth = getAuth();

  // Detectar cambios en la autenticación
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user); // Si hay usuario, lo guarda, si no, lo deja en null
    });

    return () => unsubscribe(); // Limpieza al desmontar
  }, []);

  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <ThemeProvider theme={theme}>
      <CookieProvider>
        <AuthProvider>
          <Router>
            <div className="app">
              <Box sx={{ background: 'white', paddingBottom: '50px' }}>
                <Box sx={{ flexGrow: 1 }}>
                  <Navbar />
                </Box>
                <Container maxWidth="md" sx={{ background: 'white', marginTop: '50px', marginBottom: '50px', boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', paddingLeft: 3, paddingRight: 3 }}>
                  <Routes>
                    {routeConfig.map(({ path, page }, index) => (
                      <Route key={index} path={path} element={page} />
                    ))}
                  </Routes>
                </Container>
                <Box sx={{ flexGrow: 1 }}>
                  <Footer />
                </Box>
              </Box>
              <CookieConsent /> {/* Asegúrate de que está aquí */}
            </div>
          </Router>
        </AuthProvider>
      </CookieProvider>
    </ThemeProvider>
  );
};

export default App;
