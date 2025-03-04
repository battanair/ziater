import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Grid, Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Stack } from '@mui/material';
import { doc, getDoc, collection, query, where, getDocs, updateDoc, arrayRemove, arrayUnion } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';
import Personaindex from '../components/personaindex'; // Asegúrate de que esté bien importado
import InstagramIcon from '@mui/icons-material/Instagram';
import { onAuthStateChanged } from 'firebase/auth';
import FavoriteIcon from '@mui/icons-material/Favorite';

const Teatro = () => {
  const { id } = useParams();
  const [teatro, setTeatro] = useState(null);
  const [entradas, setEntradas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchTeatro = async () => {
      try {
        const teatroRef = doc(db, 'teatro', id);
        const teatroSnap = await getDoc(teatroRef);

        if (teatroSnap.exists()) {
          const teatroData = teatroSnap.data();
          setTeatro(teatroData);

          const entradasQuery = query(collection(db, 'entradas'), where('id_sala', '==', id));
          const entradasSnap = await getDocs(entradasQuery);
          const entradasData = await Promise.all(
            entradasSnap.docs.map(async (entradaDoc) => {
              const entradaData = entradaDoc.data();
              const obraRef = doc(db, 'obra', entradaData.id_obra);
              const obraSnap = await getDoc(obraRef);
              if (obraSnap.exists()) {
                const obraData = obraSnap.data();
                return {
                  id: entradaDoc.id,
                  ...entradaData,
                  titulo_obra: obraData.titulo,
                  cartel_obra: obraData.cartel,
                  id_obra: entradaData.id_obra,
                };
              } else {
                return null;
              }
            })
          );
          setEntradas(entradasData.filter((entrada) => entrada !== null));
        } else {
          console.error('El teatro no existe en Firestore.');
        }
      } catch (error) {
        console.error('Error obteniendo el teatro:', error);
      } finally {
        setLoading(false);
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
            setIsFavorite(userData.favoritos_sala?.includes(id));
          }
        } else {
          setUser(null);
        }
      });
    };


    fetchUser();
    fetchTeatro();
  }, [id]);

  const handleFavoriteClick = async () => {
    if (!user) return; // Si el usuario no está autenticado, no hacer nada

    const userRef = doc(db, "users", user.uid);
    try {
        if (isFavorite) {
            await updateDoc(userRef, {
                favoritos_sala: arrayRemove(id),
            });
            setIsFavorite(false);
        } else {
            await updateDoc(userRef, {
                favoritos_sala: arrayUnion(id),
            });
            setIsFavorite(true);
        }
    } catch (error) {
        console.error("Error al actualizar favoritos:", error);
    }
};


  if (loading) {
    return <CircularProgress sx={{ display: "block", margin: "auto" }} />;
  }

  if (!teatro) {
    return <p>Cargando datos del teatro...</p>;
  }

  return (
    <Grid container spacing={4} sx={{ paddingTop: 4, paddingBottom: 4, paddingLeft: 4 }}>
      {/* Columna 1: Imagen */}
      <Grid item xs={12} md={4}>
        <Box sx={{ textAlign: "center" }}>
          <img
            src={teatro.foto || "https://via.placeholder.com/300"}
            alt={teatro.nombre_teatro}
            style={{ width: "100%", borderRadius: "8px" }}
          />
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
        <Box sx={{ display: "flex", alignItems: "baseline", gap: 1, marginBottom: 1 }}>
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>
            {teatro.nombre_teatro}
          </Typography>
        </Box>

        <Typography variant="body1" sx={{ marginBottom: "8px" }}>
          {teatro.descripcion}
        </Typography>
        <Typography variant="body1" sx={{ marginBottom: "8px", marginTop: 5 }}>
          <b>Dirección:</b> {teatro.direccion}
        </Typography>
        <Typography variant="body1" sx={{ marginBottom: "8px" }}>
          <b>Ciudad:</b> {teatro.ciudad}
        </Typography>
        <Typography variant="body1" sx={{ marginBottom: "8px" }}>
          <b>País:</b> {teatro.pais}
        </Typography>
        {teatro.instagram && (
                        <Box sx={{ textAlign: "left", marginTop: 2 }}>
                            <a href={`https://www.instagram.com/${teatro.instagram}`} target="_blank" rel="noopener noreferrer">
                                <InstagramIcon sx={{ fontSize: 30, color: "black", marginBottom: 2 }} />
                            </a>
                        </Box>
                    )}
      </Grid>

      {/* Sección de Entradas */}
      <Grid item xs={12}>
        <Typography variant="h5" sx={{ fontWeight: "bold", textAlign: "center", marginTop: 5, marginBottom: 3 }}>
          ENTRADAS DISPONIBLES
        </Typography>
        <TableContainer component={Paper} sx={{ maxWidth: 800, margin: "auto", mt: 3, p: 2 }}>
          {entradas.length > 0 ? (
            <Table>
              <TableHead>
                <TableRow>
                <TableCell align="center"><b>Cartel</b></TableCell>
                <TableCell align="center"><b>Obra</b></TableCell>

                  <TableCell align="center"><b>Fecha</b></TableCell>
                  <TableCell align="center"><b>Hora</b></TableCell>
                  
                  <TableCell align="center"><b>Precio</b></TableCell>
                  <TableCell align="center"><b>Enlace</b></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {entradas.map((entrada) => (
                  <TableRow key={entrada.id}>
                    <TableCell align="center">
                      <Link to={`/obra/${entrada.id_obra}`} style={{ textDecoration: 'none' }}>
                        <img src={entrada.cartel_obra} alt={entrada.titulo_obra} style={{ width: "50px", height: "auto" }} />
                      </Link>
                    </TableCell>
                    <TableCell align="center">
                      <Link to={`/obra/${entrada.id_obra}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                        {entrada.titulo_obra}
                      </Link>
                    </TableCell>
                    <TableCell align="center">{entrada.fecha ? entrada.fecha.toDate().toLocaleDateString("es-ES", { day: "2-digit", month: "long", year: "numeric" }) : "Fecha no disponible"}</TableCell>
                    <TableCell align="center">{entrada.fecha ? entrada.fecha.toDate().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }) : "Hora no disponible"}</TableCell>
                    
                    
                    <TableCell align="center">{entrada.precio}€</TableCell>
                    <TableCell align="center">
                      <a href={entrada.enlace_entradas} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                        <Button variant="contained" size="medium" sx={{ background: 'black' }}>
                          Comprar
                        </Button>
                      </a>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <Typography align="center" sx={{ mt: 2 }}>
              No hay entradas disponibles
            </Typography>
          )}
        </TableContainer>
      </Grid>
    </Grid>
  );
};

export default Teatro;
