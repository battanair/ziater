import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, doc, getDoc, setDoc, addDoc } from "firebase/firestore";
import { auth, db } from '../firebaseConfig';
import { Container, TextField, Button, Stepper, Step, StepLabel, Box, CircularProgress, Typography } from '@mui/material';

function NewCompanyProfile() {
  const { id } = useParams(); // Obtener el id de los parámetros de la URL
  const [activeStep, setActiveStep] = useState(0);
  const [nombreProd, setNombreProd] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [instagram, setInstagram] = useState('');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [imageUrl, setImageUrl] = useState('');
  const [imageError, setImageError] = useState('');
  const [imageLoading, setImageLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const fetchCompanyData = async () => {
      if (id) {
        const docRef = doc(db, 'productoras', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setNombreProd(data.nombre_prod);
          setDescripcion(data.descripcion);
          setInstagram(data.instagram);
          setImageUrl(data.foto_prod);
        }
      }
    };

    fetchCompanyData();
  }, [id]);

  const handleSaveCompany = async (imageUrl) => {
    if (!nombreProd || !descripcion || !instagram) {
      setErrors({
        nombreProd: !nombreProd,
        descripcion: !descripcion,
        instagram: !instagram, 
      });
      return;
    }

    if (user) {
      try {
        const companyData = {
          nombre_prod: nombreProd,
          descripcion,
          instagram, // Guardar Instagram
          creacion: user.uid,
          foto_prod: imageUrl || "https://picsum.photos/300/300",
        };

        if (id) {
          await setDoc(doc(db, 'productoras', id), companyData);
        } else {
          await addDoc(collection(db, "productoras"), companyData);
        }

        setActiveStep(1);
      } catch (error) {
        console.error("Error al guardar la información de la compañía:", error);
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
    if (file.size > 5 * 1024 * 1024) {
      setImageError("La imagen es demasiado grande. El tamaño máximo es de 5MB.");
      return;
    }
  
    setImageError("");
    setImageLoading(true);
  
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'productora');
  
    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/dk0vvcpyn/image/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        setImageUrl(data.secure_url);
        console.log("Imagen subida con éxito:", data.secure_url);
        
        // Esperar a que setImageUrl termine antes de llamar a handleSaveCompany
        setTimeout(() => {
          handleSaveCompany(data.secure_url);
        }, 500);
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
    setNombreProd('');
    setDescripcion('');
    setInstagram('');
    setImageUrl('');
    setImageError('');
    setErrors({});
    setActiveStep(0);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh" bgcolor="black !important">
        <CircularProgress sx={{ color: 'white' }} />
      </Box>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
        <Step>
          <StepLabel StepIconProps={{ sx: { color: 'black !important' } }}>Datos de la Compañía</StepLabel>
        </Step>
        <Step>
          <StepLabel StepIconProps={{ sx: { color: 'black !important' } }}>Finalizar</StepLabel>
        </Step>
      </Stepper>

      {activeStep === 0 && (
        <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 5 }}>
          <TextField
            label="Nombre de la Compañía"
            value={nombreProd}
            onChange={(e) => setNombreProd(e.target.value)}
            fullWidth
            error={errors.nombreProd}
            helperText={errors.nombreProd && "Campo requerido"}
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
            label="Instagram"
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

          <Button onClick={() => handleSaveCompany(imageUrl)} variant="contained" sx={{ mt: 2, backgroundColor: 'black', color: 'white' }}>{id ? 'Actualizar' : 'Crear'}</Button>
        </Box>
      )}

      {activeStep === 1 && (
        <Box textAlign="center">
          <Typography variant="h5" gutterBottom>¡Compañía {id ? 'actualizada' : 'registrada'} con éxito!</Typography>
          <Button variant="contained" onClick={handleResetForm} sx={{ backgroundColor: 'black', color: 'white' }}>Registrar otra</Button>
        </Box>
      )}
    </Container>
  );
}

export default NewCompanyProfile;
