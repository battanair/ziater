import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebaseConfig';
import { doc, getDoc, collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import { NavLink } from 'react-router-dom';
import Item from '../components/item';
import Personaindex from '../components/personaindex';
import { styled } from '@mui/material/styles';
import Switch from '@mui/material/Switch';
import Imagenesobra from '../components/imagenesobra';
import { Premiosobra } from '../components/premiosobra';
import { Obracriticas } from '../components/Obracriticas';
import EntradasObra from '../components/EntradasObra';

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

const extractVideoId = (url) => {
  const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const matches = url.match(regex);
  return matches ? matches[1] : null;
};

const Obra2 = () => {
  const { id } = useParams();
  const [obraData, setObraData] = useState(null);
  const [elenco, setElenco] = useState([]);
  const [open, setOpen] = useState(false);
  const [productoras, setProductoras] = useState([]);
  const [premios, setPremios] = useState([]);
  const [criticas, setCriticas] = useState([]);



  const [showCurrentActors, setShowCurrentActors] = useState(true); // Estado para el switch

  const handleSwitchChange = (event) => {
    setShowCurrentActors(event.target.checked);
  };

  // Filtramos el elenco para que solo muestre actores
  const filteredElenco = elenco.filter((persona) => {
    if (persona.rol !== "Actor") return false; // Solo actores

    if (showCurrentActors) {
      return persona.fecha_fin === 0; // Si el switch está activado, solo actores con fecha_fin: 0
    } else {
      return persona.fecha_inicio === obraData.anoinicio; // Si está desactivado, actores que empezaron el año de anoinicio de la obra
    }
  });




  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  useEffect(() => {
    const fetchObra = async () => {
      try {
        const obraRef = doc(db, 'obra', id);
        const obraSnap = await getDoc(obraRef);
  
        if (obraSnap.exists()) {
          setObraData(obraSnap.data());
        } else {
          console.error('La obra no existe en Firestore.');
        }
      } catch (error) {
        console.error('Error obteniendo la obra:', error);
      }
    };
  
    const fetchProductoras = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "productoras"));
        const productorasData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));
        setProductoras(productorasData);
      } catch (error) {
        console.error("Error obteniendo productoras:", error);
      }
    };
  
    const fetchElenco = async () => {
      try {
        const relacionesQuery = query(collection(db, 'persona_obra'), where('id_obra', '==', id));
        const relacionesSnap = await getDocs(relacionesQuery);
  
        let elencoTemp = [];
        for (const relDoc of relacionesSnap.docs) {
          const relData = relDoc.data();
          console.log("Relación encontrada:", relData);
  
          const personaRef = doc(db, 'persona', relData.id_persona);
          const personaSnap = await getDoc(personaRef);
  
          if (personaSnap.exists()) {
            const personaData = personaSnap.data();
            console.log("Persona encontrada:", personaData);
  
            elencoTemp.push({
              id: personaSnap.id,
              nombre: personaData.Nombre,
              apellidos: personaData.Apellidos,
              foto: personaData.foto,
              instagram: personaData.instagram,
              rol: relData.puesto,
              personaje: relData.titulo,
              fecha_inicio: relData.fecha_inicio,
              fecha_fin: relData.fecha_fin
            });
          }
        }
        console.log("Elenco final:", elencoTemp);
        setElenco(elencoTemp);
      } catch (error) {
        console.error('Error obteniendo el elenco:', error);
      }
    };
  
    const fetchCriticas = async () => {
      try {
        console.log("Buscando críticas para la obra con id:", id);
        const criticasQuery = query(
          collection(db, 'criticas'),
          where('id_obra', '==', id),
          limit(2) // Si necesitas solo 2 críticas
        );
    
        const querySnapshot = await getDocs(criticasQuery);
        console.log("Número de críticas encontradas:", querySnapshot.size);
    
        const criticasData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
    
        console.log("Críticas obtenidas:", criticasData);
        setCriticas(criticasData);
      } catch (error) {
        console.error("Error obteniendo críticas:", error);
      }
    };
    

    
    const fetchPremios = async () => {
      try {
        const premiosQuery = query(collection(db, "premios_obras"), where("id_obra", "==", id));
        const premiosSnap = await getDocs(premiosQuery);
    
        let premiosTemp = [];
    
        for (const premioDoc of premiosSnap.docs) {
          const premioData = premioDoc.data();
    
          // Obtener el nombre del premio desde la colección "premios"
          const premioRef = doc(db, "premios", premioData.id_premio);
          const premioSnap = await getDoc(premioRef);
    
          if (premioSnap.exists()) {
            const nombrePremio = premioSnap.data().nombre_premio;
    
            premiosTemp.push({
              id: premioDoc.id,
              id_premio: premioData.id_premio || "sin-id",
              nombre: nombrePremio,  // <--- Aquí guardas el nombre del premio
              año: premioData.anio_premio || "Año desconocido",
              categoria: premioData.galardon || "Categoría desconocida",
            }
            );
          }
        }
    
        console.log("Premios obtenidos:", premiosTemp);
        setPremios(premiosTemp);
      } catch (error) {
        console.error("Error obteniendo los premios:", error);
      }
    };
    
  
    if (id) {
      fetchObra();
      fetchElenco();
      fetchProductoras();
      fetchPremios();
      fetchCriticas(); // Llamada para obtener los premios
    }
  }, [id]);
  



  if (!obraData) {
    return <p>Cargando datos de la obra...</p>;
  }
  const director = elenco.find(persona => persona.rol === "Dirección");
  const dramaturgo = elenco.find(persona => persona.rol === "Dramaturgia");

  return (
    <><Grid container spacing={4} sx={{ paddingTop: 4, paddingLeft: 4 }}>

      {/* Columna 1: Imagen */}

      <Grid item xs={12} md={4}>
        <Box sx={{ textAlign: 'center' }}>
          <img
            src={obraData.cartel}
            alt={obraData.titulo}
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
            {obraData.categoria?.map((item, index) => (
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
              {obraData.nota}
            </Item>
          </Stack>
        </div>

        {/* Título con el año en la misma línea */}
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, marginBottom: 1 }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            {obraData.titulo}
          </Typography>
          <Typography variant="h6" color="textSecondary" sx={{ fontSize: '1rem' }}>
            ({obraData.anoinicio} - {obraData.anofin === 0 ? "actualmente" : obraData.anofin})
          </Typography>
        </Box>


        <Typography variant="body1" sx={{ fontWeight: "bold", marginBottom: "8px" }}>
          {productoras.length > 0
            ? productoras.map((prod, index) => (
              <NavLink
                key={prod.id || index}
                to={`/compania/${prod.id}`}
                style={{ textDecoration: 'none', marginRight: '5px', color: 'black' }}
              >
                {prod.nombre_prod}
              </NavLink>
            ))
            : ""}
        </Typography>


        <Typography variant="body2" paragraph>
          {obraData.sinopsis}
        </Typography>

        <Button variant="contained" sx={{ background: 'black', marginBottom: '40px' }} onClick={handleOpen}><h6><b>COMPRAR ENTRADAS</b></h6>
        </Button>
      </Grid>
    </Grid>


    <><Box container sx={{ marginTop: 4, paddingLeft: 3 }}>
  <Grid container spacing={2} direction="row" sx={{
    justifyContent: "space-around",
    alignItems: "center",
  }}>
    {/* Columna 1: Dirección y Dramaturgia */}
    <Grid item xs={12} md={6}>
  {/* Si la misma persona es director y dramaturgo */}
  {director && dramaturgo && director.id === dramaturgo.id ? (
    <>
      <h5><b>Dramaturgia y Dirección de:</b></h5>
      <Personaindex nombrepersona={director.nombre} puestopersona={"Dramaturgia y Dirección"} />
    </>
  ) : (
    <Grid container spacing={2}>
      {/* Si hay director, pero no es el mismo que el dramaturgo */}
      {director && (
        <Grid item xs={6} sm={6}>
          <h5><b>Dirección de:</b></h5>
          <NavLink to={`/persona/${director.id}`} style={{ textDecoration: 'none' }}>
            <Personaindex nombrepersona={director.nombre} puestopersona={"Dirección"} fotito={director.foto}/>
          </NavLink>
        </Grid>
      )}

      {/* Si hay dramaturgo, pero no es el mismo que el director */}
      {dramaturgo && (
        <Grid item xs={6} sm={6}>
          <h5><b>Dramaturgia de:</b></h5>
          <NavLink to={`/persona/${dramaturgo.id}`} style={{ textDecoration: 'none' }}>
            <Personaindex nombrepersona={dramaturgo.nombre} puestopersona={"Dramaturgia"} fotito={dramaturgo.foto} />
          </NavLink>
        </Grid>
      )}
    </Grid>
  )}
</Grid>



    {/* Columna 2: Video con iframe */}
    <Grid item xs={12} md={6}>
      <Box sx={{
        position: 'relative',
        paddingTop: '56.25%', // Mantener proporción 16:9
        overflow: 'hidden',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Añadir sombra

      }}>
        <iframe
    src={`https://www.youtube.com/embed/${extractVideoId(obraData.trailer)}`}
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

      
      
      <Grid
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
          <AntSwitch checked={showCurrentActors} onChange={handleSwitchChange} inputProps={{ 'aria-label': 'ant design' }} />
          <Typography>Actual</Typography>
        </Stack>

        <Grid
          container
          spacing={4}
          sx={{
            maxWidth: "100%",
            margin: '0 auto',
            marginTop: 3,
          }}
        >
          {filteredElenco.map((persona, index) => (
            <Grid item xs={6} sm={3} key={index}>
              <NavLink to={`/persona/${persona.id}`} style={{ textDecoration: 'none' }}>
                <Personaindex nombrepersona={persona.nombre} puestopersona={persona.personaje} fotito={persona.foto} />
              </NavLink>
            </Grid>
          ))}
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
          <NavLink to={`/Todoelequipo/${id}`} style={{ textDecoration: 'none' }}>
          <Button
            variant="contained"
            size="large"
            sx={{ background: 'black' }}
          >
            <h5>
              <b>TODO EL EQUIPO</b>
            </h5>
          </Button>
          </NavLink>
        </Grid>
      </Grid>
      <Imagenesobra imagenes={obraData.fotos_obra || []} />
      <Stack
        direction="column"
        spacing={4}
        sx={{
          justifyContent: "flex-start",
          alignItems: "center",
          paddingTop: 5,
          paddingBottom: 5,
        }}
      >


{premios.length > 0 && (
  <>
    <Typography variant="h5" component="h5" sx={{ fontWeight: "bold" }}>
      PREMIOS
    </Typography>

    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={2}
      sx={{
        justifyContent: { xs: "center", sm: "space-around" },
        alignItems: "center",
        width: "100%",
        paddingX: 2,
      }}
    >
      {premios.map((premio) => (
        <NavLink
          key={premio.id}
          to={`/premios/${premio.id_premio}`}
          style={{ textDecoration: "none" }}
        >
          <Premiosobra
            premio={premio.nombre}       // Corregido: antes era premio.premio
            year={premio.año}            // Corregido: antes era premio.year
            condecoracion={premio.categoria} // Corregido: antes era premio.condecoracion
          />
        </NavLink>
      ))}
    </Stack>
  </>
)}
</Stack>
      
      
      
      <Typography variant="h5" component="h5" sx={{ fontWeight: "bold", textAlign: "center" }}>
  CRÍTICAS
</Typography>

<Stack
  direction={criticas.length === 1 ? "column" : { xs: 'column', sm: 'row' }} 
  spacing={2}
  sx={{
    width: "100%",
    padding: 2,
    flexWrap: "wrap"
  }}
>
  {criticas.map(critica => (
    <Obracriticas
      key={critica.id}
      titulo={critica.titulo_critica}
      texto={critica.cuerpo}
      nota={critica.nota}
      sx={{ width: criticas.length === 1 ? "100%" : "48%" }} // Si solo hay una, usa ancho completo
    />
  ))}
</Stack>

{/* Botón para ver todas las críticas */}
<Grid
  container
  direction="row"
  sx={{
    justifyContent: "space-around",
    alignItems: "flex-start",
    marginTop: 3,
  }}
>
  <NavLink to={`/criticas/${id}`} style={{ textDecoration: 'none' }}>
    <Button variant="contained" size="large" sx={{ background: 'black', marginBottom: '40px' }}>
      <h5><b>TODAS LAS CRÍTICAS</b></h5>
    </Button>
  </NavLink>
</Grid>

  
  
  
  <Modal
    open={open}
    onClose={handleClose}
    aria-labelledby="modal-modal-title"
    aria-describedby="modal-modal-description"
  >
      <Box sx={style}>
        <EntradasObra obraId="ikM3L2joKaLLq6fVfCKb" />

      </Box>
    </Modal></></>
  )
}

export default Obra2;