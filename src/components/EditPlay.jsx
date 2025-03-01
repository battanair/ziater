import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, setDoc, addDoc, getDoc, collection } from "firebase/firestore";
import { auth, db } from '../firebaseConfig';
import { Container, TextField, Button, Box, CircularProgress, Typography, Snackbar, IconButton, Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function EditPlay() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [titulo, setTitulo] = useState('');
  const [sinopsis, setSinopsis] = useState('');
  const [instagram, setInstagram] = useState('');
  const [anoinicio, setAnoinicio] = useState('');
  const [anofin, setAnofin] = useState('');
  const [cartel, setCartel] = useState('');
  const [fotosObra, setFotosObra] = useState([]);
  const [categoria, setCategoria] = useState([]);
  const [trailer, setTrailer] = useState('');
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user && id) {
        await fetchObraData(id);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, [id]);

  const fetchObraData = async (obraId) => {
    const obraDoc = await getDoc(doc(db, "obra", obraId));
    if (obraDoc.exists()) {
      const obraData = obraDoc.data();
      setTitulo(obraData.titulo);
      setSinopsis(obraData.sinopsis);
      setInstagram(obraData.instagram);
      setAnoinicio(obraData.anoinicio);
      setAnofin(obraData.anofin);
      setCartel(obraData.cartel);
      setFotosObra(obraData.fotosObra || []);
      setCategoria(obraData.categoria || []);
      setTrailer(obraData.trailer);
    }
  };

  const handleSaveObra = async () => {
    if (!titulo || !sinopsis || !anoinicio) {
      setErrors({
        titulo: !titulo,
        sinopsis: !sinopsis,
        anoinicio: !anoinicio,
      });
      return;
    }

    try {
      const obraRef = id ? doc(db, "obra", id) : addDoc(collection(db, "obra"), {});
      await setDoc(obraRef, {
        titulo,
        sinopsis,
        instagram,
        anoinicio,
        anofin,
        cartel,
        fotosObra,
        categoria,
        trailer
      }, { merge: true });
      setOpenSnackbar(true);
    } catch (error) {
      console.error("Error al guardar la obra:", error);
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
      <IconButton onClick={() => navigate(-1)} sx={{ color: 'black' }}>
        <ArrowBackIcon />
      </IconButton>
      <h4>EDITAR OBRA</h4>
      <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 5 }}>
        <TextField label="Título" value={titulo} onChange={(e) => setTitulo(e.target.value)} fullWidth error={errors.titulo} helperText={errors.titulo && "Campo requerido"} />
        <TextField label="Sinopsis" value={sinopsis} onChange={(e) => setSinopsis(e.target.value)} multiline rows={4} fullWidth error={errors.sinopsis} helperText={errors.sinopsis && "Campo requerido"} />
        <TextField label="Instagram" value={instagram} onChange={(e) => setInstagram(e.target.value)} fullWidth />
        <TextField label="Año de Inicio" type="number" value={anoinicio} onChange={(e) => setAnoinicio(e.target.value)} fullWidth error={errors.anoinicio} helperText={errors.anoinicio && "Campo requerido"} />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TextField label="Año de Fin" type="number" value={anofin} onChange={(e) => setAnofin(e.target.value)} fullWidth />
          <Button onClick={() => setAnofin(0)} variant="contained" size="small" sx={{ bgcolor: 'black', color: 'white', height: '56px' }}>Actualmente</Button>
        </Box>
        <FormControl component="fieldset">
          <FormLabel component="legend">Categoría</FormLabel>
          <FormGroup sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
            {['Comedia', 'Teatro', 'Impro', 'Circo', 'Musicales', 'Stand up', 'Danza', 
                'Drag', 'Ópera', 'Zarzuela', 'Performance', 'Ficción sonora', 'Magia', 
                 'Microteatro', 'Monólogo', 'Mimo', 'Poesía', 'Títeres', 'Variedades', 'Otros'].map((cat) => (
              <FormControlLabel key={cat} control={<Checkbox checked={categoria.includes(cat)} onChange={(e) => setCategoria(e.target.checked ? [...categoria, cat] : categoria.filter(c => c !== cat))} />} label={cat} />
            ))}
          </FormGroup>
        </FormControl>
        <TextField label="Trailer" value={trailer} onChange={(e) => setTrailer(e.target.value)} fullWidth />
        <Button onClick={handleSaveObra} variant="contained" sx={{ mt: 2, bgcolor: 'black', color: 'white' }}>Guardar</Button>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Button 
            variant="contained" 
            sx={{ bgcolor: 'black', color: 'white', width: '48%' }}
            onClick={() => navigate(`/editplaywork/${id}`)}
          >
            Editar Equipo
          </Button>
          <Button 
            variant="contained" 
            sx={{ bgcolor: 'black', color: 'white', width: '48%' }}
            onClick={() => navigate(`/editplayawards/${id}`)}
          >
            Editar Premios
          </Button>
        </Box>
      </Box>
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)} message="Los datos se han guardado" action={<IconButton size="small" color="inherit" onClick={() => setOpenSnackbar(false)}><CloseIcon fontSize="small" /></IconButton>} />
    </Container>
  );
}

export default EditPlay;
