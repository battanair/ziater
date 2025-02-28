import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, doc, getDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

// Importar componentes de MUI
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, IconButton, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const fetchPremios = async (id, setPremios, setPersona, setLoading) => {
  if (!id) {
    console.error("Error: id es undefined.");
    setLoading(false);
    return;
  }

  try {
    console.log(`Fetching premios for id_persona: ${id}`);

    const premiosQuery = query(collection(db, 'premios_personas'), where('id_persona', '==', id));
    const premiosSnapshot = await getDocs(premiosQuery);

    if (premiosSnapshot.empty) {
      console.log('No premios found for this person.');
      setPremios([]);
      setLoading(false);
      return;
    }

    const premiosData = await Promise.all(
      premiosSnapshot.docs.map(async (docSnapshot) => {
        const premio = docSnapshot.data();
        console.log('Premio encontrado:', premio);

        // Obtener los datos de la persona y el premio
        const personaRef = doc(db, 'persona', premio.id_persona);
        const premioRef = doc(db, 'premios', premio.id_premio);

        const [personaDoc, premioDoc] = await Promise.all([
          getDoc(personaRef),
          getDoc(premioRef)
        ]);

        const personaData = personaDoc.exists() 
          ? { Nombre: personaDoc.data().Nombre, Apellidos: personaDoc.data().Apellidos }
          : { Nombre: 'Desconocido', Apellidos: '' };

        const premioData = premioDoc.exists()
          ? { nombre_premio: premioDoc.data().nombre_premio }
          : { nombre_premio: 'Desconocido' };

        return {
          id: docSnapshot.id,
          anio: premio.anio_premper,
          galardon: premio.galardon_pers,
          persona: personaData,
          premio: premioData
        };
      })
    );

    console.log('Fetched premios data:', premiosData);
    setPremios(premiosData);

    // Establecer los datos de la persona
    if (premiosData.length > 0) {
      setPersona(premiosData[0].persona);
    }
  } catch (error) {
    console.error("Error fetching premios: ", error);
  } finally {
    setLoading(false);
  }
};

const EditarPremios = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [premios, setPremios] = useState([]);
  const [persona, setPersona] = useState({ Nombre: '', Apellidos: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("ID recibido en EditarPremios:", id);
    if (id) {
      fetchPremios(id, setPremios, setPersona, setLoading);
    }
  }, [id]);

  const handleEditClick = (premioId) => {
    navigate(`/editarpremio2/${premioId}`);
  };

  const handleAddClick = () => {
    navigate(`/editarpremio2?id_persona=${id}`);
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleDeleteClick = async (premioId) => {
    try {
      await deleteDoc(doc(db, 'premios_personas', premioId));
      setPremios((prevPremios) => prevPremios.filter((premio) => premio.id !== premioId));
    } catch (error) {
      console.error("Error deleting premio: ", error);
    }
  };

  if (loading) {
    return <CircularProgress style={{ display: 'block', margin: 'auto', marginTop: '20px' }} />;
  }

  return (
    <div style={{ paddingTop: '50px', paddingBottom: '50px' }}>
      <IconButton onClick={handleBackClick} style={{ marginBottom: '20px' }}>
        <ArrowBackIcon />
      </IconButton>
      <h3>Editar los premios de {persona.Nombre} {persona.Apellidos}</h3>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
        <Button variant="contained" color="primary" onClick={handleAddClick} style={{ backgroundColor: 'black' }}>
          Añadir premio
        </Button>
      </div>
      {premios.length === 0 ? (
        <p>No hay premios registrados para esta persona.</p>
      ) : (
        <TableContainer component={Paper} style={{ maxWidth: 800, margin: 'auto', marginTop: 20 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Año</strong></TableCell>
                <TableCell><strong>Galardón</strong></TableCell>
                <TableCell><strong>Premio</strong></TableCell>
                <TableCell><strong>Editar/Borrar</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {premios.map((premio, index) => (
                <TableRow key={index}>
                  <TableCell>{premio.anio}</TableCell>
                  <TableCell>{premio.galardon}</TableCell>
                  <TableCell>{premio.premio.nombre_premio}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEditClick(premio.id)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteClick(premio.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};

export default EditarPremios;
