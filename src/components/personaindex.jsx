import Grid from '@mui/material/Grid';
import { Box, Typography, Paper } from '@mui/material';

const Personaindex = ({nombrepersona, puestopersona, fotito}) => {
  return (
    <Grid item>
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
          maxWidth: '173px', // Ancho máximo del componente
        }}
      >
        <Box
          sx={{
            width: '157px',
            height: '237px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            borderRadius: '8px',
            marginBottom: '16px',
          }}
        >
          <img
            alt={`Foto de ${nombrepersona}`} 
            src={fotito}
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
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
