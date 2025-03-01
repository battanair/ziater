import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getFirestore, doc, getDoc, collection, query, where, getDocs, deleteDoc } from "firebase/firestore";
import { db } from '../firebaseConfig';
import { Container, CircularProgress, Typography, IconButton, List, ListItem, ListItemText, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

function EditPlayWork() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [personas, setPersonas] = useState([]);
  const [tituloObra, setTituloObra] = useState("");

  useEffect(() => {
    if (id) {
      fetchPersonasDeObra(id);
      fetchTituloObra(id);
    }
  }, [id]);

  const fetchPersonasDeObra = async (obraId) => {
    try {
      const q = query(collection(db, "persona_obra"), where("id_obra", "==", obraId));
      const querySnapshot = await getDocs(q);
      const personasMap = {};
      
      for (const docSnapshot of querySnapshot.docs) {
        const data = docSnapshot.data();
        console.log("persona_obra data:", data); // Log para verificar los datos de persona_obra
        const personaDoc = await getDoc(doc(db, "persona", data.id_persona));
        if (personaDoc.exists()) {
          const personaData = personaDoc.data();
          console.log("persona data:", personaData); // Log para verificar los datos de persona
          const persona = { id: personaDoc.id, nombre: personaData.Nombre, apellidos: personaData.Apellidos, puesto: data.puesto, titulo: data.titulo, personaObraId: docSnapshot.id };
          
          if (!personasMap[data.puesto]) {
            personasMap[data.puesto] = [];
          }
          personasMap[data.puesto].push(persona);
        }
      }
      setPersonas(personasMap);
    } catch (error) {
      console.error("Error al obtener las personas de la obra:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTituloObra = async (obraId) => {
    try {
      const obraDoc = await getDoc(doc(db, "obra", obraId));
      if (obraDoc.exists()) {
        setTituloObra(obraDoc.data().titulo);
      }
    } catch (error) {
      console.error("Error al obtener el título de la obra:", error);
    }
  };

  const handleDelete = async (personaObraId) => {
    try {
      await deleteDoc(doc(db, "persona_obra", personaObraId));
      fetchPersonasDeObra(id); // Refrescar la lista de personas después de eliminar
    } catch (error) {
      console.error("Error al eliminar la persona de la obra:", error);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <IconButton onClick={() => navigate(-1)} sx={{ color: 'black' }}>
        <ArrowBackIcon />
      </IconButton>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <Typography variant="h5" sx={{ mt: 2, mb: 3 }}>Personas en "{tituloObra}"</Typography>
        <Button 
          variant="contained" 
          sx={{ backgroundColor: 'black', color: 'white' }} 
          onClick={() => navigate(`/editplaywork2/?id_obra=${id}`)}
        >
          Añadir trabajo
        </Button>
      </div>
      {Object.keys(personas).length > 0 ? (
        Object.entries(personas).map(([puesto, personasLista]) => (
          <div key={puesto} style={{ marginBottom: '20px' }}>
            <Typography variant="h6" sx={{ mt: 2, backgroundColor: 'black', color: 'white', padding: '10px', borderRadius: '5px' }}>
              {puesto}
            </Typography>
            <List>
              {personasLista.map((persona) => (
                <ListItem key={persona.id} secondaryAction={
                  <>
                    <IconButton edge="end" aria-label="edit" sx={{ marginRight: 1 }} onClick={() => navigate(`/editplaywork2/${persona.personaObraId}`)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(persona.personaObraId)}>
                      <DeleteIcon />
                    </IconButton>
                  </>
                }>
                  <ListItemText 
                    primary={`${persona.nombre} ${persona.apellidos}`} 
                    secondary={<span style={{ color: 'gray' }}>({persona.titulo})</span>} 
                  />
                </ListItem>
              ))}
            </List>
          </div>
        ))
      ) : (
        <Typography variant="body1">No hay personas registradas en esta obra.</Typography>
      )}
    </Container>
  );
}

export default EditPlayWork;
