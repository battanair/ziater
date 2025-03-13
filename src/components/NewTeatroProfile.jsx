import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, addDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from '../firebaseConfig';
import { Container, TextField, Button, Stepper, Step, StepLabel, Box, CircularProgress, Typography } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          backgroundColor: 'black',
          '&:hover': {
            backgroundColor: 'black',
          },
        },
      },
    },
    MuiStepIcon: {
      styleOverrides: {
        root: {
          color: 'grey', // Color for the next steps
          '&.Mui-active': {
            color: 'black', // Color for the active step
          },
          '&.Mui-completed': {
            color: 'black', // Color for the completed steps
          },
        },
      },
    },
  },
});

function NewTeatroProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
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

  useEffect(() => {
    const fetchTeatro = async () => {
      if (id) {
        try {
          const teatroRef = doc(db, 'teatro', id);
          const teatroSnap = await getDoc(teatroRef);

          if (teatroSnap.exists()) {
            const teatroData = teatroSnap.data();
            setNombreTeatro(teatroData.nombre_teatro);
            setDescripcion(teatroData.descripcion);
            setCiudad(teatroData.ciudad);
            setDireccion(teatroData.direccion);
            setPais(teatroData.pais);
            setInstagram(teatroData.instagram);
            setImageUrl(teatroData.foto);
          } else {
            console.error('El teatro no existe en Firestore.');
          }
        } catch (error) {
          console.error('Error obteniendo el teatro:', error);
        }
      }
    };

    fetchTeatro();
  }, [id]);

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
        const teatroData = {
          nombre_teatro: nombreTeatro,
          descripcion,
          ciudad,
          direccion,
          pais,
          instagram,
          creacion: user.uid,
          foto: imageUrl || "https://res.cloudinary.com/dk0vvcpyn/image/upload/v1740952724/imagenesdefecto/iuumtdngmus9nqlnse7f.jpg",
        };

        if (id) {
          const teatroRef = doc(db, 'teatro', id);
          await updateDoc(teatroRef, teatroData);
          console.log("Teatro actualizado con éxito.");
        } else {
          await addDoc(collection(db, "teatro"), teatroData);
          console.log("Teatro guardado con éxito.");
        }

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
    <ThemeProvider theme={theme}>
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
            <Typography variant="h5" gutterBottom>¡Teatro {id ? 'actualizado' : 'registrado'} con éxito!</Typography>
            <Button variant="contained" onClick={handleResetForm}>Registrar otro</Button>
          </Box>
        )}
      </Container>
    </ThemeProvider>
  );
}

export default NewTeatroProfile;
