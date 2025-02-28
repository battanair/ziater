import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { doc, getDoc, updateDoc, addDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { Box, Typography, TextField, Button, IconButton, Autocomplete } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const EditarPremio2 = () => {
  const { id } = useParams(); // Obtiene el ID del premio (si existe)
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id_persona = queryParams.get('id_persona');

  const [premio, setPremio] = useState({
    anio_premper: '',
    galardon_pers: '',
    id_persona: id_persona || '',
    id_premio: ''
  });
  const [loading, setLoading] = useState(!!id);
  const [premios, setPremios] = useState([]); // Lista de premios disponibles
  const [nombrePersona, setNombrePersona] = useState(''); // Nombre y apellidos de la persona

  useEffect(() => {
    // Cargar lista de premios disponibles
    const fetchPremios = async () => {
      const querySnapshot = await getDocs(collection(db, 'premios'));
      const premiosData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPremios(premiosData);
    };

    fetchPremios();

    // Cargar datos del premio si estamos editando
    if (id) {
      const fetchPremio = async () => {
        const docRef = doc(db, 'premios_personas', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setPremio(docSnap.data());
        } else {
          console.log('No se encontró el premio');
        }
        setLoading(false);
      };

      fetchPremio();
    }

    // Cargar datos de la persona
    if (id_persona) {
      const fetchPersona = async () => {
        const docRef = doc(db, 'personas', id_persona);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const personaData = docSnap.data();
          setNombrePersona(`${personaData.nombre} ${personaData.apellidos}`);
        } else {
          console.log('No se encontró la persona');
        }
      };

      fetchPersona();
    }
  }, [id, id_persona]);

  const handleChange = (field, value) => {
    setPremio({ ...premio, [field]: value });
  };

  const handlePremioChange = (event, newValue) => {
    if (newValue && typeof newValue === 'object') {
      setPremio({ ...premio, id_premio: newValue.id });
    }
  };

  const handleBlurPremio = (event) => {
    const value = event.target.value.trim();

    if (value.startsWith('http')) {
      const id = value.split('/').pop(); // Extrae la ID de la URL
      setPremio({ ...premio, id_premio: id });
    }
  };

  const handleSubmit = async () => {
    try {
      if (id) {
        await updateDoc(doc(db, 'premios_personas', id), premio);
        alert('Premio actualizado');
      } else {
        const docRef = await addDoc(collection(db, 'premios_personas'), premio);
        alert('Premio guardado');
        navigate(`/editar-premio/${docRef.id}`);
      }
      navigate(-1);
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
      <Typography variant="h6" gutterBottom>
        {id ? 'Editar Premio' : `Nuevo Premio ${nombrePersona}`}
      </Typography>

      <Autocomplete
        options={premios}
        getOptionLabel={(option) => option.nombre_premio || ''}
        value={premios.find((p) => p.id === premio.id_premio) || null}
        onChange={handlePremioChange}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Premio"
            fullWidth
            onBlur={handleBlurPremio}
          />
        )}
        sx={{ mb: 2 }}
      />
      <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
        Si no encuentras el premio que buscas, pega la URL de su página.
      </Typography>

      <TextField
        label="Galardón"
        value={premio.galardon_pers}
        onChange={(e) => handleChange('galardon_pers', e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />

      <TextField
        label="Año del Premio"
        type="number"
        value={premio.anio_premper}
        onChange={(e) => handleChange('anio_premper', e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
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
