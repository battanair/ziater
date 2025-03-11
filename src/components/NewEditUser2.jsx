import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, collection, getDocs, query, where, updateDoc, arrayRemove, arrayUnion } from "firebase/firestore";
import { db, auth } from "../firebaseConfig";
import { Box, Typography, Accordion, AccordionSummary, AccordionDetails, Stack, IconButton, Button } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EditIcon from "@mui/icons-material/Edit";
import { onAuthStateChanged } from 'firebase/auth';
import ArrowBackIcon from "@mui/icons-material/ArrowBack"; // Importa el ícono

const NewEditUser2 = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [persona, setPersona] = useState(null);
    const [obrasRelacionadas, setObrasRelacionadas] = useState([]);
    const [puestos, setPuestos] = useState([]);
    const [premiosPersona, setPremiosPersona] = useState([]);
    const [isFavorite, setIsFavorite] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchPersona = async () => {
            if (!id) return;
            try {
                const docRef = doc(db, "persona", id);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setPersona(docSnap.data());
                } else {
                    console.log("No se encontró ningún documento");
                }
            } catch (error) {
                console.error("Error al obtener datos de la persona:", error);
            }
        };

        const fetchObrasRelacionadas = async () => {
            if (!id) return;
            try {
                const q = query(collection(db, "persona_obra"), where("id_persona", "==", id));
                const querySnapshot = await getDocs(q);

                const puestosSet = new Set();

                const trabajos = await Promise.all(
                    querySnapshot.docs.map(async (docTrabajo) => {
                        const trabajoData = docTrabajo.data();
                        let obraTitulo = "Desconocido";
                        let cartel = "https://via.placeholder.com/70";
                        let categoria = "Desconocido";

                        puestosSet.add(trabajoData.puesto);

                        if (trabajoData.id_obra) {
                            const obraRef = doc(db, "obra", trabajoData.id_obra);
                            const obraSnap = await getDoc(obraRef);

                            if (obraSnap.exists()) {
                                const obraData = obraSnap.data();
                                obraTitulo = obraData.titulo || "Desconocido";
                                cartel = obraData.cartel || cartel;
                                categoria = Array.isArray(obraData.categoria) ? obraData.categoria.join(", ") : obraData.categoria || categoria;
                            }
                        }

                        return {
                            id: trabajoData.id_obra || docTrabajo.id,
                            puesto: trabajoData.puesto,
                            personaje: trabajoData.titulo,
                            obraTitulo,
                            cartel,
                            anoinicio: trabajoData.fecha_inicio || null,
                            anofin: trabajoData.fecha_fin || null,
                            categoria,
                            trabajoId: docTrabajo.id // ID del documento en "persona_obra"
                        };
                    })
                );

                setObrasRelacionadas(trabajos);
                setPuestos([...puestosSet]);
            } catch (error) {
                console.error("Error al obtener trabajos relacionados:", error);
            }
        };

        const fetchUser = () => {
            onAuthStateChanged(auth, async (user) => {
                if (user) {
                    setUser(user);
                    const userRef = doc(db, 'users', user.uid);
                    const userSnap = await getDoc(userRef);
                    if (userSnap.exists()) {
                        const userData = userSnap.data();
                        setIsFavorite(userData.favoritos_persona?.includes(id));
                    }
                } else {
                    setUser(null);
                }
            });
        };

        const fetchPremiosPersona = async () => {
            if (!id) return;
            try {
                const q = query(collection(db, "premios_personas"), where("id_persona", "==", id));
                const querySnapshot = await getDocs(q);

                const premios = await Promise.all(
                    querySnapshot.docs.map(async (docPremio) => {
                        const premioData = docPremio.data();
                        let nombrePremio = "Desconocido";

                        if (premioData.id_premio) {
                            const premioRef = doc(db, "premios", premioData.id_premio);
                            const premioSnap = await getDoc(premioRef);

                            if (premioSnap.exists()) {
                                nombrePremio = premioSnap.data().nombre_premio || "Desconocido";
                            }
                        }

                        return {
                            id: docPremio.id, // ID del documento en "premios_personas"
                            id_premio: premioData.id_premio || "sin-id", // Asegura que id_premio esté presente
                            nombre: nombrePremio,
                            año: premioData.anio_premper || "Año desconocido",
                            categoria: premioData.galardon_pers || "Categoría desconocida",
                        };
                    })
                );

                setPremiosPersona(premios);
                console.log("Premios obtenidos:", premios); // Verifica en la consola si los premios llegan correctamente
            } catch (error) {
                console.error("Error al obtener los premios de la persona:", error);
            }
        };

        fetchPersona();
        fetchObrasRelacionadas();
        fetchPremiosPersona();
        fetchUser();
    }, [id]);

    const handleFavoriteClick = async () => {
        if (!user) return; // Si el usuario no está autenticado, no hacer nada

        const userRef = doc(db, "users", user.uid);
        try {
            if (isFavorite) {
                await updateDoc(userRef, {
                    favoritos_persona: arrayRemove(id),
                });
                setIsFavorite(false);
            } else {
                await updateDoc(userRef, {
                    favoritos_persona: arrayUnion(id),
                });
                setIsFavorite(true);
            }
        } catch (error) {
            console.error("Error al actualizar favoritos:", error);
        }
    };

    const handleEditClick = (trabajoId) => {
        navigate(`/edit-user3/${trabajoId}`);
    };

    const handleBackClick = () => {
        navigate(`/dashboard`);
    };

    if (!persona) return <h1>Cargando datos...</h1>;

    return (
        <Box sx={{ marginTop: 5, paddingBottom: 5, paddingTop: 5 }}>
            <IconButton aria-label="back" onClick={handleBackClick} sx={{ marginBottom: 2 }}>
                <ArrowBackIcon />
            </IconButton>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ marginBottom: 2 }}>
                <h4>EDITAR TRABAJOS</h4>
                <Button variant="contained" sx={{ backgroundColor: 'black', color: 'white' }} onClick={() => navigate(`/edit-user3/?id_persona=${id}`)}>
                    Añadir Trabajo
                </Button>
            </Stack>
            {puestos.length > 0 ? (
                puestos.map((puesto, index) => (
                    <Accordion key={index}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls={`panel${index}-content`} id={`panel${index}-header`} sx={{ background: "black", color: "white" }}>
                            <h5>{puesto === "Actor" ? "Interpretación" : puesto}</h5>
                        </AccordionSummary>
                        <AccordionDetails>
                            {obrasRelacionadas
                                .filter(obra => obra.puesto === puesto)
                                .map((obra, idx) => {
                                    const anioInicio = obra.anoinicio || "Año desconocido";
                                    const anioFin = !obra.anofin || Number(obra.anofin) === 0 ? "Actualmente" : obra.anofin;
                                    const anioTexto = anioInicio !== "Año desconocido" ? `(${anioInicio} - ${anioFin})` : "";
                                    return (
                                        <Stack
                                            direction="row"
                                            spacing={2}
                                            alignItems="center"
                                            justifyContent="space-between"
                                            sx={{ width: '100%', marginBottom: 2 }} // Añadir margen inferior
                                            key={idx}
                                        >
                                            <Stack direction="row" spacing={2} alignItems="center">
                                                <img
                                                    src={obra.cartel || "https://via.placeholder.com/70"}
                                                    alt={obra.obraTitulo}
                                                    style={{ width: "70px", borderRadius: "8px" }}
                                                />
                                                <Typography variant="body1" sx={{ lineHeight: 1.2, color: "#333", fontSize: "1rem" }}>
                                                    <b>{obra.obraTitulo}</b>  <br />{anioTexto} <br /> {obra.personaje}
                                                </Typography>
                                            </Stack>
                                            <IconButton aria-label="edit" onClick={() => handleEditClick(obra.trabajoId)}>
                                                <EditIcon />
                                            </IconButton>
                                        </Stack>
                                    );
                                })}
                        </AccordionDetails>
                    </Accordion>
                ))
            ) : (
                <Typography></Typography>
            )}
        </Box>
    );
};

export default NewEditUser2;
