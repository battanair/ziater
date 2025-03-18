import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Grid, Box, Typography, Stack } from '@mui/material';
import { doc, getDoc, collection, query, where, getDocs, updateDoc, arrayRemove, arrayUnion } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';
import InstagramIcon from '@mui/icons-material/Instagram';
import { onAuthStateChanged } from 'firebase/auth';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Helmet } from "react-helmet-async";
import ReactGA from 'react-ga';




const Premios = () => {
  const { id } = useParams();
  const [premio, setPremio] = useState(null);
  const [premiosPorAnio, setPremiosPorAnio] = useState({});
  const [nombresObras, setNombresObras] = useState({});
  const [nombresPersonas, setNombresPersonas] = useState({});
  const [isFavorite, setIsFavorite] = useState(false);
    const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchPremio = async () => {
      try {
        const premioRef = doc(db, 'premios', id);
        const premioSnap = await getDoc(premioRef);

        if (premioSnap.exists()) {
          setPremio(premioSnap.data());
        } else {
          console.error('El premio no existe en Firestore.');
        }
      } catch (error) {
        console.error('Error obteniendo el premio:', error);
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
            setIsFavorite(userData.favoritos_premio?.includes(id));
          }
        } else {
          setUser(null);
        }
      });
    };



    const fetchPremiosRelacionados = async () => {
      try {
        const premiosObrasQuery = query(collection(db, 'premios_obras'), where('id_premio', '==', id));
        const premiosPersQuery = query(collection(db, 'premios_personas'), where('id_premio', '==', id));

        const [premiosObrasSnap, premiosPersSnap] = await Promise.all([
          getDocs(premiosObrasQuery),
          getDocs(premiosPersQuery)
        ]);

        const premiosObras = premiosObrasSnap.docs.map(doc => ({ ...doc.data(), tipo: 'obra' }));
        const premiosPers = premiosPersSnap.docs.map(doc => ({ ...doc.data(), tipo: 'persona' }));

        const premiosAgrupados = [...premiosObras, ...premiosPers].reduce((acc, premio) => {
          const anio = premio.anio_premio || premio.anio_premper || premio.anio_premobr;
          if (!acc[anio]) acc[anio] = [];
          acc[anio].push(premio);
          return acc;
        }, {});

        setPremiosPorAnio(premiosAgrupados);

        // Obtener nombres de obras y personas
        const obrasPromises = premiosObras.map(async (p) => {
          const obraRef = doc(db, 'obra', p.id_obra);
          const obraSnap = await getDoc(obraRef);
          return { id: p.id_obra, titulo: obraSnap.exists() ? obraSnap.data().titulo : 'Obra desconocida' };
        });

        const personasPromises = premiosPers.map(async (p) => {
          const personaRef = doc(db, 'persona', p.id_persona);
          const personaSnap = await getDoc(personaRef);
          return { id: p.id_persona, nombre: personaSnap.exists() ? `${personaSnap.data().Nombre} ${personaSnap.data().Apellidos}` : 'Persona desconocida' };
        });

        const [obrasData, personasData] = await Promise.all([
          Promise.all(obrasPromises),
          Promise.all(personasPromises)
        ]);

        setNombresObras(obrasData.reduce((acc, o) => ({ ...acc, [o.id]: o.titulo }), {}));
        setNombresPersonas(personasData.reduce((acc, p) => ({ ...acc, [p.id]: p.nombre }), {}));
      } catch (error) {
        console.error('Error obteniendo premios:', error);
      }
    };
    fetchUser();
    fetchPremio();
    fetchPremiosRelacionados();
  }, [id]);

  const handleFavoriteClick = async () => {
    if (!user) return; // Si el usuario no está autenticado, no hacer nada

    const userRef = doc(db, "users", user.uid);
    try {
        if (isFavorite) {
            await updateDoc(userRef, {
                favoritos_premio: arrayRemove(id),
            });
            setIsFavorite(false);
        } else {
            await updateDoc(userRef, {
                favoritos_premio: arrayUnion(id),
            });
            setIsFavorite(true);
        }
    } catch (error) {
        console.error("Error al actualizar favoritos:", error);
    }
};

  if (!premio) {
    return <Typography variant="h6" align="center">Cargando datos del premio...</Typography>;
  }

  return (
    <>
    <Helmet>
    <title>{premio.nombre_premio} - Ziater</title>
    <meta name="description" content={premio.bio_premio} />
    <meta property="og:title" content={premio.nombre_premio} />
    <meta property="og:description" content={premio.bio_premio} />
    <meta property="og:image" content={premio.foto_premio || 'https://via.placeholder.com/300'} />
    <meta property="og:url" content={`https://www.ziater.com/premios/${id}`} />
    <meta property="og:type" content="website" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={premio.nombre_premio} />
    <meta name="twitter:description" content={premio.bio_premio} />
    <meta name="twitter:image" content={premio.foto_premio || 'https://via.placeholder.com/300'} />
  </Helmet>
    <Grid container spacing={4} sx={{ padding: 4 }}>
      <Grid item xs={12} md={4}>
        <Box sx={{ textAlign: 'center' }}>
          <img
            src={premio.foto_premio || 'https://via.placeholder.com/300'}
            alt={premio.nombre_premio}
            style={{ width: '100%', borderRadius: '8px' }}
          />
        </Box>
      </Grid>
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
        <Typography variant="h4" sx={{ fontWeight: 'bold', marginBottom: 1 }}>
          {premio.nombre_premio}
        </Typography>
        <Typography variant="body1" sx={{ marginBottom: 2 }}>
          {premio.bio_premio}
        </Typography>
        {premio.insta_premio && (
                        <Box sx={{ textAlign: "left", marginTop: 2 }}>
                            <a href={`https://www.instagram.com/${premio.insta_premio}`} target="_blank" rel="noopener noreferrer">
                                <InstagramIcon sx={{ fontSize: 30, color: "black", marginBottom: 2 }} />
                            </a>
                        </Box>
                    )}
        
      </Grid>
      <Grid item xs={12}>
        {Object.keys(premiosPorAnio).sort((a, b) => b - a).map(anio => (
          <Box key={anio} sx={{ marginBottom: 3 }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', marginBottom: 2 }}>{anio}</Typography>
            {premiosPorAnio[anio].map((p, index) => (
              <Box key={index} sx={{ padding: 2, borderBottom: '1px solid #ccc' }}>
                <Typography variant="h6">{p.galardon || p.galardon_pers || p.galardon_obra}</Typography>
                <Typography variant="body2" sx={{ color: 'black', textDecoration: 'none' }}>
                  {p.tipo === 'obra' ? (
                    <Link to={`/obra/${p.id_obra}`} style={{ color: 'black', textDecoration: 'none' }}>{nombresObras[p.id_obra] || 'Ver obra'}</Link>
                  ) : (
                    <Link to={`/persona/${p.id_persona}`} style={{ color: 'black', textDecoration: 'none' }}>{nombresPersonas[p.id_persona] || 'Ver persona'}</Link>
                  )}
                </Typography>
              </Box>
            ))}
          </Box>
        ))}
      </Grid>
    </Grid>
    </>
  );
};

export default Premios;
