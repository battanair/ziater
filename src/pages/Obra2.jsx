import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db, auth } from '../firebaseConfig';
import { doc, getDoc, collection, query, where, orderBy, limit, getDocs, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
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
import InstagramIcon from '@mui/icons-material/Instagram';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { onAuthStateChanged } from 'firebase/auth';
import { Helmet, HelmetProvider } from 'react-helmet-async';


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
  const [user, setUser] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isViewed, setIsViewed] = useState(false);

  const handleSwitchChange = (event) => {
    setShowCurrentActors(event.target.checked);
  };

  // Filtramos el elenco para que solo muestre actores
  const filteredElenco = elenco.filter((persona) => {
    if (persona.rol !== "Actor") return false; // Solo actores

    const fechaFin = Number(persona.fecha_fin); // Convertir fecha_fin a número
    const fechaInicio = Number(persona.fecha_inicio); // Convertir fecha_inicio a número
    const anofin = Number(obraData.anofin); // Convertir anofin a número
    const anoinicio = Number(obraData.anoinicio); // Convertir anoinicio a número

    if (showCurrentActors) {
      return fechaFin === 0 || fechaFin === anofin || (fechaInicio === anoinicio && fechaFin === anofin); // Si el switch está activado, actores con fecha_fin: 0 o fecha_fin igual a anofin de la obra o ambos coinciden
    } else {
      return fechaInicio === anoinicio || (fechaInicio === anoinicio && fechaFin === anofin); // Si está desactivado, actores que empezaron el año de anoinicio de la obra o ambos coinciden
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

          // Obtener las productoras
          const productorasIds = obraSnap.data().productoras || [];
          const productorasTemp = [];
  
          for (const prodId of productorasIds) {
            const prodRef = doc(db, 'productoras', prodId);
            const prodSnap = await getDoc(prodRef);
  
            if (prodSnap.exists()) {
              productorasTemp.push({
                id: prodSnap.id,
                nombre_prod: prodSnap.data().nombre_prod,
              });
            }
          }
  
          setProductoras(productorasTemp);
        } else {
          console.error('La obra no existe en Firestore.');
        }
      } catch (error) {
        console.error('Error obteniendo la obra:', error);
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

    const fetchUser = () => {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          setUser(user);
          const userRef = doc(db, 'users', user.uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            const userData = userSnap.data();
            setIsFavorite(userData.favoritos_obra?.includes(id));
            setIsViewed(userData.vistas?.includes(id));
          }
        } else {
          setUser(null);
        }
      });
    };
    
    if (id) {
      fetchObra();
      fetchElenco();
      fetchPremios();
      fetchCriticas(); // Llamada para obtener las críticas
      fetchUser();
    }
  }, [id]);

  const handleViewClick = async () => {
    if (user) {
      const userRef = doc(db, 'users', user.uid);
      if (isViewed) {
        await updateDoc(userRef, {
          vistas: arrayRemove(id)
        });
        setIsViewed(false);
      } else {
        await updateDoc(userRef, {
          vistas: arrayUnion(id)
        });
        setIsViewed(true);
      }
    }
  };

  const handleFavoriteClick = async () => {
    if (user) {
      const userRef = doc(db, 'users', user.uid);
      if (isFavorite) {
        await updateDoc(userRef, {
          favoritos_obra: arrayRemove(id)
        });
        setIsFavorite(false);
      } else {
        await updateDoc(userRef, {
          favoritos_obra: arrayUnion(id)
        });
        setIsFavorite(true);
      }
    }
  };

  if (!obraData) {
    return <p>Cargando datos de la obra...</p>;
  }

  const director = elenco.find(persona => persona.rol === "Dirección");
  const dramaturgo = elenco.find(persona => persona.rol === "Dramaturgia");

  // Calcular la media de las notas de las críticas
  const mediaNotas = criticas.length > 0
    ? (criticas.reduce((sum, critica) => sum + critica.nota, 0) / criticas.length)
    : null;

  // Formatear la media para que no muestre decimales si es un número entero
  const formattedMediaNotas = mediaNotas !== null 
    ? (Number.isInteger(mediaNotas) ? mediaNotas.toString() : mediaNotas.toFixed(1))
    : "N/A";

  return (
    <>
    <HelmetProvider>
    <Helmet>
        <title>{obraData.titulo}</title>
        <meta name="description" content={obraData.sinopsis} />
        <meta property="og:title" content={obraData.titulo} />
        <meta property="og:description" content={obraData.sinopsis} />
        <meta property="og:image" content={obraData.cartel} />
      </Helmet>
      </HelmetProvider>

      <Grid container spacing={4} sx={{ paddingTop: 4, paddingLeft: 4 }}>

        {/* Columna 1: Imagen */}

        <Grid item xs={12} md={4}>
          <Box sx={{ textAlign: 'center' }}>
            <img
              src={obraData.cartel || 'https://res.cloudinary.com/dk0vvcpyn/image/upload/v1740952724/imagenesdefecto/u92idnadh254vhm9wi84.jpg'}
              alt={obraData.titulo}
              style={{ width: '100%', borderRadius: '8px' }} />
          </Box>
        </Grid>

        {/* Columna 2: Texto */}
        <Grid item xs={12} md={8}>


        <Stack 
    direction="row" 
    spacing={2} 
    sx={{ marginBottom: 2, justifyContent: 'flex-end' }} // Alinea los iconos a la derecha
  >
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: 30,
        height: 30,
        borderRadius: '50%',
        backgroundColor: isViewed ? 'black' : 'white',
        color: isViewed ? 'white' : 'black',
        cursor: 'pointer',
        border: '1px solid black', // Agrega un borde
        '&:hover': {
          backgroundColor: 'black',
          color: 'white',
        },
      }}
      onClick={handleViewClick}
    >
      <VisibilityIcon />
    </Box>
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: 30,
        height: 30,
        borderRadius: '50%',
        backgroundColor: isFavorite ? 'black' : 'white',
        color: isFavorite ? 'white' : 'black',
        cursor: 'pointer',
        border: '1px solid black', // Agrega un borde
        '&:hover': {
          backgroundColor: 'black',
          color: 'white',
        },
      }}
      onClick={handleFavoriteClick}
    >
      <FavoriteIcon />
    </Box>
  </Stack>



          {/* Componente Categoriaobra agregado encima del título con separación */}
          <div className="linea">
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

              {formattedMediaNotas !== null && (
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
                  {formattedMediaNotas}
                </Item>
              )}
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
          
          {obraData.instagram && (
                          <Box sx={{ textAlign: "left", marginTop: 2 }}>
                              <a href={`https://www.instagram.com/${obraData.instagram}`} target="_blank" rel="noopener noreferrer">
                                  <InstagramIcon sx={{ fontSize: 30, color: "black", marginBottom: 2 }} />
                              </a>
                          </Box>
                      )}

          {/*<Button 
    variant="contained" 
    sx={{ 
      background: 'black', 
      color: 'white', 
      '&:hover': {
        backgroundColor: 'black',
        color: 'white',
      },
      '&:active': {
        backgroundColor: 'black',
        color: 'white',
      },
      marginBottom: '40px' 
    }} 
    onClick={handleOpen}
  >
    <h6><b>COMPRAR ENTRADAS</b></h6>
  </Button>*/}
        </Grid>
      </Grid>

      <><Box container sx={{ marginTop: 4, paddingLeft: 3 }}>
    <Grid container spacing={2} direction="row" sx={{
    justifyContent: director && dramaturgo && director.id === dramaturgo.id ? "flex-start" : "space-around",
    alignItems: "center",
  }}>
    {/* Columna 1: Dirección y Dramaturgia */}
    <Grid item xs={12} md={6}>
  {/* Si la misma persona es director y dramaturgo */}
  {director && dramaturgo && director.id === dramaturgo.id ? (
    <Box sx={{ textAlign: 'left' }}>
      <h5><b>Dramaturgia y Dirección de:</b></h5>
      <Personaindex nombrepersona={director.nombre} puestopersona={"Dramaturgia y Dirección"} fotito={director.foto}/>
    </Box>
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
    {obraData.trailer && (
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
)}
  </Grid>
</Box>

      {elenco.length > 0 && (
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
            <Personaindex nombrepersona={`${persona.nombre} ${persona.apellidos}`} puestopersona={persona.personaje} fotito={persona.foto} />
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
    sx={{ 
      background: 'black', 
      color: 'white', 
      '&:hover': {
        backgroundColor: 'black',
        color: 'white',
      },
      '&:active': {
        backgroundColor: 'black',
        color: 'white',
      }
    }}
  >
    <h5><b>TODO EL EQUIPO</b></h5>
  </Button>
</NavLink>
    </Grid>
  </Grid>
)}
      <Imagenesobra imagenes={obraData.fotosObra || []} />
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
  <Button 
    variant="contained" 
    size="large" 
    sx={{ 
      background: 'black', 
      color: 'white', 
      '&:hover': {
        backgroundColor: 'black',
        color: 'white',
      },
      '&:active': {
        backgroundColor: 'black',
        color: 'white',
      },
      marginBottom: '40px' 
    }}
  >
    <h5><b>CRÍTICAS</b></h5>
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
        <EntradasObra obraId={id} /> {/* Pasar el id de la obra como prop */}

      </Box>
    </Modal></></>
  )
}

export default Obra2;