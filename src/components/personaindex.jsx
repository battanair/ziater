import Grid from '@mui/material/Grid';
import { Box, Typography, Paper } from '@mui/material';

const Personaindex = ({nombrepersona, puestopersona, fotito}) => {
  return (
    <Grid item sx={{ width: '173px', height: 'auto' }}>
      <Paper
        elevation={3}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 1,
          backgroundColor: 'white',
          borderRadius: '16px',
          width: '100%', // Asegura que el componente sea responsivo
        }}
      >
        <Box
          sx={{
            width: '100%',
            height: 0,
            paddingBottom: '150%', // Proporción de 2:3 (altura:ancho)
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            borderRadius: '8px',
            marginBottom: '16px',
            position: 'relative',
          }}
        >
          <Box
            component="img"
            alt={`Foto de ${nombrepersona}`} 
            src={fotito}
            sx={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
              objectPosition: 'center', // Centra la imagen tanto vertical como horizontalmente
              display: 'block',
              margin: 'auto', // Centra la imagen dentro del contenedor
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
          />
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
          }}
        >
          <Typography
            variant="body1"
            sx={{
              lineHeight: 1.2,
              color: '#333',
              fontSize: '0.8rem',
            }}
          >
            <b>{nombrepersona}</b>
            <br />
            {puestopersona}
          </Typography>
        </Box>
      </Paper>
    </Grid>
  );
};

export default Personaindex;
