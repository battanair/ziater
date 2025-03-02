import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, setDoc, collection, getDocs, addDoc, query, where } from "firebase/firestore";
import { auth, db } from '../firebaseConfig';
import { Container, TextField, Button, Stepper, Step, StepLabel, Box, Select, MenuItem, CircularProgress, FormControl, InputLabel, Autocomplete, Typography, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

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
  const [errors, setErrors] = useState({});
  const [imageUrl, setImageUrl] = useState('');
  const [imageError, setImageError] = useState('');
  const [imageLoading, setImageLoading] = useState(false); // Nuevo estado para el loader de la imagen

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

  const handleSavePersona = async (imageUrl) => {
    if (!Nombre || !Apellidos) {
      setErrors({
        Nombre: !Nombre,
        Apellidos: !Apellidos,
      });
      return;
    }

    if (user) {
      try {
        let personaRef;
        if (coincide) {
          const q = query(collection(db, "persona"), where("coincide", "==", user.uid));
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            alert("Ya existe una persona registrada como tú");
            return;
          }
          personaRef = doc(db, "persona", user.uid);
          await setDoc(personaRef, {
            Nombre,
            Apellidos,
            biografia,
            instagram,
            creacion: user.uid,
            coincide: user.uid,
            foto: imageUrl || "https://res.cloudinary.com/dk0vvcpyn/image/upload/v1740952724/imagenesdefecto/znmg1esf30tgxcwbgpnl.jpg"
          });
        } else {
          const newPersonaRef = await addDoc(collection(db, "persona"), {
            Nombre,
            Apellidos,
            biografia,
            instagram,
            creacion: user.uid,
            coincide: "",
            foto: imageUrl || "https://res.cloudinary.com/dk0vvcpyn/image/upload/v1740952724/imagenesdefecto/znmg1esf30tgxcwbgpnl.jpg"
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

    if (field === 'idObra') {
      if (typeof value === 'string' && value.startsWith('http')) {
        const id = value.split('/').pop(); // Extrae solo la ID de la URL
        newTrabajos[index][field] = id;
      } else if (typeof value === 'string' && obras.some(obra => obra.id === value)) {
        newTrabajos[index][field] = value; // Solo guarda el ID si ya existe en la lista de obras
      }
    } else {
      newTrabajos[index][field] = value;
    }

    setTrabajos(newTrabajos);
  };

  const handleRemoveTrabajo = (index) => {
    const newTrabajos = [...trabajos];
    newTrabajos.splice(index, 1);
    setTrabajos(newTrabajos);
  };

  const handlePremioChange = (index, field, value) => {
    const newPremiosPersona = [...premiosPersona];
  
    if (field === 'idPremio') {
      if (typeof value === 'string' && value.startsWith('http')) {
        const id = value.split('/').pop(); // Extrae la ID de la URL
        newPremiosPersona[index][field] = id;
      } else if (typeof value === 'string' && premios.some(premio => premio.id === value)) {
        newPremiosPersona[index][field] = value; // Solo guarda si el ID ya existe en la lista de premios
      } 
    } else {
      newPremiosPersona[index][field] = value;
    }
  
    setPremiosPersona(newPremiosPersona);
  };
  

  const handleAddPremio = () => {
    setPremiosPersona([...premiosPersona, { idPremio: '', anioPremio: '', galardonPers: '' }]);
  };

  const handleRemovePremio = (index) => {
    const newPremiosPersona = [...premiosPersona];
    newPremiosPersona.splice(index, 1);
    setPremiosPersona(newPremiosPersona);
  };

  const handleNextStep = () => {
    if (activeStep === 1) {
      for (const trabajo of trabajos) {
        if (!trabajo.idObra || !trabajo.trabajo || !trabajo.departamento || !trabajo.fechaInicio) {
          setErrors({ trabajos: true });
          return;
        }
      }
    } else if (activeStep === 2) {
      for (const premio of premiosPersona) {
        if (!premio.idPremio || !premio.anioPremio || !premio.galardonPers) {
          setErrors({ premiosPersona: true });
          return;
        }
      }
    }
    setActiveStep((prevStep) => prevStep + 1);
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

        setActiveStep(3); // Set active step to 3 instead of showing an alert
      } catch (error) {
        console.error("Error al guardar la información:", error);
      }
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) {
      setImageError("Por favor, selecciona una imagen.");
      return;
    }
    if (!file.type.startsWith("image/")) {
      setImageError("El archivo seleccionado no es una imagen.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) { // 5MB
      setImageError("La imagen es demasiado grande. El tamaño máximo es de 5MB.");
      return;
    }
    setImageError("");
    setImageLoading(true); // Iniciar el loader de la imagen

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'persona'); // Reemplaza 'persona' con tu upload preset de Cloudinary

    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/dk0vvcpyn/image/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        setImageUrl(data.secure_url);
        // Guardar la URL de la imagen en Firebase después de subirla a Cloudinary
        await handleSavePersona(data.secure_url);
      } else {
        console.error("Error al subir la imagen:", data);
        setImageError("Error al subir la imagen. Por favor, inténtalo de nuevo.");
      }
    } catch (error) {
      console.error("Error al subir la imagen:", error);
      setImageError("Error al subir la imagen. Por favor, inténtalo de nuevo.");
    } finally {
      setImageLoading(false); // Detener el loader de la imagen
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
      <Stepper 
        activeStep={activeStep} 
        alternativeLabel 
        sx={{ mb: 4, '& .MuiStepIcon-root': { color: 'black' }, '& .MuiStepIcon-active': { color: 'black' }, '& .MuiStepIcon-completed': { color: 'black' } }}
      >
        <Step><StepLabel>Datos</StepLabel></Step>
        <Step><StepLabel>Trabajos</StepLabel></Step>
        <Step><StepLabel>Premios</StepLabel></Step>
        <Step><StepLabel>Finalizar</StepLabel></Step>
      </Stepper>
      {activeStep === 0 && (
        <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 5 }}>
          <TextField
            label="Nombre"
            value={Nombre}
            onChange={(e) => setNombre(e.target.value)}
            fullWidth
            error={errors.Nombre}
            helperText={errors.Nombre && "Campo requerido"}
          />
          <TextField
            label="Apellidos"
            value={Apellidos}
            onChange={(e) => setApellidos(e.target.value)}
            fullWidth
            error={errors.Apellidos}
            helperText={errors.Apellidos && "Campo requerido"}
          />
          <TextField
            label="Biografía"
            value={biografia}
            onChange={(e) => setBiografia(e.target.value)}
            multiline
            rows={4}
            fullWidth
          />
          <TextField
            label="Instagram (nombre de usuario)"
            value={instagram}
            onChange={(e) => setInstagram(e.target.value)}
            fullWidth
          />
          <Box display="flex" alignItems="center" gap={2}>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ marginTop: '16px' }}
            />
            {imageLoading && <CircularProgress size={24} />} {/* Loader de la imagen */}
          </Box>
          {imageError && (
            <Typography color="error" variant="body2">{imageError}</Typography>
          )}
          {imageUrl && (
            <Box mt={2}>
              <img src={imageUrl} alt="Uploaded" style={{ width: '100%', maxHeight: '300px', objectFit: 'cover' }} />
            </Box>
          )}
          <Button 
            variant="outlined" 
            onClick={() => setCoincide(!coincide)}
            sx={{ 
              color: 'black', 
              borderColor: 'black', 
              '&:hover': { 
                color: 'black', 
                borderColor: 'black' 
              } 
            }}
          >
            {coincide ? "¿No eres tú esta persona?" : "¿Eres tú esta persona?"}
          </Button>

          <Button 
            variant="contained" 
            onClick={() => handleSavePersona(imageUrl)} 
            sx={{ mt: 2, bgcolor: 'black', '&:hover': { bgcolor: 'black' } }}
          >
            Siguiente
          </Button>
        </Box>
      )}
      {activeStep === 1 && (
        <Box>
          {trabajos.map((trabajo, index) => (
            <Box key={index} sx={{ mb: 4, p: 3, border: '1px solid #ddd', borderRadius: 2, boxShadow: 2 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6" gutterBottom>Trabajo {index + 1}</Typography>
                <IconButton onClick={() => handleRemoveTrabajo(index)}><DeleteIcon /></IconButton>
              </Box>
              <Autocomplete sx={{ mb: 2 }}
                options={obras}
                getOptionLabel={(option) => (option?.titulo ? option.titulo : '')}
                value={obras.find((obra) => obra.id === trabajos[index].idObra) || null}
                onChange={(event, newValue) => {
                  if (newValue && typeof newValue === 'object') {
                    handleTrabajoChange(index, 'idObra', newValue.id); // Guarda el ID de la obra seleccionada
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
                        handleTrabajoChange(index, 'idObra', id);
                      }
                    }}
                  />
                )}
              />

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Departamento</InputLabel>
                <Select
                  value={trabajo.departamento}
                  onChange={(e) => handleTrabajoChange(index, 'departamento', e.target.value)}
                  error={errors.trabajos}
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
                value={trabajo.trabajo}
                onChange={(e) => handleTrabajoChange(index, 'trabajo', e.target.value)}
                fullWidth
                sx={{ mb: 2 }}
                error={errors.trabajos}
                helperText={errors.trabajos && "Campo requerido"}
              />

              <TextField
                label="Fecha Inicio"
                type="number"
                value={trabajo.fechaInicio}
                onChange={(e) => handleTrabajoChange(index, 'fechaInicio', e.target.value)}
                fullWidth
                sx={{ mb: 2 }}
                error={errors.trabajos}
                helperText={errors.trabajos && "Campo requerido"}
              />
              <Box display="flex" alignItems="center" gap={2}>
                <TextField
                  label="Fecha Fin"
                  type="number"
                  value={trabajo.fechaFin}
                  onChange={(e) => handleTrabajoChange(index, 'fechaFin', e.target.value)}
                  fullWidth
                />
                <Button variant="outlined" onClick={() => handleTrabajoChange(index, 'fechaFin', 0)}>Actualmente</Button>
              </Box>
            </Box>
          ))}
          <Button 
            variant="contained" 
            onClick={handleAddTrabajo} 
            sx={{ mt: 2, mb: 2, bgcolor: 'black', '&:hover': { bgcolor: 'black' } }}
          >
            Añadir Trabajo
          </Button>
          <Button onClick={() => setActiveStep(0)}>Atrás</Button>
          <Button 
            variant="contained" 
            onClick={handleNextStep} 
            sx={{ bgcolor: 'black', '&:hover': { bgcolor: 'black' } }}
          >
            Siguiente
          </Button>
        </Box>
      )}
      {activeStep === 2 && (
        <Box>
          {premiosPersona.map((premio, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6" gutterBottom>Premio {index + 1}</Typography>
                <IconButton onClick={() => handleRemovePremio(index)}><DeleteIcon /></IconButton>
              </Box>
              <Autocomplete sx={{ mb: 2 }}
                options={premios}
                getOptionLabel={(option) => (option?.nombre_premio ? option.nombre_premio : '')}
                value={premios.find((premio) => premio.id === premiosPersona[index].idPremio) || null}
                onChange={(event, newValue) => {
                  if (newValue && typeof newValue === 'object') {
                    handlePremioChange(index, 'idPremio', newValue.id); // Guarda el ID del premio
                  }
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Premio"
                    fullWidth
                    onBlur={(e) => {
                      const value = e.target.value.trim();

                      if (value.startsWith('http')) {
                        const id = value.split('/').pop(); // Extrae la ID de la URL
                        handlePremioChange(index, 'idPremio', id);
                      }
                    }}
                  />
                )}
              />


              <TextField sx={{ mb: 2 }}
                label="Año del Premio"
                type="number"
                value={premio.anioPremio}
                onChange={(e) => handlePremioChange(index, 'anioPremio', e.target.value)}
                fullWidth
                error={errors.premiosPersona}
                helperText={errors.premiosPersona && "Campo requerido"}
              />
              <TextField sx={{ mb: 2 }}
                label="Galardón de la Persona"
                value={premio.galardonPers}
                onChange={(e) => handlePremioChange(index, 'galardonPers', e.target.value)}
                fullWidth
                error={errors.premiosPersona}
                helperText={errors.premiosPersona && "Campo requerido"}
              />
            </Box>
          ))}
          <Button onClick={handleAddPremio} variant="outlined" sx={{ mt: 2 }}>Añadir Premio</Button>
          <Box display="flex" justifyContent="space-between" sx={{ mt: 2 }}>
            <Button onClick={() => setActiveStep(1)}>Atrás</Button>
            <Button 
              variant="contained" 
              onClick={handleFinalSubmit} 
              sx={{ bgcolor: 'black', '&:hover': { bgcolor: 'black' } }}
            >
              Finalizar
            </Button>
          </Box>
        </Box>
      )}
      {activeStep === 3 && (
        <Box>
          <Container maxWidth="sm" sx={{ py: 4, textAlign: 'center' }}>
            <Typography variant="h5" sx={{ mb: 2 }}>¡Perfil Creado!</Typography>
            <Typography variant="body1" sx={{ mb: 4 }}>
              Este perfil ha sido guardado exitosamente.
            </Typography>
            <Box />
            <Button 
              variant="contained" 
              href="/" 
              sx={{ bgcolor: 'black', '&:hover': { bgcolor: 'black' } }}
            >
              Ir al inicio
            </Button>
          </Container>
        </Box>
      )}
    </Container>
  );
}

export default NewUserProfile;