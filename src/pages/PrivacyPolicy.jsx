import React from "react";
import { Container, Typography, Box, Link } from '@mui/material';

const PrivacyPolicy = () => {
  return (
    <Container maxWidth="lg" sx={{ padding: 4, height: '100%' }}>
      <Box sx={{ bgcolor: 'white', p: 6, boxShadow: 3, borderRadius: 2 }}>
        <Typography variant="h3" component="h1" align="center" color="primary" gutterBottom>
          Política de Privacidad
        </Typography>
        <Typography variant="body2" color="textSecondary" align="center" gutterBottom>
          Fecha de entrada en vigor: 10/03/2025
        </Typography>
        
        <Box mb={6}>
          <Typography variant="h5" component="h2" color="secondary" gutterBottom>
            1. Información que recopilamos
          </Typography>
          <ul>
            <li><strong>Información de autenticación:</strong> Recopilamos datos a través de Firebase Authentication.</li>
            <li><strong>Información de perfil:</strong> Datos como biografía, redes sociales o fotografías.</li>
            <li><strong>Contenido proporcionado por el usuario:</strong> Publicaciones, reseñas y comentarios.</li>
            <li><strong>Datos de uso y tecnología:</strong> Información sobre acceso y cookies.</li>
          </ul>
        </Box>
        
        <Box mb={6}>
          <Typography variant="h5" component="h2" color="secondary" gutterBottom>
            2. Uso de la información
          </Typography>
          <Typography variant="body1" color="textPrimary">
            Utilizamos la información recopilada para permitir el acceso a Ziater.com, personalizar tu experiencia y mejorar la plataforma.
          </Typography>
        </Box>
        
        <Box mb={6}>
          <Typography variant="h5" component="h2" color="secondary" gutterBottom>
            3. Compartición de información
          </Typography>
          <Typography variant="body1" color="textPrimary">
            No vendemos tu información, pero podríamos compartirla con proveedores de servicios y cumplir con requisitos legales.
          </Typography>
        </Box>
        
        <Box mb={6}>
          <Typography variant="h5" component="h2" color="secondary" gutterBottom>
            4. Seguridad de los datos
          </Typography>
          <Typography variant="body1" color="textPrimary">
            Implementamos medidas de seguridad, pero recomendamos utilizar contraseñas seguras.
          </Typography>
        </Box>
        
        <Box mb={6}>
          <Typography variant="h5" component="h2" color="secondary" gutterBottom>
            5. Derechos del usuario
          </Typography>
          <Typography variant="body1" color="textPrimary">
            Puedes acceder, corregir o eliminar tu información personal y solicitar la eliminación de tu cuenta.
          </Typography>
        </Box>
        
        <Box mb={6}>
          <Typography variant="h5" component="h2" color="secondary" gutterBottom>
            6. Contacto
          </Typography>
          <Typography variant="body1" color="textPrimary">
            Si tienes dudas, contáctanos en <Link href="mailto:ziaterapp@gmail.com" color="primary">ziaterapp@gmail.com</Link>.
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default PrivacyPolicy;
