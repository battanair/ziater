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
import { CookieProvider } from "./context/CookieContext";
import Footer from './components/Footer';
import ReactGA from 'react-ga';
import { Helmet, HelmetProvider } from "react-helmet-async";


const App = () => {
  const theme = createTheme({
    palette: {
      primary: {
        main: "#000000",
        dark: "#000000",
        light: "#000000",
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            color: "#000000",
            "&:hover": {
              backgroundColor: "#333333",
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

  useEffect(() => {
    ReactGA.initialize('G-DB63MNK8BK');

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

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
    cleanUrl();

    return () => {
      window.removeEventListener('hashchange', cleanUrl);
    };
  }, []);

  return (
    <HelmetProvider>
      <ThemeProvider theme={theme}>
        <CookieProvider>
          <AuthProvider>
            <Router>
              <div className="app" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                {/* Navbar ocupa el 100% del ancho */}
                <Box sx={{ position: 'relative', zIndex: 1 }}>
                  <Navbar />
                </Box>

                {/* Contenido principal con anuncios */}
                <Box 
                  sx={{ 
                    display: 'flex', 
                    flexDirection: 'row', 
                    flexGrow: 1, 
                    background: 'white', 
                    paddingBottom: '0px', 
                    overflowX: 'hidden' // Evita desbordamiento horizontal
                  }}
                >
                  {/* Anuncio izquierdo */}
                  <Box 
                    sx={{ 
                      width: { xs: '0%', md: '15%' }, // Oculta completamente en móviles
                      display: { xs: 'none', md: 'block' }, 
                      padding: { xs: 0, md: '10px' }, // Sin padding en móviles
                      overflow: 'hidden' // Asegura que no causen desbordamiento
                    }}
                  >
                    <div>
                      <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9551802011924727" crossorigin="anonymous"></script>
                      <ins className="adsbygoogle"
                        style={{ display: 'block' }}
                        data-ad-format="autorelaxed"
                        data-ad-client="ca-pub-9551802011924727"
                        data-ad-slot="7712261684"></ins>
                      <script>
                        (adsbygoogle = window.adsbygoogle || []).push({});
                      </script>
                    </div>
                  </Box>

                  {/* Contenido principal */}
                  <Box sx={{ flexGrow: 1, width: '100%' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
                      <Container 
                        maxWidth="md" 
                        sx={{ 
                          background: 'white', 
                          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', 
                          paddingLeft: { xs: 1, md: 3 }, 
                          paddingRight: { xs: 1, md: 3 }, 
                          overflowX: 'hidden', // Evita desbordamiento horizontal
                          width: '100%' // Asegura que no exceda el ancho
                        }}
                      >
                        <Routes>
                          {routeConfig.map(({ path, page }, index) => (
                            <Route key={index} path={path} element={page} />
                          ))}
                        </Routes>
                      </Container>
                    </Box>
                  </Box>

                  {/* Anuncio derecho */}
                  <Box 
                    sx={{ 
                      width: { xs: '0%', md: '15%' }, // Oculta completamente en móviles
                      display: { xs: 'none', md: 'block' }, 
                      padding: { xs: 0, md: '10px' }, // Sin padding en móviles
                      overflow: 'hidden' // Asegura que no causen desbordamiento
                    }}
                  >
                    <div>
                      <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9551802011924727" crossorigin="anonymous"></script>
                      <ins className="adsbygoogle"
                        style={{ display: 'block' }}
                        data-ad-format="autorelaxed"
                        data-ad-client="ca-pub-9551802011924727"
                        data-ad-slot="7712261684"></ins>
                      <script>
                        (adsbygoogle = window.adsbygoogle || []).push({});
                      </script>
                    </div>
                  </Box>
                </Box>

                {/* Footer ocupa el 100% del ancho */}
                <Box sx={{ width: '100%' }}>
                  <Footer />
                </Box>

                <CookieConsent />
              </div>
            </Router>
          </AuthProvider>
        </CookieProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
};

export default App;