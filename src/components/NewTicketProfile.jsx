import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, setDoc, collection, getDocs, addDoc, query, where } from "firebase/firestore";
import { auth, db } from '../firebaseConfig';
import { Container, TextField, Button, Stepper, Step, StepLabel, Box, CircularProgress, Autocomplete, Typography } from '@mui/material';

function NewTicketProfile() {
  const [activeStep, setActiveStep] = useState(0);
  const [enlaceEntradas, setEnlaceEntradas] = useState('');
  const [fecha, setFecha] = useState('');
  const [idObra, setIdObra] = useState('');
  const [idSala, setIdSala] = useState('');
  const [precio, setPrecio] = useState('');
  const [obras, setObras] = useState([]);
  const [teatros, setTeatros] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        await fetchObras();
        await fetchTeatros();
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const fetchObras = async () => {
    const obrasSnapshot = await getDocs(collection(db, "obra"));
    setObras(obrasSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const fetchTeatros = async () => {
    const teatrosSnapshot = await getDocs(collection(db, "teatro"));
    setTeatros(teatrosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const handleSaveEntrada = async () => {
    if (!enlaceEntradas || !fecha || !idObra || !idSala || !precio) {
      setErrors({
        enlaceEntradas: !enlaceEntradas,
        fecha: !fecha,
        idObra: !idObra,
        idSala: !idSala,
        precio: !precio,
      });
      return;
    }

    if (user) {
      try {
        await addDoc(collection(db, "entradas"), {
          enlace_entradas: enlaceEntradas,
          fecha: new Date(fecha),
          id_obra: idObra,
          id_sala: idSala,
          precio: parseFloat(precio),
        });
        setActiveStep(1);
      } catch (error) {
        console.error("Error al guardar la entrada:", error);
      }
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh" bgcolor="black">
        <CircularProgress sx={{ color: 'white' }} />
      </Box>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
        <Step><StepLabel>Datos</StepLabel></Step>
        <Step><StepLabel>Finalizar</StepLabel></Step>
      </Stepper>
      {activeStep === 0 && (
        <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 5 }}>
          <TextField
            label="Enlace de Entradas"
            value={enlaceEntradas}
            onChange={(e) => setEnlaceEntradas(e.target.value)}
            fullWidth
            error={errors.enlaceEntradas}
            helperText={errors.enlaceEntradas && "Campo requerido"}
          />
          <TextField
            label="Fecha"
            type="datetime-local"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            fullWidth
            error={errors.fecha}
            helperText={errors.fecha && "Campo requerido"}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <Autocomplete
            options={obras}
            getOptionLabel={(option) => (option?.titulo ? option.titulo : '')}
            onChange={(event, newValue) => {
              if (newValue && typeof newValue === 'object') {
                setIdObra(newValue.id);
              }
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Obra"
                fullWidth
                onBlur={(e) => {
                  const value = e.target.value.trim();
                  if (value.startsWith('http')) {
                    const id = value.split('/').pop(); // Extrae la ID de la URL
                    setIdObra(id);
                  }
                }}
              />
            )}
          />
           <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                Si no encuentras el espectáculo o el espacio que buscas,<br></br> pega la URL de su página.
              </Typography>
          <Autocomplete
            options={teatros}
            getOptionLabel={(option) => (option?.nombre_teatro ? option.nombre_teatro : '')}
            onChange={(event, newValue) => {
              if (newValue && typeof newValue === 'object') {
                setIdSala(newValue.id);
              }
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Espacio"
                fullWidth
                onBlur={(e) => {
                  const value = e.target.value.trim();
                  if (value.startsWith('http')) {
                    const id = value.split('/').pop(); // Extrae la ID de la URL
                    setIdSala(id);
                  }
                }}
              />
            )}
          />
          <TextField
            label="Precio"
            type="number"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
            fullWidth
            error={errors.precio}
            helperText={errors.precio && "Campo requerido"}
          />
          <Button onClick={handleSaveEntrada} variant="contained" sx={{ mt: 2 }}>Siguiente</Button>
        </Box>
      )}
      {activeStep === 1 && (
        <Box>
          <Container maxWidth="sm" sx={{ py: 4, textAlign: 'center' }}>
            <Typography variant="h5" sx={{ mb: 2 }}>¡Entrada Creada!</Typography>
            <Typography variant="body1" sx={{ mb: 4 }}>
              La entrada ha sido guardada exitosamente.
            </Typography>
            <Button variant="contained" href="/">Ir al inicio</Button>
          </Container>
        </Box>
      )}
    </Container>
  );
}

export default NewTicketProfile;