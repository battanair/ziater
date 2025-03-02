import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import { NavLink } from 'react-router-dom';
 
const Todoelequipo = () => {
    const { id_obra } = useParams();
    const navigate = useNavigate();
    const [tituloObra, setTituloObra] = useState("Cargando...");
    const [equipo, setEquipo] = useState({});

    useEffect(() => {
        if (!id_obra) {
            console.warn("id_obra es undefined o null");
            setTituloObra("ID de obra no válido");
            return;
        }

        const fetchEquipo = async () => {
            try {
                const idObraNormalizado = id_obra.trim();

                // Obtener el título de la obra
                const obraRef = doc(db, "obra", idObraNormalizado);
                const obraSnap = await getDoc(obraRef);
                if (obraSnap.exists()) {
                    setTituloObra(`Todo el equipo de ${obraSnap.data().titulo}`);
                } else {
                    setTituloObra("Obra no encontrada");
                }

                // Obtener relaciones persona_obra filtradas por id_obra
                const q = query(collection(db, "persona_obra"), where("id_obra", "==", idObraNormalizado));
                const querySnapshot = await getDocs(q);
                let equipoTemp = {};

                for (const docSnap of querySnapshot.docs) {
                    const data = docSnap.data();
                    const personaRef = doc(db, "persona", data.id_persona);
                    const personaSnap = await getDoc(personaRef);

                    if (personaSnap.exists()) {
                        const persona = personaSnap.data();
                        const puesto = data.puesto || "Sin puesto";

                        if (!equipoTemp[puesto]) {
                            equipoTemp[puesto] = [];
                        }

                        equipoTemp[puesto].push({
                            id: data.id_persona,
                            nombre: persona.Nombre,
                            apellidos: persona.Apellidos,
                            foto: persona.foto || "https://via.placeholder.com/70",
                            fecha_inicio: data.fecha_inicio,
                            fecha_fin: data.fecha_fin,
                        });
                    }
                }

                setEquipo(equipoTemp);
            } catch (error) {
                console.error("Error obteniendo equipo:", error);
                setTituloObra("Error al obtener datos");
            }
        };

        fetchEquipo();
    }, [id_obra]);

    return (
        <Container sx={{ padding: 3 }}>
            <Box display="flex" alignItems="center">
                <IconButton onClick={() => navigate(`/obra/${id_obra}`)}>
                    <ArrowBackIcon />
                </IconButton>
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                    {tituloObra}
                </Typography>
            </Box>

            <Box sx={{ marginTop: 5, paddingBottom: 5 }}>
  {Object.keys(equipo).length > 0 ? (
    Object.entries(equipo).map(([puesto, personas], index) => (
      <Accordion key={index}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ background: "black", color: "white" }}>
          <Typography variant="h6">{puesto === "Actor" ? "Reparto" : puesto}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {personas.map((persona, idx) => (
            <NavLink to={`/persona/${persona.id}`} key={idx} style={{ textDecoration: 'none', color: 'inherit' }}>
              <Stack direction="row" spacing={2} alignItems="center" sx={{ marginBottom: 2 }}>
                <Avatar src={persona.foto} alt={persona.nombre} sx={{ height: 57, borderRadius: 0 }} />
                <Typography>
                  <b>{persona.nombre} {persona.apellidos}</b> <br />({persona.fecha_inicio} - {persona.fecha_fin === "0" || persona.fecha_fin === 0 ? "Actualmente" : persona.fecha_fin})
                </Typography>
              </Stack>
            </NavLink>
          ))}
        </AccordionDetails>
      </Accordion>
    ))
  ) : (
    <Typography>No hay información disponible.</Typography>
  )}
</Box>
        </Container>
    );
};

export default Todoelequipo;