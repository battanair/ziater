import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, doc, getDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, IconButton, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const fetchPremios = async (id, setPremios, setObra, setLoading) => {
  if (!id) {
    console.error("Error: id es undefined.");
    setLoading(false);
    return;
  }

  try {
    console.log(`Fetching premios for id_obra: ${id}`);

    const premiosQuery = query(collection(db, 'premios_obras'), where('id_obra', '==', id));
    const premiosSnapshot = await getDocs(premiosQuery);

    if (premiosSnapshot.empty) {
      console.log('No premios found for this play.');
      setPremios([]);
      setLoading(false);
      return;
    }

    const premiosData = await Promise.all(
      premiosSnapshot.docs.map(async (docSnapshot) => {
        const premio = docSnapshot.data();
        console.log('Premio encontrado:', premio);

        // Obtener los datos de la obra y el premio
        const obraRef = doc(db, 'obra', premio.id_obra);
        const premioRef = doc(db, 'premios', premio.id_premio);

        const [obraDoc, premioDoc] = await Promise.all([
          getDoc(obraRef),
          getDoc(premioRef)
        ]);

        const obraData = obraDoc.exists() 
          ? { titulo: obraDoc.data().titulo }
          : { titulo: 'Desconocido' };

        const premioData = premioDoc.exists()
          ? { nombre_premio: premioDoc.data().nombre_premio }
          : { nombre_premio: 'Desconocido' };

        return {
          id: docSnapshot.id,
          anio: premio.anio_premobr,
          galardon: premio.galardon_obra,
          obra: obraData,
          premio: premioData
        };
      })
    );

    console.log('Fetched premios data:', premiosData);
    setPremios(premiosData);

    if (premiosData.length > 0) {
      setObra(premiosData[0].obra);
    }
  } catch (error) {
    console.error("Error fetching premios: ", error);
  } finally {
    setLoading(false);
  }
};

const EditPlayAwards = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [premios, setPremios] = useState([]);
  const [obra, setObra] = useState({ titulo: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("ID recibido en EditPlayAwards:", id);
    if (id) {
      fetchPremios(id, setPremios, setObra, setLoading);
    }
  }, [id]);

  const handleEditClick = (premioId) => {
    navigate(`/editplayawards2/${premioId}`);
  };

  const handleAddClick = () => {
    navigate(`/editplayawards2?id_obra=${id}`);
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleDeleteClick = async (premioId) => {
    try {
      await deleteDoc(doc(db, 'premios_obras', premioId));
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
      <h3>Editar los premios de {obra.titulo}</h3>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
        <Button variant="contained" color="primary" onClick={handleAddClick} style={{ backgroundColor: 'black' }}>
          Añadir premio
        </Button>
      </div>
      {premios.length === 0 ? (
        <p>No hay premios registrados para esta obra.</p>
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

export default EditPlayAwards;
