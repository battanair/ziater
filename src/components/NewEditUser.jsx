import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, setDoc, addDoc, getDoc, query, collection, where, getDocs } from "firebase/firestore";
import { auth, db } from '../firebaseConfig';
import { Container, TextField, Button, Box, CircularProgress, Typography, Snackbar, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; // Importa el ícono de flecha

function NewEditUser() {
  const { id } = useParams(); // Obtener la ID de la URL
  const navigate = useNavigate(); // Hook para redirigir
  const [Nombre, setNombre] = useState('');
  const [Apellidos, setApellidos] = useState('');
  const [biografia, setBiografia] = useState('');
  const [instagram, setInstagram] = useState('');
  const [coincide, setCoincide] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [personaId, setPersonaId] = useState(null);
  const [errors, setErrors] = useState({});
  const [imageUrl, setImageUrl] = useState('');
  const [imageError, setImageError] = useState('');
  const [imageLoading, setImageLoading] = useState(false); // Nuevo estado para el loader de la imagen
  const [openSnackbar, setOpenSnackbar] = useState(false); // Estado para el Snackbar

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user && id) {
        await fetchPersonaData(id, user);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, [id]);

  const fetchPersonaData = async (personaId, user) => {
    const personaDoc = await getDoc(doc(db, "persona", personaId));
    if (personaDoc.exists()) {
      const personaData = personaDoc.data();
      setNombre(personaData.Nombre);
      setApellidos(personaData.Apellidos);
      setBiografia(personaData.biografia);
      setInstagram(personaData.instagram);
      setImageUrl(personaData.foto);
      setCoincide(personaData.coincide === user.uid);
    }
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
        if (id) {
          personaRef = doc(db, "persona", id);
          await setDoc(personaRef, {
            Nombre,
            Apellidos,
            biografia,
            instagram,
            creacion: user.uid,
            coincide: coincide ? user.uid : "",
            foto: imageUrl || "https://picsum.photos/200/300"
          });
        } else {
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
              foto: imageUrl || "https://picsum.photos/200/300"
            });
          } else {
            const newPersonaRef = await addDoc(collection(db, "persona"), {
              Nombre,
              Apellidos,
              biografia,
              instagram,
              creacion: user.uid,
              coincide: "",
              foto: imageUrl || "https://picsum.photos/200/300"
            });
            personaRef = newPersonaRef;
          }
        }
        setPersonaId(personaRef.id);
        setOpenSnackbar(true); // Mostrar Snackbar
      } catch (error) {
        console.error("Error al guardar la información de la persona:", error);
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

  const handleDeleteImage = () => {
    setImageUrl('');
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
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
      <IconButton onClick={() => navigate(-1)} sx={{ color: 'black' }}>
        <ArrowBackIcon />
      </IconButton>
      <h4>EDITAR PERSONA</h4>

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
          label="Instagram"
          value={instagram}
          onChange={(e) => setInstagram(e.target.value)}
          fullWidth
        />
         <Typography variant="body1" sx={{ mt: 2 }}>FOTO:</Typography>
        
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
          <Box mt={2} position="relative">
            <img src={imageUrl} alt="Uploaded" style={{ width: '100%', maxHeight: '300px', objectFit: 'cover' }} />
            <Button
              variant="contained"
              color="primary"
              onClick={handleDeleteImage}
              sx={{ position: 'absolute', top: 8, right: 8, backgroundColor: 'black', '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.8)' } }}
            >
              Eliminar
            </Button>
          </Box>
        )}
        <Button 
          variant="outlined" 
          onClick={() => setCoincide(!coincide)}
          sx={{ color: 'black', borderColor: 'black', '&:hover': { borderColor: 'black', backgroundColor: 'rgba(0, 0, 0, 0.04)' } }}
        >
          {coincide ? "¿No eres tú esta persona?" : "¿Eres tú esta persona?"}
        </Button>

        
        <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} justifyContent="center" gap={2} mt={2}>
          <Button 
            onClick={() => navigate(`/newedituser2/${id}`)} 
            variant="contained" 
            sx={{ backgroundColor: 'black', '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.8)' } }}
          >
            Editar trabajos
          </Button>

          <Button 
            onClick={() => navigate(`/editarpremios/${id}`)} 
            variant="contained" 
            sx={{ backgroundColor: 'black', '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.8)' } }}
          >
            Editar Premios
          </Button>
          
        </Box>
        <Button 
          onClick={() => handleSavePersona(imageUrl)} 
          variant="contained" 
          sx={{ mt: 2, backgroundColor: 'black', '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.8)' } }}
        >
          Guardar
        </Button>
      </Box>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message="Los datos se han guardado"
        action={
          <React.Fragment>
            <IconButton size="small" aria-label="close" color="inherit" onClick={handleCloseSnackbar}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </React.Fragment>
        }
      />
    </Container>
  );
}

export default NewEditUser;