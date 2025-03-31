import React, { useState, useEffect } from 'react';
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, setDoc, updateDoc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { auth, db } from '../firebaseConfig';
import { Container, TextField, Button, Typography, Box, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, CircularProgress } from '@mui/material';
import { NavLink } from 'react-router-dom';

const provider = new GoogleAuthProvider();

function UserProfile() {
  const [nombre, setNombre] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [biografia, setBiografia] = useState('');
  const [instagram, setInstagram] = useState('');
  const [artesEscenicas, setArtesEscenicas] = useState('');
  const [user, setUser] = useState(null);
  const [profileCompleted, setProfileCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState('');
  const [imageLoading, setImageLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [personaId, setPersonaId] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        getProfileInfo(user);
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const handleImageUpload = async (event) => {
    if (artesEscenicas !== 'si') {
      return;
    }

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
        setImageUrl(data.secure_url); // Solo actualiza el estado de la imagen
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

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      setUser(user);
      getProfileInfo(user);
    } catch (error) {
      console.error("Error al iniciar sesión con Google:", error);
    }
  };

  const getProfileInfo = async (user) => {
    const userRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userRef);
  
    if (userDoc.exists()) {
      const userData = userDoc.data();
      setNombre(userData.Nombre);
      setApellidos(userData.Apellidos);
    } else {
      if (user.displayName) {
        const [firstName, ...lastName] = user.displayName.split(" ");
        setNombre(firstName);
        setApellidos(lastName.join(" "));
      }
    }
  
    const q = query(collection(db, "persona"), where("coincide", "==", user.uid));
    const querySnapshot = await getDocs(q);
  
    if (!querySnapshot.empty) {
      const personaDoc = querySnapshot.docs[0];
      const personaData = personaDoc.data();
      setBiografia(personaData.biografia || '');
      setInstagram(personaData.instagram || '');
      setArtesEscenicas(personaData.artesEscenicas || '');
      setImageUrl(personaData.foto || '');
      setPersonaId(personaDoc.id);
      setProfileCompleted(true);
    }
  };

  const cleanInstagramUsername = (username) => {
    if (username.startsWith('@')) {
      return username.slice(1);
    }
    if (username.startsWith('https://www.instagram.com/')) {
      return username.slice(26).replace('/', '');
    }
    return username;
  };

  const handleSavePersona = async (imageUrl) => {
    if (user) {
      try {
        const userData = {
          Nombre: nombre,
          Apellidos: apellidos,
        };

        const userRef = doc(db, "users", user.uid);
        await setDoc(userRef, userData, { merge: true });

        if (artesEscenicas === 'si') {
          const q = query(collection(db, "persona"), where("coincide", "==", user.uid));
          const querySnapshot = await getDocs(q);

          const personaData = {
            Nombre: nombre,
            Apellidos: apellidos,
            coincide: user.uid,
            foto: imageUrl || "https://res.cloudinary.com/dk0vvcpyn/image/upload/v1740952724/imagenesdefecto/znmg1esf30tgxcwbgpnl.jpg",
            biografia: biografia,
            instagram: cleanInstagramUsername(instagram),
            artesEscenicas: artesEscenicas
          };

          if (!querySnapshot.empty) {
            const personaRef = doc(db, "persona", querySnapshot.docs[0].id);
            await updateDoc(personaRef, personaData);
          } else {
            await setDoc(doc(db, "persona", user.uid), personaData);
          }
        }

        setProfileCompleted(true);
      } catch (error) {
        console.error("Error al guardar el perfil:", error);
      }
    }
  };

  const handleNombreChange = (event) => setNombre(event.target.value);
  const handleApellidosChange = (event) => setApellidos(event.target.value);
  const handleBiografiaChange = (event) => setBiografia(event.target.value);
  const handleInstagramChange = (event) => setInstagram(event.target.value);
  const handleArtesEscenicasChange = (event) => setArtesEscenicas(event.target.value);

  const handleSubmit = async (event) => {
    event.preventDefault();
    await handleSavePersona(imageUrl);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress sx={{ color: 'black' }} />
      </Box>
    );
  }

  if (!user) {
    return (
      <Container maxWidth="sm" sx={{ textAlign: 'center', mt: 5 }}>
        <Button variant="contained" onClick={signInWithGoogle} sx={{ bgcolor: 'black', color: 'white' }}>
          Iniciar sesión con Google
        </Button>
      </Container>
    );
  }

  if (profileCompleted) {
    return (
      <Container maxWidth="sm" sx={{ textAlign: 'center', mt: 5 }}>
        <Typography variant="h5">Hola {nombre} {apellidos}</Typography>
        {imageUrl && (
          <Box mt={2}>
            <img src={imageUrl} alt="Profile" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '50%' }} />
          </Box>
        )}
        <Box display="flex" justifyContent="center" gap={2} mt={2}>
          <Button variant="outlined" onClick={() => setProfileCompleted(false)} sx={{ borderColor: 'black', color: 'black' }}>Editar Perfil</Button>
        </Box>
        <Box display="flex" justifyContent="center" gap={2} mt={2}>
          <Button component={NavLink} to="/edit-play" variant="contained" sx={{ bgcolor: 'black', color: 'white' }}>Añade una obra</Button>
          <Button component={NavLink} to={`/newedituser2/${personaId}`} variant="contained" sx={{ bgcolor: 'black', color: 'white' }}>Edita tus trabajos</Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 5 }}>
        <Typography variant="h5" align="center">Completa tu perfil</Typography>
        <TextField label="Nombre" variant="outlined" value={nombre} onChange={handleNombreChange} fullWidth sx={{ input: { color: 'black' }, label: { color: 'black' }, '& .MuiOutlinedInput-root': { '&:hover fieldset': { borderColor: 'black' } } }} />
        <TextField label="Apellidos" variant="outlined" value={apellidos} onChange={handleApellidosChange} fullWidth sx={{ input: { color: 'black' }, label: { color: 'black' }, '& .MuiOutlinedInput-root': { '&:hover fieldset': { borderColor: 'black' } } }} />
        <FormControl component="fieldset" sx={{ display: 'flex', alignItems: 'center' }}>
          <FormLabel component="legend" sx={{ color: 'black' }}>¿Te dedicas a las Artes Escénicas?</FormLabel>
          <RadioGroup row value={artesEscenicas} onChange={handleArtesEscenicasChange} sx={{ justifyContent: 'center' }}>
            <FormControlLabel value="si" control={<Radio sx={{ color: 'black', '&.Mui-checked': { color: 'black' } }} />} label="Sí" />
            <FormControlLabel value="no" control={<Radio sx={{ color: 'black', '&.Mui-checked': { color: 'black' } }} />} label="No" />
          </RadioGroup>
        </FormControl>

        {artesEscenicas === 'si' && (
          <>
            <TextField label="Biografía" variant="outlined" value={biografia} onChange={handleBiografiaChange} fullWidth multiline rows={4} sx={{ input: { color: 'black' }, label: { color: 'black' }, '& .MuiOutlinedInput-root': { '&:hover fieldset': { borderColor: 'black' } } }} />
            <TextField label="Instagram (nombre de usuario)" variant="outlined" value={instagram} onChange={handleInstagramChange} fullWidth sx={{ input: { color: 'black' }, label: { color: 'black' }, '& .MuiOutlinedInput-root': { '&:hover fieldset': { borderColor: 'black' } } }} />
            <Box display="flex" alignItems="center" gap={2}>
            <Typography variant="body1">FOTO DE PERFIL:</Typography>

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
            {imageUrl ? (
              <Box mt={2}>
                <img src={imageUrl} alt="Uploaded" style={{ width: '150px', height: '150px', objectFit: 'contain' }} />
              </Box>
            ) : (
              <Box mt={2}>
                <img src="https://res.cloudinary.com/dk0vvcpyn/image/upload/v1740952724/imagenesdefecto/znmg1esf30tgxcwbgpnl.jpg" alt="Default" style={{ width: '150px', height: '150px', objectFit: 'contain' }} />
              </Box>
            )}
          </>
        )}
        <Button type="submit" variant="contained" sx={{ bgcolor: 'black', color: 'white' }}>Guardar Perfil</Button>
      </Box>
    </Container>
  );
}

export default UserProfile;

