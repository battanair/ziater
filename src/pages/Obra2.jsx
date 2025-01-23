import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';
import Rating from '@mui/material/Rating';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import { useParams } from 'react-router';
import { NavLink } from "react-router";

import Personaindex from '../components/personaindex';
import Imagenesobra from '../components/imagenesobra';
import { Premiosobra } from '../components/premiosobra';
import { Obracriticas } from '../components/Obracriticas';
import Item from '../components/item';


import { obras_db, relaciones_db, personas_db } from '../components/database';

const AntSwitch = styled(Switch)(({ theme }) => ({
  width: 28,
  height: 16,
  padding: 0,
  display: 'flex',
  '&:active': {
    '& .MuiSwitch-thumb': {
      width: 15,
    },
    '& .MuiSwitch-switchBase.Mui-checked': {
      transform: 'translateX(9px)',
    },
  },
  '& .MuiSwitch-switchBase': {
    padding: 2,
    '&.Mui-checked': {
      transform: 'translateX(12px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: 'black',
      },
    },
  },
  '& .MuiSwitch-thumb': {
    boxShadow: theme.shadows[1],
    width: 12,
    height: 12,
    borderRadius: 6,
    transition: theme.transitions.create(['width'], {
      duration: 200,
    }),
  },
  '& .MuiSwitch-track': {
    borderRadius: 16 / 2,
    opacity: 1,
    backgroundColor:
      theme.palette.mode === 'dark' ? '#177ddc' : '#aab4be',
    boxSizing: 'border-box',
  },
}));

