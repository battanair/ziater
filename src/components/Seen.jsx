import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { List, ListItem, ListItemAvatar, ListItemText, Avatar } from '@mui/material';
import { NavLink } from 'react-router-dom';

const Seen = () => {
  const [seen, setSeen] = useState([]);

  useEffect(() => {
    const fetchSeen = async (userId) => {
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
          const vistas_obra = await fetchDetails(data.vistas.filter(id => id), 'obra', 'titulo', 'cartel');
          setSeen(vistas_obra);
          console.log('Seen:', vistas_obra);
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
        fetchSeen(user.uid);
      } else {
        console.log('No user is signed in');
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div style={{ width: '100%' }}>
      <h2 style={{ paddingBottom: '3rem' }}>OBRAS VISTAS</h2>
      {seen.length > 0 && (
        <List>
          {seen.map((item, index) => (
            <ListItem key={index} component={NavLink} to={`/obra/${item.id}`} button>
              <ListItemAvatar>
                <Avatar 
                  src={item.photo} 
                  variant="square" 
                  style={{ width: '60px', height: '90px', objectFit: 'contain', marginRight: '1rem' }} 
                />
              </ListItemAvatar>
              <ListItemText primary={item.name} primaryTypographyProps={{ style: { color: 'black' } }} />
            </ListItem>
          ))}
        </List>
      )}
    </div>
  );
};

export default Seen;