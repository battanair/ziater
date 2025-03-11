import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import Container from '@mui/material/Container';
import { routeConfig } from "./routing/routerConfig";
import Box from '@mui/material/Box';
import { AuthProvider } from "./components/AuthContext";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Navbar from './components/Navbar';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CookieConsent from "./components/CookieConsent";
import { CookieProvider } from "./context/CookieContext"; // Import CookieProvider
import Footer from './components/Footer';
import ReactGA from 'react-ga'; // Importa ReactGA

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
    ReactGA.initialize('G-DB63MNK8BK'); // Reemplaza 'YOUR_TRACKING_ID' con tu ID de seguimiento de Google Analytics

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user); // Si hay usuario, lo guarda, si no, lo deja en null
    });

    return () => unsubscribe(); // Limpieza al desmontar
  }, []);

  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  // Limpiar la URL
  useEffect(() => {
    const cleanUrl = () => {
      const url = window.location.href;
      const hashIndex = url.indexOf('#');
      if (hashIndex !== -1) {
        const cleanUrl = url.substring(0, hashIndex + 2) + url.substring(hashIndex + 2).split('/')[0];
        window.history.replaceState(null, null, cleanUrl);
      }
    };

    window.addEventListener('hashchange', cleanUrl);
    cleanUrl(); // Limpiar la URL al cargar la página

    return () => {
      window.removeEventListener('hashchange', cleanUrl);
    };
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CookieProvider>
        <AuthProvider>
          <Router>
            <div className="app">
              <Box sx={{ background: 'white', paddingBottom: '0px' }}>
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