import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Grid, Box, Typography } from '@mui/material';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const Premios = () => {
  const { id } = useParams();
  const [premio, setPremio] = useState(null);
  const [premiosPorAnio, setPremiosPorAnio] = useState({});
  const [nombresObras, setNombresObras] = useState({});
  const [nombresPersonas, setNombresPersonas] = useState({});

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

    fetchPremio();
    fetchPremiosRelacionados();
  }, [id]);

  if (!premio) {
    return <Typography variant="h6" align="center">Cargando datos del premio...</Typography>;
  }

  return (
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
        <Typography variant="h4" sx={{ fontWeight: 'bold', marginBottom: 1 }}>
          {premio.nombre_premio}
        </Typography>
        <Typography variant="body1" sx={{ marginBottom: 2 }}>
          {premio.bio_premio}
        </Typography>
        
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
  );
};

export default Premios;
