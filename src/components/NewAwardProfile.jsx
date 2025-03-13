import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, doc, getDoc, setDoc, addDoc } from "firebase/firestore";
import { auth, db } from '../firebaseConfig';
import { Container, TextField, Button, Stepper, Step, StepLabel, Box, CircularProgress, Typography } from '@mui/material';
import { StepIconProps } from '@mui/material/StepIcon';

const StepIcon = (props) => {
  const { active, completed, className } = props;

  return (
    <div
      className={className}
      style={{
        backgroundColor: active || completed ? 'black' : 'grey',
        borderRadius: '50%',
        width: 24,
        height: 24,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
      }}
    >
      {props.icon}
    </div>
  );
};

function NewAwardProfile() {
  const { id } = useParams(); // Obtener el id de los parámetros de la URL
  const [activeStep, setActiveStep] = useState(0);
  const [nombrePremio, setNombrePremio] = useState('');
  const [bioPremio, setBioPremio] = useState('');
  const [instaPremio, setInstaPremio] = useState('');
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
    const fetchAwardData = async () => {
      if (id) {
        const docRef = doc(db, 'premios', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setNombrePremio(data.nombre_premio);
          setBioPremio(data.bio_premio);
          setInstaPremio(data.insta_premio);
          setImageUrl(data.foto_premio);
        }
      }
    };

    fetchAwardData();
  }, [id]);

  const handleSaveAward = async (imageUrl) => {
    let newErrors = {};
    if (!nombrePremio) newErrors.nombrePremio = "Campo obligatorio";
    if (!bioPremio) newErrors.bioPremio = "Campo obligatorio";
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (user) {
      try {
        const awardData = {
          nombre_premio: nombrePremio,
          bio_premio: bioPremio,
          insta_premio: instaPremio || "", // No obligatorio
          creacion: user.uid,
          foto_premio: imageUrl || "https://picsum.photos/200/300",
        };

        if (id) {
          await setDoc(doc(db, 'premios', id), awardData);
        } else {
          await addDoc(collection(db, "premios"), awardData);
        }

        setActiveStep(1);
      } catch (error) {
        console.error("Error al guardar la información del premio:", error);
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
      setImageError("La imagen es demasiado grande. Máximo 5MB.");
      return;
    }
  
    setImageError("");
    setImageLoading(true);
  
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'premios');
  
    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/dk0vvcpyn/image/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        setImageUrl(data.secure_url);
        setTimeout(() => {
          handleSaveAward(data.secure_url);
        }, 500);
      } else {
        setImageError("Error al subir la imagen. Inténtalo de nuevo.");
      }
    } catch (error) {
      setImageError("Error al subir la imagen. Inténtalo de nuevo.");
    } finally {
      setImageLoading(false);
    }
  };

  const handleResetForm = () => {
    setNombrePremio('');
    setBioPremio('');
    setInstaPremio('');
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
        <Step>
          <StepLabel StepIconComponent={StepIcon}>Datos de los Premios</StepLabel>
        </Step>
        <Step>
          <StepLabel StepIconComponent={StepIcon}>Finalizar</StepLabel>
        </Step>
      </Stepper>

      {activeStep === 0 && (
        <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 5 }}>
          <TextField
            label="Nombre del Premio"
            value={nombrePremio}
            onChange={(e) => setNombrePremio(e.target.value)}
            fullWidth
            error={!!errors.nombrePremio}
            helperText={errors.nombrePremio}
          />
          <TextField
            label="Descripción"
            value={bioPremio}
            onChange={(e) => setBioPremio(e.target.value)}
            multiline
            rows={4}
            fullWidth
            error={!!errors.bioPremio}
            helperText={errors.bioPremio}
          />
          <TextField
            label="Instagram"
            value={instaPremio}
            onChange={(e) => setInstaPremio(e.target.value)}
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

          <Button onClick={() => handleSaveAward(imageUrl)} variant="contained" sx={{ mt: 2, backgroundColor: 'black', color: 'white' }}>{id ? 'Actualizar' : 'Crear'}</Button>
        </Box>
      )}

      {activeStep === 1 && (
        <Box textAlign="center">
          <Typography variant="h5" gutterBottom>¡Premio {id ? 'actualizado' : 'registrado'} con éxito!</Typography>
          <Button variant="contained" onClick={handleResetForm} sx={{ backgroundColor: 'black', color: 'white' }}>Registrar otro</Button>
        </Box>
      )}
    </Container>
  );
}

export default NewAwardProfile;
