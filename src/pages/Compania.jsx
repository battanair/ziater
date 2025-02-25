import React, { useState, useEffect } from 'react';
import { useParams, NavLink } from 'react-router-dom';
import { Grid, Box, Typography } from '@mui/material';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import Personaindex from '../components/personaindex'; // Asegúrate de que esté bien importado
import InstagramIcon from '@mui/icons-material/Instagram';

const Compania = () => {
  const { id } = useParams();
  const [compania, setCompania] = useState(null);
  const [obrasRelacionadas, setObrasRelacionadas] = useState([]);

  useEffect(() => {
    const fetchCompania = async () => {
      try {
        const companiaRef = doc(db, 'productoras', id);
        const companiaSnap = await getDoc(companiaRef);

        if (companiaSnap.exists()) {
          const companiaData = companiaSnap.data();
          console.log('Datos de la compañía:', companiaData); // Log para verificar los datos de la compañía
          setCompania(companiaData);

          // Consulta para obtener las obras relacionadas
          const obrasQuery = query(collection(db, 'obra'), where('productoras', 'array-contains', id));
          const obrasSnap = await getDocs(obrasQuery);
          const obrasData = obrasSnap.docs.map(doc => ({
            id: doc.id,
            titulo: doc.data().titulo, // Nombre de la obra
            anoinicio: doc.data().anoinicio, // Año de inicio
            cartel: doc.data().cartel // Imagen/cartel de la obra
          }));
          console.log('Datos de las obras relacionadas:', obrasData); // Log para verificar los datos de las obras
          setObrasRelacionadas(obrasData);
        } else {
          console.error('La compañía no existe en Firestore.');
        }
      } catch (error) {
        console.error('Error obteniendo la compañía:', error);
      }
    };

    fetchCompania();
  }, [id]);

  if (!compania) {
    return <p>Cargando datos de la compañía...</p>;
  }

  return (
    <Grid container spacing={4} sx={{ paddingTop: 4, paddingBottom: 4, paddingLeft: 4 }}>
      {/* Columna 1: Imagen */}
      <Grid item xs={12} md={4}>
        <Box sx={{ textAlign: "center" }}>
          <img
            src={compania.foto_prod || "https://via.placeholder.com/300"}
            alt={compania.nombre_prod}
            style={{ width: "100%", borderRadius: "8px" }}
          />
        </Box>
      </Grid>

      {/* Columna 2: Texto */}
      <Grid item xs={12} md={8}>
        <Box sx={{ display: "flex", alignItems: "baseline", gap: 1, marginBottom: 1 }}>
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>
            {compania.nombre_prod}
          </Typography>
        </Box>

        <Typography variant="body1" sx={{ marginBottom: "8px" }}>
          {compania.descripcion}
        </Typography>
        {compania.instagram && (
                        <Box sx={{ textAlign: "left", marginTop: 2 }}>
                            <a href={`https://www.instagram.com/${compania.instagram}`} target="_blank" rel="noopener noreferrer">
                                <InstagramIcon sx={{ fontSize: 30, color: "black", marginBottom: 2 }} />
                            </a>
                        </Box>
                    )}
      </Grid>

      {/* Sección de Obras Relacionadas */}
      {obrasRelacionadas.length > 0 ? (
        <>
          <Typography variant="h5" sx={{ fontWeight: "bold", textAlign: "center", marginTop: 5, marginBottom: 3 }}>
            OBRAS 
          </Typography>
          <Grid container spacing={4} sx={{ maxWidth: "100%", margin: "0 auto" }}>
            {obrasRelacionadas.slice(0, 4).map((obra) => (
              <Grid item xs={6} sm={3} md={3} key={obra.id}>
                <NavLink to={`/obra/${obra.id}`} style={{ textDecoration: 'none' }}>
                  <Personaindex
                    nombrepersona={obra.titulo} // Ahora el título de la obra
                    puestopersona={`${obra.anoinicio}`} // Año de inicio con texto
                    fotito={obra.cartel} // Imagen/cartel de la obra
                  />
                </NavLink>
              </Grid>
            ))}
          </Grid>
        </>
      ) : (
        <Typography>No hay obras relacionadas disponibles.</Typography>
      )}
    </Grid>
  );
};

export default Compania;
