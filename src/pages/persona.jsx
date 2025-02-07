import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { NavLink } from 'react-router';


import { obras_db, relaciones_db, personas_db } from '../components/database';
import Imagenesobra from '../components/imagenesobra';
import Personaindex from '../components/personaindex';
import { Premiosobra } from '../components/premiosobra';


    const Persona = () => {
        const { id } = useParams(); // Capturamos el ID de la URL
        const [personaData, setPersonaData] = useState(null);
    
        useEffect(() => {
            // Realizar la petición a la API de Flask
            fetch(`/api/persona/${id}`)
                .then(response => response.json())
                .then(data => setPersonaData(data))
                .catch(error => console.error('Error:', error));
        }, [id]);
    

    if (!personaData) {
        return <p>Cargando datos de la persona...</p>;
    }

    return (
        <>
            <Grid container spacing={4} sx={{ paddingTop: 4, paddingBottom: 4, paddingLeft: 4}}>
                {/* Columna 1: Imagen */}
                <Grid item xs={12} md={4}>
                    <Box sx={{ textAlign: 'center' }}>
                        <img
                            src="{personaData.foto} "
                            alt="Persona"
                            style={{ width: '100%', borderRadius: '8px' }}
                        />
                    </Box>
                </Grid>

                {/* Columna 2: Texto */}
                <Grid item xs={12} md={8}>
                    <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, marginBottom: 1 }}>
                        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                        {personaData.nombre} 
                        </Typography>
                    </Box>

                    <Typography variant="body1" sx={{ fontWeight: 'bold', marginBottom: '8px' }}>
                        Actor, directos y Don Cojones.
                    </Typography>

                    <Typography variant="body2" paragraph>
                        {personaData.bio_persona}
                    </Typography>
                </Grid>
            </Grid>
            <Imagenesobra imagen1="https://picsum.photos/400/300?random=1" imagen2="https://picsum.photos/400/300?random=2" imagen3="https://picsum.photos/400/300?random=3" imagen4="https://picsum.photos/400/300?random=4" imagen5="https://picsum.photos/400/300?random=5" />

            <Grid
                container
                sx={{
                    marginTop: 5,
                    paddingBottom: 4,

                    textAlign: 'center',
                }}
                direction={'column'}
            >
                <Typography variant="h5" component="h5" sx={{ fontWeight: "bold", textAlign: "center" }}>
                    OBRAS RELACIONADAS
                </Typography>
                <Grid
                    container
                    spacing={4}
                    sx={{
                        maxWidth: "100%", // Ancho máximo ajustado
                        margin: '0 auto', // Asegura que el contenedor esté centrado
                    }}
                >
                    <Grid item xs={6} sm={3} md={3}>
                        <NavLink to="/obra/1" style={{ textDecoration: 'none' }} > <Personaindex nombrepersona="Obra 1" puestopersona="Personaje 1" />
                        </NavLink> </Grid>
                    <Grid item xs={6} sm={3} md={3}>
                        <Personaindex nombrepersona="Obra 2" puestopersona="Dirección" />
                    </Grid>
                    <Grid item xs={6} sm={3} md={3}>
                        <Personaindex nombrepersona="Obra con título mas largo" puestopersona="Personaje 3" />
                    </Grid>
                    <Grid item xs={6} sm={3} md={3}>
                        <Personaindex nombrepersona="Bueno hay que poner más obritas" puestopersona="Personaje 4" />
                    </Grid>
                </Grid>
            </Grid>


            <Box sx={{ marginTop: 5, paddingBottom: 5 }}>

                <Accordion defaultExpanded>
                    <AccordionSummary className="perheadlist"
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1-content"
                        id="panel1-header"
                    >
                        <h5>ELENCO</h5>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Stack direction="horizontal" spacing={2} alignItems="center">
                            <img
                                src="https://picsum.photos/200/300"
                                alt="Obra"
                                style={{ width: '70px', borderRadius: '8px' }} />

                            <Typography className="perlistaobra"
                                variant="body1"
                                sx={{
                                    lineHeight: 1.2,
                                    color: '#333',
                                    fontSize: '1rem',
                                }}
                            ><b>MISERICORDIA</b> <br></br><>(2015)</> <br></br> Impro

                            </Typography>

                        </Stack>
                    </AccordionDetails>
                </Accordion>

                <Accordion>
                    <AccordionSummary className="perheadlist"
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1-content"
                        id="panel1-header"
                    >
                        <h5>ELENCO</h5>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Stack direction="horizontal" spacing={2} alignItems="center">
                            <img
                                src="https://picsum.photos/200/300"
                                alt="Obra"
                                style={{ width: '70px', borderRadius: '8px' }} />

                            <Typography className="perlistaobra"
                                variant="body1"
                                sx={{
                                    lineHeight: 1.2,
                                    color: '#333',
                                    fontSize: '1rem',
                                }}
                            ><b>MISERICORDIA</b> <br></br><>(2015)</> <br></br> Impro

                            </Typography>

                        </Stack>
                    </AccordionDetails>
                </Accordion>
            </Box>
            <Typography variant="h5" component="h5" sx={{ fontWeight: "bold", textAlign: "center", marginTop: 5, marginBottom: 3 }}>
                PPREMIOS          
            </Typography>

            <Stack
                direction={{ xs: "column", sm: "row" }} // Columnas en pantallas pequeñas, filas en grandes
                spacing={2}
                sx={{
                    justifyContent: { xs: "center", sm: "space-around" }, // Centrado en pequeñas
                    alignItems: "center", // Alineación vertical uniforme
                    width: "100%", // Asegura que ocupe todo el ancho disponible
                    paddingX: 2, // Margen horizontal en pantallas pequeñas
                    paddingBottom: 5
                }}
            >
                <Premiosobra premio="Premios MAX" year="2023" condecoracion="Mejor interpretación" />
                <Premiosobra premio="Premios MAX" year="2023" condecoracion="Mejor guapisimo" />
                <Premiosobra premio="Premios MAX" year="2023" condecoracion="Mejor ole tu " />
            </Stack>


        </>
    );
};

export default Persona;
