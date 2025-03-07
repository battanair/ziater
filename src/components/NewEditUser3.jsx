import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Box, Typography, IconButton, Autocomplete, TextField, FormControl, InputLabel, Select, MenuItem, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import { getFirestore, doc, getDoc, deleteDoc, updateDoc, addDoc, collection, getDocs } from 'firebase/firestore';
import { db } from "../firebaseConfig";

const NewEditUser3 = ({ handleRemoveTrabajo, errors = {} }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const idPersonaFromURL = searchParams.get("persona");

  const [trabajo, setTrabajo] = useState({ id_persona: idPersonaFromURL || '' });
  const [obraTitulo, setObraTitulo] = useState('');
  const [isActualmenteSelected, setIsActualmenteSelected] = useState(false);
  const [obras, setObras] = useState([]);
  const [obraNotFound, setObraNotFound] = useState('');

  useEffect(() => {
    const fetchObras = async () => {
      const obrasSnapshot = await getDocs(collection(db, "obra"));
      setObras(obrasSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    const fetchTrabajo = async () => {
      if (id) {
        const docRef = doc(db, 'persona_obra', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const trabajoData = docSnap.data();
          setTrabajo(trabajoData);

          if (trabajoData.id_obra) {
            const obraRef = doc(db, 'obra', trabajoData.id_obra);
            const obraSnap = await getDoc(obraRef);
            if (obraSnap.exists()) {
              setObraTitulo(obraSnap.data().titulo);
            }
          }

          if (trabajoData.fecha_fin === 0) {
            setIsActualmenteSelected(true);
          }
        }
      }
    };

    fetchObras();
    fetchTrabajo();
  }, [id]);

  const handleTrabajoChange = (field, value) => {
    setTrabajo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  
  const handleActualmenteClick = () => {
    setIsActualmenteSelected(!isActualmenteSelected);
    setTrabajo((prev) => ({
      ...prev,
      fecha_fin: isActualmenteSelected ? '' : 0, // Si se selecciona "Actualmente", fecha_fin es 0
    }));
  };
  
  const handleDelete = async () => {
    if (!id) return;
    try {
      await deleteDoc(doc(db, 'persona_obra', id));
      navigate(-1); // Vuelve a la página anterior
    } catch (error) {
      console.error('Error al eliminar el trabajo:', error);
    }
  };
  
  const handleSave = async () => {
    if (!trabajo.id_persona) {
      console.error('id_persona is undefined');
      return;
    }
  
    try {
      if (id) {
        // Si existe ID, actualizamos el documento
        await updateDoc(doc(db, 'persona_obra', id), trabajo);
      } else {
        // Si NO hay ID, creamos un nuevo documento en la colección persona_obra
        const newDocRef = await addDoc(collection(db, 'persona_obra'), trabajo);
        
        // Redirigir a la página anterior con el ID de la persona
        navigate(`/newedituser2/${trabajo.id_persona}`);
      }
    } catch (error) {
      console.error('Error al guardar el trabajo:', error);
    }
  };
  

  return (
    <Box sx={{ mb: 4, p: 3, border: '1px solid #ddd', borderRadius: 2, boxShadow: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <IconButton onClick={() => navigate(-1)}><ArrowBackIcon /></IconButton>
        <Typography variant="h6" gutterBottom>Trabajo</Typography>
        {id && <IconButton onClick={handleDelete}><DeleteIcon /></IconButton>}
      </Box>
      {id ? (
        <TextField
          label="Obra"
          fullWidth
          value={obraTitulo}
          InputProps={{
            readOnly: true,
          }}
          sx={{ mb: 2 }}
        />
      ) : (
        <>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
            Si no encuentras la obra que buscas, pega la URL de su página. Si no existe, créala.
          </Typography>
          <Autocomplete
            sx={{ mb: 2 }}
            options={obras}
            getOptionLabel={(option) => (option?.titulo ? option.titulo : '')}
            value={obras.find((obra) => obra.id === trabajo.id_obra) || null}
            onChange={(event, newValue) => {
              if (newValue && typeof newValue === 'object') {
                handleTrabajoChange('id_obra', newValue.id); // Guarda el ID de la obra seleccionada
                setObraNotFound('');
              }
            }}
            freeSolo
            renderInput={(params) => (
              <TextField
                {...params}
                label="Obra"
                fullWidth
                onChange={(e) => {
                  const value = e.target.value.trim();
                  if (!value.startsWith('http')) {
                    setObraNotFound('');
                  }
                }}
                onBlur={async (e) => {
                  const value = e.target.value.trim();

                  if (value.startsWith('http')) {
                    const id = value.split('/').pop(); // Extrae la ID de la URL
                    handleTrabajoChange('id_obra', id);

                    // Fetch obra title from the ID
                    const obraRef = doc(db, 'obra', id);
                    const obraSnap = await getDoc(obraRef);
                    if (obraSnap.exists()) {
                      setObraTitulo(obraSnap.data().titulo);
                      setObraNotFound('');
                    } else {
                      setObraNotFound('Obra no encontrada');
                    }
                  }
                }}
                disabled={!!trabajo.id_obra} // Deshabilita el campo si ya hay un id_obra
              />
            )}
            ListboxProps={{
              style: {
                maxHeight: '200px', // Ajusta la altura máxima del menú desplegable
              },
            }}
          />
        </>
      )}
      {obraNotFound && <Typography color="error">{obraNotFound}</Typography>}
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Departamento</InputLabel>
        <Select
          value={trabajo.puesto || ''}
          onChange={(e) => handleTrabajoChange('puesto', e.target.value)}
          error={!!errors.trabajos}
        >
          <MenuItem value="Actor">Interpretación</MenuItem>
          <MenuItem value="Dramaturgia">Dramaturgia</MenuItem>
          <MenuItem value="Iluminación">Iluminación</MenuItem>
          <MenuItem value="Dirección">Dirección</MenuItem>
          <MenuItem value="Escenografía">Escenografía</MenuItem>
          <MenuItem value="Espacio Sonoro">Espacio Sonoro</MenuItem>
          <MenuItem value="Vestuario">Vestuario</MenuItem>
          <MenuItem value="Asesoría">Asesoría</MenuItem>
          <MenuItem value="Fotografía">Audiovisual</MenuItem>
          <MenuItem value="Diseño">Diseño</MenuItem>
          <MenuItem value="Comunicación">Comunicación</MenuItem>
        </Select>
        {errors.trabajos && <Typography color="error">Campo requerido</Typography>}
      </FormControl>
      <TextField
        label="Trabajo / Personaje"
        value={trabajo.titulo || ''}
        onChange={(e) => handleTrabajoChange('titulo', e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
        error={!!errors.trabajos}
        helperText={errors.trabajos && "Campo requerido"}
      />
      <TextField
        label="Fecha Inicio"
        type="number"
        value={trabajo.fecha_inicio || ''}
        onChange={(e) => handleTrabajoChange('fecha_inicio', e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
        error={!!errors.trabajos}
        helperText={errors.trabajos && "Campo requerido"}
      />
      <Box display="flex" alignItems="center" gap={2}>
        <TextField
          label="Fecha Fin"
          type="number"
          value={trabajo.fecha_fin === 0 ? '' : trabajo.fecha_fin}
          onChange={(e) => handleTrabajoChange('fecha_fin', e.target.value)}
          fullWidth
        />
        <Button
          variant="outlined"
          onClick={handleActualmenteClick}
          color={isActualmenteSelected ? 'primary' : 'default'}
        >
          Actualmente
        </Button>
      </Box>
      <Button
        variant="contained"
        color="primary"
        onClick={handleSave}
        sx={{
          mt: 2,
          bgcolor: 'black',
          color: 'white',
          '&:hover': {
            bgcolor: 'black',
          },
          '&:active': {
            bgcolor: 'black',
          },
        }}
      >
        Guardar
      </Button>
    </Box>
  );
};

export default NewEditUser3;