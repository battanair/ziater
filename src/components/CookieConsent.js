import React, { useState, useEffect } from "react";
import { Snackbar, Button, Box } from "@mui/material";
import { Alert } from "@mui/material";
import { NavLink } from "react-router-dom";
import { useCookieContext } from '../context/CookieContext';

const CookieConsent = () => {
  const { cookieConsent, setCookieConsent } = useCookieContext();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!cookieConsent) {
      setOpen(true);
    }
  }, [cookieConsent]);

  const handleAccept = () => {
    localStorage.setItem("cookieConsent", "accepted");
    setCookieConsent("accepted");
    setOpen(false);
  };

  const handleReject = () => {
    localStorage.setItem("cookieConsent", "rejected");
    setCookieConsent("rejected");
    setOpen(false);
  };

  return (
    <Snackbar
      open={open}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      sx={{ 
        '& .MuiPaper-root': { 
          backgroundColor: 'white', 
          border: '1px solid black',
          color: 'black'
        } 
      }}
    >
      <Alert
        severity="info"
        sx={{ 
          color: 'black',
          '& .MuiAlert-icon': {
            color: 'black'
          }
        }}
        action={
          <Box>
            <Button 
              color="inherit" 
              size="small" 
              onClick={handleAccept}
              sx={{ 
                color: 'black', 
                backgroundColor: 'white', 
                border: '1px solid black',
                marginRight: '8px',
                '&:hover, &:active': {
                  backgroundColor: 'black',
                  color: 'white'
                }
              }}
            >
              Aceptar
            </Button>
            <Button 
              color="inherit" 
              size="small" 
              onClick={handleReject}
              sx={{ 
                color: 'black', 
                backgroundColor: 'white', 
                border: '1px solid black',
                marginRight: '8px',
                '&:hover, &:active': {
                  backgroundColor: 'black',
                  color: 'white'
                }
              }}
            >
              Rechazar
            </Button>
            <NavLink to="/politica-de-cookies" style={{ textDecoration: 'none', color: 'inherit' }}>
              <Button 
                color="inherit" 
                size="small"
                sx={{ 
                  color: 'black', 
                  backgroundColor: 'white', 
                  border: '1px solid black',
                  '&:hover, &:active': {
                    backgroundColor: 'black',
                    color: 'white'
                  }
                }}
              >
                Más info
              </Button>
            </NavLink>
          </Box>
        }
      >
        Usamos cookies para mejorar tu experiencia.
      </Alert>
    </Snackbar>
  );
};

export default CookieConsent;
