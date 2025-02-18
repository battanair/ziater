import React, { useState, useEffect } from 'react';
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from '../firebaseConfig';
import { Container, TextField, Button, Typography, Box, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, CircularProgress } from '@mui/material';

const provider = new GoogleAuthProvider();

function UserProfile() {
  const [nombre, setNombre] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [user, setUser] = useState(null);
  const [profileCompleted, setProfileCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [artesEscenicas, setArtesEscenicas] = useState('');

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
    const userDocRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(userDocRef);

    if (docSnap.exists()) {
      const userData = docSnap.data();
      setNombre(userData.nombre);
      setApellidos(userData.apellidos);
      setArtesEscenicas(userData.artesEscenicas || '');
      setProfileCompleted(true);
      return;
    }

    if (user.displayName) {
      const [firstName, ...lastName] = user.displayName.split(" ");
      setNombre(firstName);
      setApellidos(lastName.join(" "));
    }
  };

  const handleNombreChange = (event) => {
    setNombre(event.target.value);
  };

  const handleApellidosChange = (event) => {
    setApellidos(event.target.value);
  };

  const handleArtesEscenicasChange = (event) => {
    setArtesEscenicas(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (user) {
      try {
        await setDoc(doc(db, "users", user.uid), {
          nombre: nombre,
          apellidos: apellidos,
          artesEscenicas: artesEscenicas,
        });
        setProfileCompleted(true);
      } catch (error) {
        console.error("Error al guardar el perfil:", error);
      }
    }
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
        <Button variant="outlined" onClick={() => setProfileCompleted(false)} sx={{ mt: 2, borderColor: 'black', color: 'black' }}>Editar Perfil</Button>
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
            <FormControlLabel value="si" control={<Radio />} label="Sí" />
            <FormControlLabel value="no" control={<Radio />} label="No" />
          </RadioGroup>
        </FormControl>
        <Button type="submit" variant="contained" sx={{ bgcolor: 'black', color: 'white' }}>Guardar Perfil</Button>
      </Box>
    </Container>
  );
}

export default UserProfile;
