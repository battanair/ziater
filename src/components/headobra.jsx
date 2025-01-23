import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';
import Categoriaobra from './indexobra'; 
import Rating from '@mui/material/Rating';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import React, { useState } from 'react';



const HeaderObra = () => {


  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '90%', md: '55%' },
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => {
    setExpanded((prev) => !prev);
  };

  return (

    <><Grid container spacing={4}  sx={{ paddingTop: 4 }}>
      {/* Columna 1: Imagen */}
      <Grid item xs={12} md={4}>
        <Box sx={{ textAlign: 'center' }}>
          <img
            src="https://picsum.photos/200/300"
            alt="Obra"
            style={{ width: '100%', borderRadius: '8px' }} />
        </Box>
      </Grid>

      {/* Columna 2: Texto */}
      <Grid item xs={12} md={8}>
        {/* Componente Categoriaobra agregado encima del título con separación */}
        <div className="linea">
          <Rating name="half-rating" defaultValue={2} precision={1} />
          <Categoriaobra categoria1="Teatro" categoria2="Comedia" nota="10" />
        </div>

        {/* Título con el año en la misma línea */}
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, marginBottom: 1 }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            LA FIESTA DE LA DEMOCRACIA
          </Typography>
          <Typography variant="h6" color="textSecondary" sx={{ fontSize: '1rem' }}>
            (2024)
          </Typography>
        </Box>



        <Typography variant="body1" sx={{ fontWeight: 'bold', marginBottom: '8px' }}>
          SHOWPRIME Y CENTRO DRAMÁTICO NACIONAL
        </Typography>

        <Typography variant="body2" paragraph>
          
            <>
              Darío Duarte, hijo de uruguayos, es un dramaturgo que a sus 45 años se enfrenta a su primer
              estreno en la Sala Grande del Teatro María Guerrero. Cuando hace un curso con el también
              uruguayo Sergio Blanco, este le recomienda que escriba sobre el acontecimiento más relevante
              de su infancia. En 1983, el gobierno socialista de Felipe González fletó un avión para que
              casi doscientos hijos de exiliados y presos políticos uruguayos viajaran a su país para pasar
              la Nochevieja con sus familias.
              
    </>
        </Typography>
        <Button variant="contained" sx={{ background: 'black', marginBottom: '40px' }} onClick={handleOpen}><h6><b>COMPRAR ENTRADAS</b></h6>
        </Button>
      </Grid>
    </Grid>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Comprar entradas
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Aquí irá una dara grid jeje
          </Typography>
        </Box>
      </Modal></>
  );
}

export default HeaderObra;