const Obra2 = () => {
  const { id } = useParams(); // Capturamos el ID de la URL
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

  const [obraData, setObraData] = useState(null);
  const [elenco, setElenco] = useState([]);

  useEffect(() => {
    // Buscamos la obra correspondiente usando el id que viene de useParams()
    const obra = obras_db.find((obra) => obra.id_obra === Number(id));
    setObraData(obra); // Asignamos la obra encontrada al estado

    if (obra) {
      // Encuentra las relaciones asociadas con esta obra
      const relaciones = relaciones_db.filter((rel) => rel.obraId === obra.id_obra);

      // Genera el elenco con las personas asociadas
      const elencoData = relaciones.map((rel) => {
        const persona = personas_db.find((p) => p.id_persona === rel.personaId);
        return { ...persona, rol: rel.rol, personaje: rel.personaje };
      });

      setElenco(elencoData);
    }
  }, [id]); // Se ejecuta cada vez que el id cambia

  if (!obraData) {
    return <p>Cargando datos de la obra...</p>;
  }


  return (

    <><Grid container spacing={4} sx={{ paddingTop: 4, paddingLeft: 4}}>

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
          <Stack
            direction="row"
            spacing={1}
            sx={{
              justifyContent: "flex-end",
              alignItems: "center",
              marginBottom: 2
            }}
          >
            {obraData?.etiquetas_obra?.map((item, index) => (
              <Item key={index}>{item}</Item>
            ))}


            <Item
              sx={{
                width: 40, // Ajusta el tamaño del círculo
                height: 40,
                borderRadius: "50%", // Hace el objeto redondo
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "lightgrey", // Fondo opcional
                color: "black", // Color del texto opcional
                fontWeight: "bold", // Opcional para destacar la nota
              }}
            >
              {obraData.nota_obra}
            </Item>
          </Stack>
        </div>

        {/* Título con el año en la misma línea */}
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, marginBottom: 1 }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            {obraData.nombre_obra}
          </Typography>
          <Typography variant="h6" color="textSecondary" sx={{ fontSize: '1rem' }}>
            {obraData.anio_obra}
          </Typography>
        </Box>

        <Typography variant="body1" sx={{ fontWeight: 'bold', marginBottom: '8px' }}>
          SHOWPRIME Y CENTRO DRAMÁTICO NACIONAL
        </Typography>

        <Typography variant="body2" paragraph>
          {obraData.sinopsis_obra}
        </Typography>

        <Button variant="contained" sx={{ background: 'black', marginBottom: '40px' }} onClick={handleOpen}><h6><b>COMPRAR ENTRADAS</b></h6>
        </Button>
      </Grid>
    </Grid>


      <><Box container sx={{ marginTop: 4, paddingLeft: 3 }}>
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
              sx={{ justifyContent: "flex-start" }} // Centra horizontalmente
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
                }} />
            </Box>
          </Grid>
        </Grid>
      </Box><Grid
        container
        sx={{
          paddingTop: 4,
          paddingBottom: 8,
          textAlign: 'center',
        }}
        direction={'column'}
      >
          <Typography variant="h5" component="h5" sx={{ fontWeight: "bold", textAlign: "center" }}>
            ELENCO
          </Typography>

          <Stack
            direction="row"
            spacing={1}
            sx={{
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Typography>Original</Typography>
            <AntSwitch defaultChecked inputProps={{ 'aria-label': 'ant design' }} />

            <Typography>Actual</Typography>
          </Stack>

          <Grid
            container
            spacing={4}
            sx={{
              maxWidth: "100%", // Ancho máximo ajustado
              margin: '0 auto', // Asegura que el contenedor esté centrado
              marginTop: 3,
            }}
          >
            <Grid item xs={6} sm={3} md={3}>
            <NavLink to="/persona/1" style={{ textDecoration: 'none'}} > <Personaindex nombrepersona="Actriz Actrizer" puestopersona="Personaje 1" />
            </NavLink> </Grid>
            <Grid item xs={6} sm={3} md={3}>
              <Personaindex nombrepersona="Actor Actorez" puestopersona="Personaje 2" />
            </Grid>
            <Grid item xs={6} sm={3} md={3}>
              <Personaindex nombrepersona="Actriz Actrizer" puestopersona="Personaje 3" />
            </Grid>
            <Grid item xs={6} sm={3} md={3}>
              <Personaindex nombrepersona="Actor Actorez" puestopersona="Personaje 4" />
            </Grid>
          </Grid>

          <Grid

            container
            direction="row"
            sx={{
              justifyContent: 'space-around',
              alignItems: 'flex-start',
              marginTop: 3,
            }}
          >
            <Button
              variant="contained"
              size="large"
              sx={{ background: 'black' }}
            >
              <h5>
                <b>TODO EL EQUIPO</b>
              </h5>
            </Button>
          </Grid>
        </Grid><Imagenesobra imagen1="https://picsum.photos/400/300?random=1" imagen2="https://picsum.photos/400/300?random=2" imagen3="https://picsum.photos/400/300?random=3" imagen4="https://picsum.photos/400/300?random=4" imagen5="https://picsum.photos/400/300?random=5" /><Stack
          direction="column"
          spacing={4}
          sx={{
            justifyContent: "flex-start",
            alignItems: "center",
            paddingTop: 5,
            paddingBottom: 5,
          }}
        >
          <Typography variant="h5" component="h5" sx={{ fontWeight: "bold" }}>
            PREMIOS
          </Typography>

          <Stack
            direction={{ xs: "column", sm: "row" }} // Columnas en pantallas pequeñas, filas en grandes
            spacing={2}
            sx={{
              justifyContent: { xs: "center", sm: "space-around" }, // Centrado en pequeñas
              alignItems: "center", // Alineación vertical uniforme
              width: "100%", // Asegura que ocupe todo el ancho disponible
              paddingX: 2, // Margen horizontal en pantallas pequeñas
            }}
          >
            <Premiosobra premio="Premios MAX" year="2023" condecoracion="Mejor autoría" />
            <Premiosobra premio="Premios MAX" year="2023" condecoracion="Mejor autoría" />
            <Premiosobra premio="Premios MAX" year="2023" condecoracion="Mejor autoría" />
          </Stack>
        </Stack><Typography variant="h5" component="h5" sx={{ fontWeight: "bold", textAlign: "center" }}>
          CRÍTICAS
        </Typography><Stack
          direction={{ xs: 'column', sm: 'row' }} // Por defecto columna, en pantallas más grandes fila
          spacing={2}
          sx={{
            width: "100%",
            padding: 2,
            flexWrap: "wrap", // Permite que se envuelvan las críticas en dispositivos grandes
          }}
        >
          {/* Critica 1 */}
          <Obracriticas
            medio="La Gacetilla"
            texto="Esta es la crítica del primer medio. Darío Duarte, hijo de uruguayos, es un dramaturgo que a sus 45 años se enfrenta a su primer estreno en la Sala Grande del Teatro María Guerrero..."
            nota="9,5" />

          {/* Critica 2 */}
          <Obracriticas
            medio="Otro medio"
            texto="Darío Duarte, hijo de uruguayos, es un dramaturgo que a sus 45 años se enfrenta a su primer estreno en la Sala Grande del Teatro María Guerrero..."
            nota="8" />
        </Stack></>

      {/* Botón para ver todas las críticas */}
      <><Grid
        container
        direction="row"
        sx={{
          justifyContent: "space-around",
          alignItems: "flex-start",
          marginTop: 3,
        }}
      >
        <Button variant="contained" size="large" sx={{ background: 'black', marginBottom: '40px' }}>
          <h5><b>TODAS LAS CRÍTICAS</b></h5>
        </Button>
      </Grid><Modal
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
        </Modal></></>
  )
}

export default Obra2;