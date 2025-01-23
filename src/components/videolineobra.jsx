import Grid from '@mui/material/Grid'; // Versión estable de Grid
import Box from '@mui/material/Box';
import Personaindex from './personaindex';

const VideoLineObra = () => {
  return (
    <Box container sx={{marginTop: 4}}>
       <h5><b>TEXTO Y DIRECCIÓN DE:</b></h5>
      <Grid container spacing={2}>
        {/* Columna 1: Personaindex alineado a la izquierda */}
        <Grid item xs={12} md={6} container
  direction="row"
  sx={{
    justifyContent: "flex-start",
    alignItems: "center",
  }}> 
          <Grid
      container
      direction="row"
      alignItems="center"
      sx={{justifyContent: "flex-start"}}// Centra horizontalmente
      spacing={2} // Espaciado entre elementos
    >
          <Personaindex nombrepersona={"Director Directorez"} puestopersona={"Director"} />
          </Grid>
        </Grid>
        
        {/* Columna 2: Video con iframe */}
        <Grid item xs={12} md={6}>
          <Box sx={{
            position: 'relative',
            paddingTop: '56.25%', // Mantener proporción 16:9
            overflow: 'hidden',
            borderRadius: '8px',
          }}>
            <iframe
              src="https://www.youtube.com/embed/iwyiAHxZs7M?si=mq-U2bFnXzCVe72D"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
              }}
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default VideoLineObra;
