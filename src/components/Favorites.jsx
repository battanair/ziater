import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { List, ListItem, ListItemAvatar, ListItemText, Avatar, Grid } from '@mui/material';
import { NavLink } from 'react-router-dom';

const Favorites = () => {
  const [favorites, setFavorites] = useState({
    favoritos_compania: [],
    favoritos_obra: [],
    favoritos_persona: [],
    favoritos_sala: []
  });

  useEffect(() => {
    const fetchFavorites = async (userId) => {
      if (!userId) {
        console.error('User ID is not available');
        return;
      }

      try {
        const userRef = doc(db, 'users', userId);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          console.log('User data:', data);

          const favoritos_compania = data.favoritos_compania ? await fetchDetails(data.favoritos_compania.filter(id => id), 'productoras', 'nombre_prod', 'foto_prod') : [];
          const favoritos_obra = data.favoritos_obra ? await fetchDetails(data.favoritos_obra.filter(id => id), 'obra', 'titulo', 'cartel') : [];
          const favoritos_persona = data.favoritos_persona ? await fetchDetails(data.favoritos_persona.filter(id => id), 'persona', 'Nombre', 'foto', 'Apellidos') : [];
          const favoritos_sala = data.favoritos_sala ? await fetchDetails(data.favoritos_sala.filter(id => id), 'teatro', 'nombre_teatro', 'foto') : [];

          setFavorites({
            favoritos_compania,
            favoritos_obra,
            favoritos_persona,
            favoritos_sala
          });
          console.log('Favorites:', {
            favoritos_compania,
            favoritos_obra,
            favoritos_persona,
            favoritos_sala
          });
        } else {
          console.error('No user document found');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    const fetchDetails = async (ids, collectionName, nameField, photoField, lastNameField = '') => {
      const details = [];
      for (const id of ids) {
        const docRef = doc(db, collectionName, id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          details.push({
            id: docSnap.id,
            name: lastNameField ? `${data[nameField]} ${data[lastNameField]}` : data[nameField],
            photo: data[photoField]
          });
        } else {
          console.error(`No document found for ID: ${id} in collection: ${collectionName}`);
        }
      }
      return details;
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchFavorites(user.uid);
      } else {
        console.log('No user is signed in');
      }
    });

    return () => unsubscribe();
  }, []);

  const categoryNames = {
    favoritos_obra: 'OBRAS',
    favoritos_persona: 'ARTISTAS',
    favoritos_compania: 'COMPAÑÍAS',
    favoritos_sala: 'ESPACIOS'
  };

  const orderedCategories = ['favoritos_obra', 'favoritos_persona', 'favoritos_compania', 'favoritos_sala'];

  return (
    <div style={{ width: '100%' }}>
      <h2 style={{ paddingBottom: '3rem' }}>TUS FAVORITOS</h2>
      {orderedCategories.map((key) => (
        favorites[key].length > 0 && (
          <div key={key} style={{ width: '100%' }}>
            <h3>{categoryNames[key]}</h3>
            <List>
              {favorites[key].map((favorite, index) => (
                <ListItem key={index} component={NavLink} to={`/${key === 'favoritos_sala' ? 'teatro' : key.replace('favoritos_', '')}/${favorite.id}`} button>
                  <ListItemAvatar>
                    <Avatar 
                      src={favorite.photo} 
                      variant="square" 
                      style={{ width: '60px', height: '90px', objectFit: 'contain', marginRight: '1rem' }} 
                    />
                  </ListItemAvatar>
                  <ListItemText primary={favorite.name} primaryTypographyProps={{ style: { color: 'black' } }} />
                </ListItem>
              ))}
            </List>
          </div>
        )
      ))}
    </div>
  );
};

export default Favorites;