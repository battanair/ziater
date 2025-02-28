import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { Typography, List, ListItem, ListItemText, Divider, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';

const Edit = () => {
  const [user, setUser] = useState(null);
  const [obras, setObras] = useState([]);
  const [personas, setPersonas] = useState([]);
  const [teatros, setTeatros] = useState([]);
  const [companias, setCompanias] = useState([]);
  const [premios, setPremios] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = () => {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          setUser(user);
          fetchData(user.uid);
        } else {
          setUser(null);
        }
      });
    };

    const fetchData = async (userId) => {
      const collections = ['obra', 'persona', 'teatro', 'productoras', 'premios'];
      const setters = [setObras, setPersonas, setTeatros, setCompanias, setPremios];

      for (let i = 0; i < collections.length; i++) {
        const q = query(collection(db, collections[i]), where('creacion', '==', userId));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setters[i](data);
      }
    };

    fetchUser();
  }, []);

  const handleEditClick = (id, type) => {
    if (type === 'compania') {
      navigate(`/edit-company/${id}`);
    } else if (type === 'premio') {
      navigate(`/edit-award/${id}`);
    }else if (type === 'obra') {
      navigate(`/edit-play/${id}`);
    }else if (type === 'teatro') {
      navigate(`/edit-sala/${id}`);
    }else if (type === 'persona') {
      navigate(`/edit-persona/${id}`);
    }
    // Agrega más condiciones según sea necesario para otros tipos
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>Mis aportaciones</Typography>

      <Typography variant="h5" gutterBottom>Obras</Typography>
      <List>
        {obras.map((obra) => (
          <React.Fragment key={obra.id}>
            <ListItem>
              <ListItemText primary={obra.titulo} />
              <IconButton onClick={() => handleEditClick(obra.id, 'obra')} sx={{ color: 'black' }}>
                <EditIcon />
              </IconButton>
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
      <Divider />

      <Typography variant="h5" gutterBottom>Artistas</Typography>
      <List>
        {personas.map((persona) => (
          <React.Fragment key={persona.id}>
            <ListItem>
              <ListItemText primary={`${persona.Nombre} ${persona.Apellidos}`} />
              <IconButton onClick={() => handleEditClick(persona.id, 'persona')} sx={{ color: 'black' }}>
                <EditIcon />
              </IconButton>
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
      <Divider />

      <Typography variant="h5" gutterBottom>Espacios</Typography>
      <List>
        {teatros.map((teatro) => (
          <React.Fragment key={teatro.id}>
            <ListItem>
              <ListItemText primary={teatro.nombre_teatro} />
              <IconButton onClick={() => handleEditClick(teatro.id, 'teatro')} sx={{ color: 'black' }}>
                <EditIcon />
              </IconButton>
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
      <Divider />

      <Typography variant="h5" gutterBottom>Compañías</Typography>
      <List>
        {companias.map((compania) => (
          <React.Fragment key={compania.id}>
            <ListItem>
              <ListItemText primary={compania.nombre_prod} />
              <IconButton onClick={() => handleEditClick(compania.id, 'compania')} sx={{ color: 'black' }}>
                <EditIcon />
              </IconButton>
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
      <Divider />

      <Typography variant="h5" gutterBottom>Premios</Typography>
      <List>
        {premios.map((premio) => (
          <React.Fragment key={premio.id}>
            <ListItem>
              <ListItemText primary={premio.nombre_premio} />
              <IconButton onClick={() => handleEditClick(premio.id, 'premio')} sx={{ color: 'black' }}>
                <EditIcon />
              </IconButton>
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
    </div>
  );
};

export default Edit;