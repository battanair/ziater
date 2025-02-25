import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { auth, db } from '../firebaseConfig';
import { Container, TextField, Button, Stepper, Step, StepLabel, Box, CircularProgress, Typography } from '@mui/material';

function NewTeatroProfile() {
  const [activeStep, setActiveStep] = useState(0);
  const [nombreTeatro, setNombreTeatro] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [direccion, setDireccion] = useState('');
  const [pais, setPais] = useState('');
  const [instagram, setInstagram] = useState('');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [imageUrl, setImageUrl] = useState('');
  const [imageError, setImageError] = useState('');
  const [imageLoading, setImageLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const handleSaveTeatro = async () => {
    if (!nombreTeatro || !descripcion || !ciudad || !direccion || !pais || !instagram) {
      setErrors({
        nombreTeatro: !nombreTeatro,
        descripcion: !descripcion,
        ciudad: !ciudad,
        direccion: !direccion,
        pais: !pais,
        instagram: !instagram,
      });
      return;
    }

    if (user) {
      try {
        console.log("Guardando teatro en Firestore...");
        console.log("Datos del teatro:", {
          nombre_teatro: nombreTeatro,
          descripcion,
          ciudad,
          direccion,
          pais,
          instagram,
          creacion: user.uid,
          foto: imageUrl || "https://picsum.photos/200/300",
        });

        await addDoc(collection(db, "teatro"), {
          nombre_teatro: nombreTeatro,
          descripcion,
          ciudad,
          direccion,
          pais,
          instagram,
          creacion: user.uid,
          foto: imageUrl || "https://picsum.photos/200/300",
        });

        console.log("Teatro guardado con éxito.");
        setActiveStep(1);
      } catch (error) {
        console.error("Error al guardar la información del teatro:", error);
      }
    } else {
      console.error("Usuario no autenticado.");
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
    if (file.size > 5 * 1024 * 1024) {
      setImageError("La imagen es demasiado grande. El tamaño máximo es de 5MB.");
      return;
    }
  
    setImageError("");
    setImageLoading(true);
  
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'teatro');
  
    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/dk0vvcpyn/image/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        setImageUrl(data.secure_url);
        console.log("Imagen subida con éxito:", data.secure_url);
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

  const handleResetForm = () => {
    setNombreTeatro('');
    setDescripcion('');
    setCiudad('');
    setDireccion('');
    setPais('');
    setInstagram('');
    setImageUrl('');
    setImageError('');
    setErrors({});
    setActiveStep(0);
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
        <Step><StepLabel>Datos del Teatro</StepLabel></Step>
        <Step><StepLabel>Finalizar</StepLabel></Step>
      </Stepper>

      {activeStep === 0 && (
        <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 5 }}>
          <TextField
            label="Nombre del Teatro"
            value={nombreTeatro}
            onChange={(e) => setNombreTeatro(e.target.value)}
            fullWidth
            error={errors.nombreTeatro}
            helperText={errors.nombreTeatro && "Campo requerido"}
          />
          <TextField
            label="Descripción"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            multiline
            rows={4}
            fullWidth
            error={errors.descripcion}
            helperText={errors.descripcion && "Campo requerido"}
          />
          
          <TextField
            label="Dirección"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
            fullWidth
            error={errors.direccion}
            helperText={errors.direccion && "Campo requerido"}
          />
          <TextField
            label="Ciudad"
            value={ciudad}
            onChange={(e) => setCiudad(e.target.value)}
            fullWidth
            error={errors.ciudad}
            helperText={errors.ciudad && "Campo requerido"}
          />
          <TextField
            label="País"
            value={pais}
            onChange={(e) => setPais(e.target.value)}
            fullWidth
            error={errors.pais}
            helperText={errors.pais && "Campo requerido"}
          />
          <TextField
            label="Instagram"
            value={instagram}
            onChange={(e) => setInstagram(e.target.value)}
            fullWidth
            error={errors.instagram}
            helperText={errors.instagram && "Campo requerido"}
          />
          <Box display="flex" alignItems="center" gap={2}>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ marginTop: '16px' }}
            />
            {imageLoading && <CircularProgress size={24} />}
          </Box>
          {imageError && (
            <Typography color="error" variant="body2">{imageError}</Typography>
          )}
          {imageUrl && (
            <Box mt={2}>
              <img src={imageUrl} alt="Uploaded" style={{ width: '100%', maxHeight: '300px', objectFit: 'cover' }} />
            </Box>
          )}

          <Button onClick={handleSaveTeatro} variant="contained" sx={{ mt: 2 }}>Siguiente</Button>
        </Box>
      )}

      {activeStep === 1 && (
        <Box textAlign="center">
          <Typography variant="h5" gutterBottom>¡Teatro registrado con éxito!</Typography>
          <Button variant="contained" onClick={handleResetForm}>Registrar otro</Button>
        </Box>
      )}
    </Container>
  );
}

export default NewTeatroProfile;
