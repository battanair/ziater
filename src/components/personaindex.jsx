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
            // width: { xs: '200px', md: '250px' },
            /* height: { xs: '300px', md: '350px' },*/
            padding: 1,
            backgroundColor: 'white',
            borderRadius: '16px',
          }}
        >
          <img
          alt='foto de {nombrepersona}'
            src={fotito}
            style={{
              borderRadius: '8px',
              marginBottom: '16px',
              width: '100%',
              objectFit: 'cover',
            }}
          />
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
