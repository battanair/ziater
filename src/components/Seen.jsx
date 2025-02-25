import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebaseConfig'; // Asegúrate de que la ruta sea correcta
import Personaindex from '../components/personaindex';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { Grid } from '@mui/material'; // Importa Grid de Material-UI

const Seen = () => {
  const [favorites, setFavorites] = useState([]);

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
          console.log('User data:', data); // Log user data
          const favoritos_obra = await fetchDetails(data.favoritos_obra.filter(id => id), 'obra', 'titulo', 'cartel');
          setFavorites(favoritos_obra);
          console.log('Favorites:', favoritos_obra); // Log favorites
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    const fetchDetails = async (ids, collectionName, nameField, photoField) => {
      const details = [];
      for (const id of ids) {
        const docRef = doc(db, collectionName, id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          details.push({
            id: docSnap.id,
            name: data[nameField],
            photo: data[photoField]
          });
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

  return (
    <div style={{ width: '100%' }}>
      <h2 style={{ paddingBottom: '3rem' }}>OBRAS VISTAS</h2>
      {favorites.length > 0 && (
        <div style={{ width: '100%' }}>
          <Grid container spacing={2} style={{ width: '100%' }}>
            {favorites.map((favorite, index) => (
              <Grid item xs={12} sm={4} md={4} key={index}>
                <div
                  onClick={() => window.location.href = `/obra/${favorite.id}`}
                  style={{ cursor: 'pointer' }}
                >
                  <Personaindex
                    fotito={favorite.photo}
                    nombrepersona={favorite.name}
                    puestopersona={`${favorite.anoinicio || ''}`} // Assuming 'anoinicio' is a field in your data
                    link={`/obra/${favorite.id}`}
                  />
                </div>
              </Grid>
            ))}
          </Grid>
        </div>
      )}
    </div>
  );
};

export default Seen;