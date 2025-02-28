import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { doc, getDoc, updateDoc, addDoc, collection } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { Box, Typography, TextField, Button, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const EditarPremio2 = () => {
  const { id } = useParams(); // Obtiene el ID de la URL (si existe)
  const navigate = useNavigate(); // Para redirigir después de guardar
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id_persona = queryParams.get('id_persona');

  const [premio, setPremio] = useState({
    anio_premper: '',
    galardon_pers: '',
    id_persona: id_persona || '',
    id_premio: ''
  });
  const [loading, setLoading] = useState(!!id); // Solo carga si hay ID

  useEffect(() => {
    if (id) {
      const fetchPremio = async () => {
        const docRef = doc(db, 'premios_personas', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setPremio(docSnap.data()); // Cargar datos existentes
        } else {
          console.log('No se encontró el premio');
        }
        setLoading(false);
      };

      fetchPremio();
    }
  }, [id]);

  const handleChange = (field, value) => {
    setPremio({ ...premio, [field]: value });
  };

  const handleSubmit = async () => {
    try {
      if (id) {
        // Actualizar documento existente
        await updateDoc(doc(db, 'premios_personas', id), premio);
        alert('Premio actualizado');
      } else {
        // Crear nuevo documento
        const docRef = await addDoc(collection(db, 'premios_personas'), premio);
        alert('Premio guardado');
        navigate(`/editar-premio/${docRef.id}`); // Redirigir al nuevo premio
      }
      navigate(-1); // Volver a la página anterior
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (loading) return <Typography>Cargando...</Typography>;

  return (
    <Box>
      <IconButton onClick={() => navigate(-1)}>
        <ArrowBackIcon />
      </IconButton>
      <Typography variant="h6" gutterBottom>{id ? 'Editar Premio' : 'Nuevo Premio'}</Typography>

      <TextField
        label="Año del Premio"
        type="number"
        value={premio.anio_premper}
        onChange={(e) => handleChange('anio_premper', e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />

      <TextField
        label="Galardón"
        value={premio.galardon_pers}
        onChange={(e) => handleChange('galardon_pers', e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />

      <TextField
        label="ID Premio"
        value={premio.id_premio}
        onChange={(e) => handleChange('id_premio', e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
        disabled={!!id}
      />

      <Button 
        onClick={handleSubmit} 
        variant="contained" 
        sx={{ mt: 2, mb: 2, backgroundColor: 'black', color: 'white' }}
      >
        {id ? 'Guardar Cambios' : 'Guardar Premio'}
      </Button>
    </Box>
  );
};

export default EditarPremio2;
