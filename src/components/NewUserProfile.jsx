import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, setDoc, collection, getDocs, addDoc, query, where } from "firebase/firestore";
import { auth, db } from '../firebaseConfig';
import { Container, TextField, Button, Stepper, Step, StepLabel, Box, Select, MenuItem, CircularProgress, FormControl, InputLabel, Autocomplete, Typography } from '@mui/material';

function NewUserProfile() {
  const [activeStep, setActiveStep] = useState(0);
  const [Nombre, setNombre] = useState('');
  const [Apellidos, setApellidos] = useState('');
  const [biografia, setBiografia] = useState('');
  const [instagram, setInstagram] = useState('');
  const [trabajos, setTrabajos] = useState([]);
  const [obras, setObras] = useState([]);
  const [premios, setPremios] = useState([]);
  const [premiosPersona, setPremiosPersona] = useState([]);
  const [coincide, setCoincide] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [personaId, setPersonaId] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        await fetchObras();
        await fetchPremios();
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const fetchObras = async () => {
    const obrasSnapshot = await getDocs(collection(db, "obra"));
    setObras(obrasSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const fetchPremios = async () => {
    const premiosSnapshot = await getDocs(collection(db, "premios"));
    setPremios(premiosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const handleSavePersona = async () => {
    if (user) {
      try {
        let personaRef;
        if (coincide) {
          // Verificar si ya existe una persona con coincide = user.uid
          const q = query(collection(db, "persona"), where("coincide", "==", user.uid));
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            alert("Ya existe una persona registrada como tú");
            return;
          }
          // Guardar con el UID del usuario
          personaRef = doc(db, "persona", user.uid);
          await setDoc(personaRef, {
            Nombre,
            Apellidos,
            biografia,
            instagram,
            creacion: user.uid,
            coincide: user.uid,
            foto: "https://picsum.photos/200/300"
          });
        } else {
          // Crear un nuevo documento con addDoc para múltiples personas
          const newPersonaRef = await addDoc(collection(db, "persona"), {
            Nombre,
            Apellidos,
            biografia,
            instagram,
            creacion: user.uid,
            coincide: "",
            foto: "https://picsum.photos/200/300"
          });
          personaRef = newPersonaRef;
        }
        setPersonaId(personaRef.id);
        setActiveStep(1);
      } catch (error) {
        console.error("Error al guardar la información de la persona:", error);
      }
    }
  };

  const handleAddTrabajo = () => {
    setTrabajos([...trabajos, { idObra: '', titulo: '', trabajo: '', departamento: '', fechaInicio: '', fechaFin: '' }]);
  };

  const handleTrabajoChange = (index, field, value) => {
    const newTrabajos = [...trabajos];
    newTrabajos[index][field] = value;
    setTrabajos(newTrabajos);
  };

  const handlePremioChange = (index, field, value) => {
    const newPremiosPersona = [...premiosPersona];
    newPremiosPersona[index] = { ...newPremiosPersona[index], [field]: value };
    setPremiosPersona(newPremiosPersona);
  };

  const handleAddPremio = () => {
    setPremiosPersona([...premiosPersona, { idPremio: '', anioPremio: '', galardonPers: '' }]);
  };

  const handleFinalSubmit = async () => {
    if (personaId) {
      try {
        for (const trabajo of trabajos) {
          await addDoc(collection(db, "persona_obra"), {
            id_obra: trabajo.idObra,
            id_persona: personaId,
            titulo: trabajo.trabajo,
            puesto: trabajo.departamento,
            fecha_inicio: trabajo.fechaInicio,
            fecha_fin: trabajo.fechaFin,
          });
        }
        
        for (const premio of premiosPersona) {
          await setDoc(doc(db, "premios_personas", `${personaId}_${premio.idPremio}`), {
            id_premio: premio.idPremio,
            id_persona: personaId,
            anio_premper: premio.anioPremio,
            galardon_pers: premio.galardonPers,
          });
        }

        alert("Perfil creado exitosamente");
      } catch (error) {
        console.error("Error al guardar la información:", error);
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
        <Step><StepLabel>Datos Personales</StepLabel></Step>
        <Step><StepLabel>Asociar Obra</StepLabel></Step>
        <Step><StepLabel>Premios</StepLabel></Step>
      </Stepper>
      {activeStep === 0 && (
        <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 5 }}>
          <TextField label="Nombre" value={Nombre} onChange={(e) => setNombre(e.target.value)} fullWidth />
          <TextField label="Apellidos" value={Apellidos} onChange={(e) => setApellidos(e.target.value)} fullWidth />
          <TextField label="Biografía" value={biografia} onChange={(e) => setBiografia(e.target.value)} multiline rows={4} fullWidth />
          <TextField label="Instagram" value={instagram} onChange={(e) => setInstagram(e.target.value)} fullWidth />
          <Button variant="outlined" onClick={() => setCoincide(!coincide)}>
            {coincide ? "¿No eres tú?" : "¿Eres tú?"}
          </Button>
          <Button onClick={handleSavePersona} variant="contained" sx={{ mt: 2 }}>Siguiente</Button>
        </Box>
      )}
      {activeStep === 1 && (
        <Box>
          {trabajos.map((trabajo, index) => (
            <Box key={index} sx={{ mb: 4, p: 3, border: '1px solid #ddd', borderRadius: 2, boxShadow: 2 }}>
              <Typography variant="h6" gutterBottom>Trabajo {index + 1}</Typography>
              <Autocomplete
                options={obras}
                getOptionLabel={(option) => option.titulo}
                onChange={(event, newValue) => handleTrabajoChange(index, 'idObra', newValue ? newValue.id : '')}
                renderInput={(params) => <TextField {...params} label="Obra" fullWidth sx={{ mb: 2 }} />}
              />
              <TextField label="Trabajo" value={trabajo.trabajo} onChange={(e) => handleTrabajoChange(index, 'trabajo', e.target.value)} fullWidth sx={{ mb: 2 }} />
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Departamento</InputLabel>
                <Select value={trabajo.departamento} onChange={(e) => handleTrabajoChange(index, 'departamento', e.target.value)}>
                  <MenuItem value="Actor">Interpretación</MenuItem>
                  <MenuItem value="Dramaturgia">Dramaturgia</MenuItem>
                  <MenuItem value="Iluminación">Iluminación</MenuItem>
                  <MenuItem value="Dirección">Dirección</MenuItem>
                </Select>
              </FormControl>
              <TextField label="Fecha Inicio" type="number" value={trabajo.fechaInicio} onChange={(e) => handleTrabajoChange(index, 'fechaInicio', e.target.value)} fullWidth sx={{ mb: 2 }} />
              <Box display="flex" alignItems="center" gap={2}>
                <TextField label="Fecha Fin" type="number" value={trabajo.fechaFin} onChange={(e) => handleTrabajoChange(index, 'fechaFin', e.target.value)} fullWidth />
                <Button variant="outlined" onClick={() => handleTrabajoChange(index, 'fechaFin', 0)}>Actualmente</Button>
              </Box>
            </Box>
          ))}
          <Button variant="contained" onClick={handleAddTrabajo} sx={{ mt: 2, mb: 2 }}>Añadir Trabajo</Button>
          <Button onClick={() => setActiveStep(0)}>Atrás</Button>
          <Button onClick={() => setActiveStep(2)}>Siguiente</Button>
        </Box>
      )}
      {activeStep === 2 && (
        <Box>
          {premiosPersona.map((premio, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              <Autocomplete
                options={premios}
                getOptionLabel={(option) => option.nombre_premio}
                onChange={(event, newValue) => handlePremioChange(index, 'idPremio', newValue ? newValue.id : '')}
                renderInput={(params) => <TextField {...params} label="Premio" fullWidth />}
              />
              <TextField 
                label="Año del Premio" 
                type="number" 
                value={premio.anioPremio} 
                onChange={(e) => handlePremioChange(index, 'anioPremio', e.target.value)} 
                fullWidth 
              />
              <TextField
                label="Galardón de la Persona"
                value={premio.galardonPers}
                onChange={(e) => handlePremioChange(index, 'galardonPers', e.target.value)}
                fullWidth
              />
            </Box>
          ))}
          <Button onClick={handleAddPremio} variant="outlined" sx={{ mt: 2 }}>Añadir Premio</Button>
          <Box display="flex" justifyContent="space-between" sx={{ mt: 2 }}>
            <Button onClick={() => setActiveStep(1)}>Atrás</Button>
            <Button onClick={handleFinalSubmit} variant="contained">Finalizar</Button>
          </Box>
        </Box>
      )}
    </Container>
  );
}

export default NewUserProfile;
