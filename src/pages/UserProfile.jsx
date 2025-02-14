import React, { useState, useEffect } from 'react';
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from '../firebaseConfig';

const provider = new GoogleAuthProvider();

function UserProfile() {
  const [nombre, setNombre] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [user, setUser] = useState(null);
  const [profileCompleted, setProfileCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

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

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (user) {
      try {
        await setDoc(doc(db, "users", user.uid), {
          nombre: nombre,
          apellidos: apellidos,
        });
        setProfileCompleted(true);
      } catch (error) {
        console.error("Error al guardar el perfil:", error);
      }
    }
  };

  if (loading) {
    return <p>Cargando...</p>;
  }

  if (!user) {
    return <button onClick={signInWithGoogle}>Iniciar sesión con Google</button>;
  }

  if (profileCompleted) {
    return <p>Hola {nombre} {apellidos}</p>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Nombre:
        <input type="text" value={nombre} onChange={handleNombreChange} />
      </label>
      <br />
      <label>
        Apellidos:
        <input type="text" value={apellidos} onChange={handleApellidosChange} />
      </label>
      <br />
      <button type="submit">Guardar Perfil</button>
    </form>
  );
}

export default UserProfile;
