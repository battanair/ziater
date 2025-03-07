import React from 'react';
import { Container, Typography, List, ListItem, ListItemText, Link, Button } from "@mui/material";

const PoliticaCookies = () => {
  const handleResetCookies = () => {
    localStorage.removeItem("cookieConsent");
    window.location.reload(); // Recargar para que vuelva a aparecer el aviso
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Política de Cookies
      </Typography>
      <Typography variant="body1" paragraph>
        En nuestra web usamos cookies para mejorar la experiencia del usuario. A continuación, te explicamos qué son las cookies, qué tipos utilizamos y cómo puedes gestionarlas.
      </Typography>

      <Typography variant="h5" gutterBottom>
        ¿Qué son las cookies?
      </Typography>
      <Typography variant="body1" paragraph>
        Las cookies son pequeños archivos de texto que los sitios web guardan en tu dispositivo cuando los visitas. Sirven para recordar información sobre tu navegación y mejorar la experiencia del usuario.
      </Typography>

      <Typography variant="h5" gutterBottom>
        Tipos de cookies que usamos
      </Typography>
      <List>
        <ListItem>
          <ListItemText primary="Cookies esenciales" secondary="Necesarias para el funcionamiento básico del sitio web." />
        </ListItem>
        <ListItem>
          <ListItemText primary="Cookies de análisis" secondary="Nos ayudan a entender cómo interactúan los usuarios con la web." />
        </ListItem>
        <ListItem>
          <ListItemText primary="Cookies de terceros" secondary="Proveedores externos pueden utilizar cookies para funcionalidades adicionales." />
        </ListItem>
        <ListItem>
          <ListItemText primary="Cookies de Firebase" secondary="Si usas nuestra función de inicio de sesión, Firebase Authentication puede almacenar cookies para gestionar la sesión del usuario." />
        </ListItem>
      </List>

      <Typography variant="h5" gutterBottom>
        ¿Cómo gestionar las cookies?
      </Typography>
      <Typography variant="body1" paragraph>
        Puedes aceptar o rechazar las cookies desde nuestro aviso de cookies. Además, puedes configurar tu navegador para bloquear o eliminar cookies en cualquier momento.
      </Typography>

      <Typography variant="body1" paragraph>
        Para más información sobre cómo gestionar cookies en tu navegador, consulta los siguientes enlaces:
      </Typography>
      <List>
        <ListItem>
          <Link href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener">
            Google Chrome
          </Link>
        </ListItem>
        <ListItem>
          <Link href="https://support.mozilla.org/es/kb/cookies-informacion-que-los-sitios-web-guardan-en-" target="_blank" rel="noopener">
            Mozilla Firefox
          </Link>
        </ListItem>
        <ListItem>
          <Link href="https://support.microsoft.com/es-es/help/17442/windows-internet-explorer-delete-manage-cookies" target="_blank" rel="noopener">
            Microsoft Edge
          </Link>
        </ListItem>
      </List>

      <Button onClick={handleResetCookies}>Cambiar preferencias de cookies</Button>
    </Container>
  );
};

export default PoliticaCookies;
