import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, doc, getDoc, setDoc, addDoc, updateDoc, getDocs } from "firebase/firestore";
import { auth, db } from '../firebaseConfig';
import { Container, TextField, Button, Stepper, Step, StepLabel, Box, CircularProgress, Typography } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';

function NewCompanyProfile() {
  const { id: paramId } = useParams(); // Renombrar el id de useParams para evitar conflictos
  const [id, setId] = useState(paramId || null); // Crear un estado local para el id
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
  const [selectedObras, setSelectedObras] = useState([]);
  const [obras, setObras] = useState([]);
  const [obraNotFound, setObraNotFound] = useState('');
  const [obraInput, setObraInput] = useState('');

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

  useEffect(() => {
    const fetchObras = async () => {
      const obrasSnapshot = await getDocs(collection(db, "obra"));
      setObras(obrasSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    fetchObras();
  }, []);

  const handleSaveCompany = async (imageUrl) => {
    if (!nombreProd || !descripcion || !instagram) {
      setErrors({
        nombreProd: !nombreProd,
        descripcion: !descripcion,
        instagram: !instagram,
      });
      return null; // Retornar null si hay errores
    }

    if (user) {
      try {
        const companyData = {
          nombre_prod: nombreProd,
          descripcion,
          instagram,
          creacion: user.uid,
          foto_prod: imageUrl || "https://res.cloudinary.com/dk0vvcpyn/image/upload/v1740952724/imagenesdefecto/hunzspleabjaukt6s2xw.jpg",
        };

        let newId = id;

        if (id) {
          // Actualizar una productora existente
          await setDoc(doc(db, 'productoras', id), companyData);
        } else {
          // Crear una nueva productora
          const docRef = await addDoc(collection(db, "productoras"), companyData);
          newId = docRef.id; // Obtener el ID de la nueva productora
          setId(newId); // Actualizar el estado con el nuevo ID
        }

        return newId; // Retornar el ID de la productora
      } catch (error) {
        console.error("Error al guardar la información de la compañía:", error);
        return null;
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

  const handleAddObraToCompany = async (obraId) => {
    try {
      const obraRef = doc(db, 'obra', obraId);
      const obraSnap = await getDoc(obraRef);

      if (obraSnap.exists()) {
        const obraData = obraSnap.data();
        const updatedProductoras = [...(obraData.productoras || []), id || 'new_company_id'];

        await updateDoc(obraRef, { productoras: updatedProductoras });
        setSelectedObras((prev) => [...prev, obraData]);
        setObraNotFound('');
      } else {
        setObraNotFound('Obra no encontrada');
      }
    } catch (error) {
      console.error('Error al añadir la obra a la compañía:', error);
    }
  };

  const handleObraInputBlur = async () => {
    if (obraInput.startsWith('http')) {
      const obraId = obraInput.split('/').pop();
      await handleAddObraToCompany(obraId);
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

  const handleNextStep = async () => {
    if (activeStep === 0) {
      // Validar campos obligatorios
      const newErrors = {
        nombreProd: !nombreProd,
        descripcion: !descripcion,
        instagram: !instagram,
      };
      setErrors(newErrors);

      // Si no hay errores, guardar y avanzar
      if (!Object.values(newErrors).some((error) => error)) {
        const newId = await handleSaveCompany(imageUrl);
        if (newId) {
          setActiveStep((prev) => prev + 1); // Avanzar al siguiente paso solo si se creó la productora
        }
      }
    } else {
      setActiveStep((prev) => prev + 1);
    }
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
        {['Datos de la Compañía', 'Añadir Obras', 'Finalizar'].map((label, index) => (
          <Step key={label}>
            <StepLabel StepIconProps={{
              sx: {
                color: index === activeStep ? 'black !important' : index < activeStep ? 'black !important' : 'gray !important'
              }
            }}>
              {label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>

      {activeStep === 0 && (
        <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 5 }}>
          <TextField
            label="Nombre de la Compañía *"
            value={nombreProd}
            onChange={(e) => {
              setNombreProd(e.target.value);
              setErrors((prev) => ({ ...prev, nombreProd: false }));
            }}
            fullWidth
            error={errors.nombreProd}
            helperText={errors.nombreProd && "El nombre de la compañía es obligatorio"}
            InputLabelProps={{
              sx: { color: 'black', '&.Mui-focused': { color: 'black' } }, // Cambiar color del placeholder activo
            }}
            InputProps={{
              sx: { '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'black' } }
            }}
          />
          <TextField
            label="Descripción *"
            value={descripcion}
            onChange={(e) => {
              setDescripcion(e.target.value);
              setErrors((prev) => ({ ...prev, descripcion: false }));
            }}
            multiline
            rows={4}
            fullWidth
            error={errors.descripcion}
            helperText={errors.descripcion && "La descripción es obligatoria"}
            InputLabelProps={{
              sx: { color: 'black', '&.Mui-focused': { color: 'black' } }, // Cambiar color del placeholder activo
            }}
            InputProps={{
              sx: { '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'black' } }
            }}
          />
          <TextField
            label="Instagram (nombre de usuario)"
            value={instagram}
            onChange={(e) => {
              setInstagram(e.target.value);
            }}
            fullWidth
            InputLabelProps={{
              sx: { color: 'black', '&.Mui-focused': { color: 'black' } }, // Cambiar color del placeholder activo
            }}
            InputProps={{
              sx: { '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'black' } }
            }}
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
            <Box mt={2} display="flex" justifyContent="center">
              <img
                src={imageUrl}
                alt="Uploaded"
                style={{
                  width: '150px', // Miniatura más pequeña
                  height: 'auto',
                  objectFit: 'contain',
                  border: '1px solid black',
                  borderRadius: '4px',
                }}
              />
            </Box>
          )}
        </Box>
      )}

      {activeStep === 1 && (
        <Box sx={{ mt: 5 }}>
          <Typography variant="h6" gutterBottom>Añadir Obras a la Compañía</Typography>
          {selectedObras.map((obra, index) => (
            <Autocomplete
              key={index}
              options={obras}
              getOptionLabel={(option) => option.titulo || ''}
              renderOption={(props, option) => (
                <li {...props}>
                  <Box
                    component="img"
                    src={option.cartel}
                    alt={option.titulo}
                    sx={{ width: 40, height: 60, mr: 2, objectFit: 'cover' }}
                  />
                  {option.titulo}
                </li>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Buscar obra"
                  fullWidth
                  onBlur={handleObraInputBlur}
                  onChange={(e) => setObraInput(e.target.value)}
                  helperText={obraNotFound || 'Selecciona una obra o pega la URL'}
                  error={!!obraNotFound}
                  InputProps={{
                    ...params.InputProps,
                    sx: { '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'black' } }
                  }}
                />
              )}
              onChange={(event, newValue) => {
                if (newValue) {
                  handleAddObraToCompany(newValue.id);
                }
              }}
            />
          ))}
          <Button
            variant="outlined"
            onClick={() => setSelectedObras([...selectedObras, {}])}
            sx={{ mt: 2, color: 'black', borderColor: 'black' }}
          >
            +
          </Button>
        </Box>
      )}

      {activeStep === 2 && (
        <Box textAlign="center">
          <Typography variant="h5" gutterBottom>¡Compañía {id ? 'actualizada' : 'registrada'} con éxito!</Typography>
          <Button variant="contained" onClick={handleResetForm} sx={{ backgroundColor: 'black', color: 'white' }}>Registrar otra</Button>
        </Box>
      )}

      <Box display="flex" justifyContent="space-between" mt={4}>
        {activeStep > 0 && (
          <Button
            onClick={() => setActiveStep((prev) => prev - 1)}
            variant="outlined"
            sx={{ color: 'black', borderColor: 'black' }} // Letras y borde negros
          >
            Atrás
          </Button>
        )}
        {activeStep < 2 && (
          <Button
            onClick={handleNextStep}
            variant="contained"
            sx={{ backgroundColor: 'black', color: 'white' }} // Fondo negro y letras blancas
          >
            {activeStep === 1 ? 'Finalizar' : 'Siguiente'}
          </Button>
        )}
      </Box>
    </Container>
  );
}

export default NewCompanyProfile;
