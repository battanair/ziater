import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, setDoc, addDoc, getDoc, collection } from "firebase/firestore";
import { auth, db } from '../firebaseConfig';
import { Container, TextField, Button, Box, CircularProgress, Typography, Snackbar, IconButton, Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';

function EditPlay() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [titulo, setTitulo] = useState('');
  const [sinopsis, setSinopsis] = useState('');
  const [instagram, setInstagram] = useState('');
  const [anoinicio, setAnoinicio] = useState('');
  const [anofin, setAnofin] = useState('');
  const [cartel, setCartel] = useState('');
  const [fotosObra, setFotosObra] = useState(['', '', '', '']);
  const [categoria, setCategoria] = useState([]);
  const [trailer, setTrailer] = useState('');
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [imageError, setImageError] = useState('');
  const [imageLoading, setImageLoading] = useState(false);

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
      setFotosObra(obraData.fotosObra || ['', '', '', '']);
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
        fotosObra: fotosObra.filter(foto => foto !== ''),
        categoria,
        trailer
      }, { merge: true });
      setOpenSnackbar(true);
    } catch (error) {
      console.error("Error al guardar la obra:", error);
    }
  };

  const handleImageUpload = async (event, index) => {
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

  const handleCartelUpload = async (event) => {
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
        setCartel(data.secure_url);
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

  const handleImageDelete = (index) => {
    const newFotosObra = [...fotosObra];
    newFotosObra[index] = '';
    setFotosObra(newFotosObra);
  };

  const handleCartelDelete = () => {
    setCartel('');
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
      <h4>{id ? "EDITAR OBRA" : "AÑADIR OBRA"}</h4>
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
        <Box display="flex" flexDirection="column" gap={1}>
          <Typography variant="body1">CARTEL:</Typography>
          <input
            type="file"
            accept="image/*"
            onChange={handleCartelUpload}
            style={{ marginTop: '16px' }}
          />
          {imageLoading && <CircularProgress size={24} />}
          {cartel && (
            <Box mt={2} position="relative">
              <img src={cartel} alt="Cartel" style={{ width: '100%', maxHeight: '150px', objectFit: 'cover' }} />
              <IconButton
                onClick={handleCartelDelete}
                sx={{ position: 'absolute', top: 8, right: 8, color: 'white', bgcolor: 'rgba(0, 0, 0, 0.5)' }}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          )}
        </Box>
        <Box display="flex" flexDirection="column" gap={1}>
          <Typography variant="body1">FOTOS:</Typography>
          {fotosObra.map((foto, index) => (
            <Box key={index} display="flex" flexDirection="column" gap={1}>
              <input
                type="file"
                accept="image/*"
                onChange={(event) => handleImageUpload(event, index)}
                style={{ marginTop: '16px' }}
                disabled={fotosObra[index] !== ''}
              />
              {imageLoading && <CircularProgress size={24} />}
              {foto && (
                <Box mt={2} position="relative">
                  <img src={foto} alt={`Uploaded ${index}`} style={{ width: '100%', maxHeight: '150px', objectFit: 'cover' }} />
                  <IconButton
                    onClick={() => handleImageDelete(index)}
                    sx={{ position: 'absolute', top: 8, right: 8, color: 'white', bgcolor: 'rgba(0, 0, 0, 0.5)' }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              )}
            </Box>
          ))}
        </Box>
        {imageError && (
          <Typography color="error" variant="body2">{imageError}</Typography>
        )}
        <Button onClick={handleSaveObra} variant="contained" sx={{ mt: 2, bgcolor: 'black', color: 'white' }}>
          {id ? "Guardar Cambios" : "Añadir Obra"}
        </Button>
        {id && (
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
        )}
      </Box>
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)} message="Los datos se han guardado" action={<IconButton size="small" color="inherit" onClick={() => setOpenSnackbar(false)}><CloseIcon fontSize="small" /></IconButton>} />
    </Container>
  );
}

export default EditPlay;
