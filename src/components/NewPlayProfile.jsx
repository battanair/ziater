import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, setDoc, collection, getDocs, addDoc, query, where } from "firebase/firestore";
import { auth, db } from '../firebaseConfig';
import { Container, TextField, Button, Stepper, Step, StepLabel, Box, Select, MenuItem, CircularProgress, FormControl, InputLabel, Autocomplete, Typography, IconButton, Checkbox, FormControlLabel, FormGroup, FormLabel, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

function NewPlayProfile() {
  const [activeStep, setActiveStep] = useState(0);
  const [titulo, setTitulo] = useState('');
  const [sinopsis, setSinopsis] = useState('');
  const [instagram, setInstagram] = useState('');
  const [anoinicio, setAnoinicio] = useState('');
  const [anofin, setAnofin] = useState('');
  const [cartel, setCartel] = useState('');
  const [categoria, setCategoria] = useState([]);
  const [fotosObra, setFotosObra] = useState([]);
  const [trailer, setTrailer] = useState('');
  const [trabajos, setTrabajos] = useState([]);
  const [premiosPersona, setPremiosPersona] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [imageError, setImageError] = useState('');
  const [imageLoading, setImageLoading] = useState(false);
  const [premios, setPremios] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentTrabajoIndex, setCurrentTrabajoIndex] = useState(null);
  const [artistas, setArtistas] = useState([]);
  const [obraId, setObraId] = useState(null); // Nueva variable de estado para guardar el ID de la obra
  const [currentPremioIndex, setCurrentPremioIndex] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        await fetchPremios();
        await fetchArtistas();
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const agregarArtista = () => {
    setTrabajos([...trabajos, { idPersona: '', titulo: '', trabajo: '', departamento: '', fechaInicio: '', fechaFin: '' }]);
    setCurrentTrabajoIndex(trabajos.length);
    setOpenDialog(true);
  };

  const fetchPremios = async () => {
    const premiosSnapshot = await getDocs(collection(db, "premios"));
    setPremios(premiosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const fetchArtistas = async () => {
    const artistasSnapshot = await getDocs(collection(db, "persona"));
    setArtistas(artistasSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const handleSaveObra = async (cartelUrl) => {
    if (!titulo || !sinopsis || !anoinicio) {
      setErrors({
        titulo: !titulo,
        sinopsis: !sinopsis,
        anoinicio: !anoinicio,
      });
      return;
    }

    if (user) {
      try {
        const newObraRef = await addDoc(collection(db, "obra"), {
          titulo,
          sinopsis,
          instagram,
          anoinicio,
          anofin: anofin || 0,
          cartel: cartelUrl || "https://picsum.photos/200/300",
          categoria,
          creacion: user.uid,
          fotos_obra: fotosObra,
          trailer,
        });
        setObraId(newObraRef.id); // Guardar el ID de la obra creada
        setActiveStep(1);
      } catch (error) {
        console.error("Error al guardar la información de la obra:", error);
      }
    }
  };

  const handleImageUpload = async (event, setImageUrl) => {
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
    setImageLoading(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'obrafotos'); // Reemplaza 'obrafotos' con tu upload preset de Cloudinary

    try {
      const response = await fetch("https://api.cloudinary.com/v1_1/dk0vvcpyn/image/upload", {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        setImageUrl(data.secure_url);
        await handleSaveObra(data.secure_url);
      } else {
        console.error("Error al subir la imagen:", data);
        setImageError("Error al subir la imagen. Por favor, inténtalo de nuevo.");
      }
    } catch (error) {
      console.error("Error al subir la imagen:", error);
      setImageError("Error al subir la imagen. Por favor, inténtalo de nuevo.");
    } finally {
      setImageLoading(false);
    }
  };

  const handleMultipleImageUpload = async (event, index) => {
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
    setImageLoading(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'obrafotos'); // Reemplaza 'obrafotos' con tu upload preset de Cloudinary

    try {
      const response = await fetch("https://api.cloudinary.com/v1_1/dk0vvcpyn/image/upload", {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        const newFotosObra = [...fotosObra];
        newFotosObra[index] = data.secure_url;
        setFotosObra(newFotosObra);
      } else {
        console.error("Error al subir la imagen:", data);
        setImageError("Error al subir la imagen. Por favor, inténtalo de nuevo.");
      }
    } catch (error) {
      console.error("Error al subir la imagen:", error);
      setImageError("Error al subir la imagen. Por favor, inténtalo de nuevo.");
    } finally {
      setImageLoading(false);
    }
  };

  const handleCategoriaChange = (event) => {
    const value = event.target.value;
    setCategoria((prev) => {
      if (prev.includes(value)) {
        return prev.filter((item) => item !== value);
      } else {
        return [...prev, value];
      }
    });
  };

  const handleAddTrabajo = () => {
    setTrabajos([...trabajos, { idPersona: '', titulo: '', trabajo: '', departamento: '', fechaInicio: '', fechaFin: '' }]);
    setCurrentTrabajoIndex(trabajos.length);
    setOpenDialog(true);
  };

  const handleTrabajoChange = (index, field, value) => {
    const newTrabajos = [...trabajos];
    newTrabajos[index][field] = value;
    setTrabajos(newTrabajos);
  };

  const handleRemoveTrabajo = (index) => {
    const newTrabajos = [...trabajos];
    newTrabajos.splice(index, 1);
    setTrabajos(newTrabajos);
    setCurrentTrabajoIndex(null);
  };

  const handleSaveTrabajo = () => {
    const trabajo = trabajos[currentTrabajoIndex];
    if (!trabajo.idPersona || !trabajo.departamento || !trabajo.trabajo || !trabajo.fechaInicio) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        trabajos: true,
      }));
      return;
    }
    setErrors((prevErrors) => ({
      ...prevErrors,
      trabajos: false,
    }));
    setOpenDialog(false);
  };

  const handleSavePremio = () => {
    const premio = premiosPersona[currentPremioIndex];
    if (!premio.idPremio || !premio.anioPremio || !premio.galardonPers) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        premiosPersona: true,
      }));
      return;
    }
    setErrors((prevErrors) => ({
      ...prevErrors,
      premiosPersona: false,
    }));
    setOpenDialog(false);
  };

  const handleRemovePremio = (index) => {
    const newPremiosPersona = [...premiosPersona];
    newPremiosPersona.splice(index, 1);
    setPremiosPersona(newPremiosPersona);
  };

  const handleAddPremio = () => {
    setPremiosPersona([...premiosPersona, { idPremio: '', anioPremio: '', galardonPers: '' }]);
    setCurrentPremioIndex(premiosPersona.length);
  };

  const handlePremioChange = (index, field, value) => {
    const newPremiosPersona = [...premiosPersona];
    newPremiosPersona[index][field] = value;
    setPremiosPersona(newPremiosPersona);
  };

  const handleNextStep = () => {
    if (activeStep === 1) {
      for (const trabajo of trabajos) {
        if (!trabajo.idPersona || !trabajo.trabajo || !trabajo.departamento || !trabajo.fechaInicio) {
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
    if (user && obraId) { // Asegurarse de que obraId está disponible
      try {
        for (const trabajo of trabajos) {
          await addDoc(collection(db, "persona_obra"), {
            id_persona: trabajo.idPersona,
            id_obra: obraId, // Usar el ID de la obra creada
            titulo: trabajo.trabajo,
            puesto: trabajo.departamento,
            fecha_inicio: trabajo.fechaInicio.toString(),
            fecha_fin: trabajo.fechaFin.toString(),
          });
        }

        for (const premio of premiosPersona) {
          await addDoc(collection(db, "premios_obras"), {
            id_premio: premio.idPremio,
            id_obra: obraId, // Usar el ID de la obra creada
            anio_premobr: parseInt(premio.anioPremio, 10), // Asegurarse de que el año se guarda correctamente
            galardon_obra: premio.galardonPers,
          });
        }

        setActiveStep(3);
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
        <Step><StepLabel>Datos</StepLabel></Step>
        <Step><StepLabel>Artistas</StepLabel></Step>
        <Step><StepLabel>Premios</StepLabel></Step>
        <Step><StepLabel>Finalizar</StepLabel></Step>
      </Stepper>
      {activeStep === 0 && (
        <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 5 }}>
          <TextField
            label="Título"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            fullWidth
            error={errors.titulo}
            helperText={errors.titulo && "Campo requerido"}
          />
          <TextField
            label="Sinopsis"
            value={sinopsis}
            onChange={(e) => setSinopsis(e.target.value)}
            multiline
            rows={4}
            fullWidth
            error={errors.sinopsis}
            helperText={errors.sinopsis && "Campo requerido"}
          />
          <TextField
            label="Instagram"
            value={instagram}
            onChange={(e) => setInstagram(e.target.value)}
            fullWidth
          />
          <TextField
            label="Año de Inicio"
            type="number"
            value={anoinicio}
            onChange={(e) => setAnoinicio(e.target.value)}
            fullWidth
            error={errors.anoinicio}
            helperText={errors.anoinicio && "Campo requerido"}
          />
          <Box display="flex" alignItems="center" gap={2}>
            <TextField
              label="Año de Fin"
              type="number"
              value={anofin}
              onChange={(e) => setAnofin(e.target.value)}
              fullWidth
            />
            <Button variant="outlined" onClick={() => setAnofin(0)}>Actualmente</Button>
          </Box>
          <Box display="flex" flexDirection="column" gap={1}>
            <Typography variant="body1">CARTEL:</Typography>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, setCartel)}
              style={{ marginTop: '16px' }}
            />
            {imageLoading && <CircularProgress size={24} />}
          </Box>
          <Typography variant="body1" sx={{ mt: 2 }}>IMÁGENES DE LA OBRA:</Typography>
          {[0, 1, 2, 3].map((index) => (
            <Box key={index} display="flex" alignItems="center" gap={2}>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleMultipleImageUpload(e, index)}
                style={{ marginTop: '16px' }}
              />
              {imageLoading && <CircularProgress size={24} />}
            </Box>
          ))}
          {imageError && (
            <Typography color="error" variant="body2">{imageError}</Typography>
          )}
          {cartel && (
            <Box mt={2}>
              <img src={cartel} alt="Uploaded" style={{ width: '100%', maxHeight: '300px', objectFit: 'cover' }} />
            </Box>
          )}
          {fotosObra.map((foto, index) => (
            <Box key={index} mt={2}>
              <img src={foto} alt={`Uploaded ${index}`} style={{ width: '100%', maxHeight: '300px', objectFit: 'cover' }} />
            </Box>
          ))}
          <FormControl component="fieldset">
            <FormLabel component="legend">Categoría</FormLabel>
            <FormGroup sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
              {[
                'Comedia', 'Teatro', 'Impro', 'Circo', 'Musicales', 'Stand up', 'Danza', 
                'Drag', 'Ópera', 'Zarzuela', 'Performance', 'Ficción sonora', 'Magia', 
                 'Microteatro', 'Monólogo', 'Mimo', 'Poesía', 'Títeres', 'Variedades', 'Otros'
              ].map((cat) => (
                <FormControlLabel
                  key={cat}
                  control={<Checkbox checked={categoria.includes(cat)} onChange={handleCategoriaChange} value={cat} />}
                  label={cat}
                  sx={{ width: '30%' }} // Ajusta el ancho para distribuir en tres columnas
                />
              ))}
            </FormGroup>
          </FormControl>
          <TextField
            label="Trailer"
            value={trailer}
            onChange={(e) => setTrailer(e.target.value)}
            fullWidth
          />
          <Button onClick={() => handleSaveObra(cartel)} variant="contained" sx={{ mt: 2 }}>Siguiente</Button>
        </Box>
      )}
      {activeStep === 1 && (
        <Box>
          <Button variant="contained" onClick={handleAddTrabajo} sx={{ mt: 2, mb: 2 }}>Añadir Artista</Button>
          {trabajos.length > 0 && trabajos.map((trabajo, index) => (
            <Box key={index} sx={{ mb: 4, p: 3, border: '1px solid #ddd', borderRadius: 2, boxShadow: 2 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6" gutterBottom>Artista {index + 1}</Typography>
                <IconButton onClick={() => handleRemoveTrabajo(index)}><DeleteIcon /></IconButton>
              </Box>
              <Button variant="outlined" onClick={() => { setCurrentTrabajoIndex(index); setOpenDialog(true); }}>Editar</Button>
            </Box>
          ))}
          <Button onClick={() => setActiveStep(0)}>Atrás</Button>
          <Button onClick={handleNextStep}>Siguiente</Button>
        </Box>
      )}
      {activeStep === 2 && (
        <Box>
          <Button onClick={handleAddPremio} variant="outlined" sx={{ mt: 2 }}>Añadir Premio</Button>
          {premiosPersona.map((premio, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6" gutterBottom>Premio {index + 1}</Typography>
                <IconButton onClick={() => handleRemovePremio(index)}><DeleteIcon /></IconButton>
              </Box>
              <Autocomplete
                options={premios}
                getOptionLabel={(option) => (option?.nombre_premio ? option.nombre_premio : '')}
                value={premios.find((premio) => premio.id === premiosPersona[index]?.idPremio) || null}
                onChange={(event, newValue) => {
                  if (newValue && typeof newValue === 'object') {
                    handlePremioChange(index, 'idPremio', newValue.id);
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
                        const id = value.split('/').pop();
                        handlePremioChange(index, 'idPremio', id);
                      }
                    }}
                  />
                )}
              />
              <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                Si no encuentras el premio que buscas, pega la URL de su página.
              </Typography>
              <TextField
                sx={{ mb: 2 }}
                label="Año del Premio"
                type="number"
                value={premio.anioPremio}
                onChange={(e) => handlePremioChange(index, 'anioPremio', e.target.value)}
                fullWidth
                error={errors.premiosPersona}
                helperText={errors.premiosPersona && "Campo requerido"}
              />
              <TextField
                sx={{ mb: 2 }}
                label="Galardón de la Persona"
                value={premio.galardonPers}
                onChange={(e) => handlePremioChange(index, 'galardonPers', e.target.value)}
                fullWidth
                error={errors.premiosPersona}
                helperText={errors.premiosPersona && "Campo requerido"}
              />
            </Box>
          ))}
          <Box display="flex" justifyContent="space-between" sx={{ mt: 2 }}>
            <Button onClick={() => setActiveStep(1)}>Atrás</Button>
            <Button onClick={handleFinalSubmit} variant="contained">Finalizar</Button>
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
            <Button variant="contained" href="/">Ir al inicio</Button>
          </Container>
        </Box>
      )}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Editar Artista</DialogTitle>
        <DialogContent>
          {currentTrabajoIndex !== null && (
            <>
              <Autocomplete sx={{ mb: 2 }}
                options={artistas}
                getOptionLabel={(option) => (option?.Nombre ? option.Nombre : '')}
                value={artistas.find((persona) => persona.id === trabajos[currentTrabajoIndex]?.idPersona) || null}
                onChange={(event, newValue) => {
                  if (newValue && typeof newValue === 'object') {
                    handleTrabajoChange(currentTrabajoIndex, 'idPersona', newValue.id);
                  }
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Persona"
                    fullWidth
                    onBlur={(e) => {
                      const value = e.target.value.trim();

                      if (value.startsWith('http')) {
                        const id = value.split('/').pop();
                        handleTrabajoChange(currentTrabajoIndex, 'idPersona', id);
                      }
                    }}
                  />
                )}
              />
              <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                Si no encuentras la persona que buscas, pega la URL de su página.
              </Typography>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Departamento</InputLabel>
                <Select
                  value={trabajos[currentTrabajoIndex].departamento}
                  onChange={(e) => handleTrabajoChange(currentTrabajoIndex, 'departamento', e.target.value)}
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
                value={trabajos[currentTrabajoIndex].trabajo}
                onChange={(e) => handleTrabajoChange(currentTrabajoIndex, 'trabajo', e.target.value)}
                fullWidth
                sx={{ mb: 2 }}
                error={errors.trabajos}
                helperText={errors.trabajos && "Campo requerido"}
              />
              <TextField
                label="Fecha Inicio"
                type="number"
                value={trabajos[currentTrabajoIndex].fechaInicio}
                onChange={(e) => handleTrabajoChange(currentTrabajoIndex, 'fechaInicio', e.target.value)}
                fullWidth
                sx={{ mb: 2 }}
                error={errors.trabajos}
                helperText={errors.trabajos && "Campo requerido"}
              />
              <Box display="flex" alignItems="center" gap={2}>
                <TextField
                  label="Fecha Fin"
                  type="number"
                  value={trabajos[currentTrabajoIndex].fechaFin}
                  onChange={(e) => handleTrabajoChange(currentTrabajoIndex, 'fechaFin', e.target.value)}
                  fullWidth
                />
                <Button variant="outlined" onClick={() => handleTrabajoChange(currentTrabajoIndex, 'fechaFin', 0)}>Actualmente</Button>
              </Box>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button onClick={handleSaveTrabajo} variant="contained">Guardar</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default NewPlayProfile;