import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, collection, query, where, getDocs, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '../firebaseConfig'; 
import { Grid, Box, Typography, Accordion, AccordionSummary, AccordionDetails, Stack } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Imagenesobra from "../components/imagenesobra";
import Personaindex from "../components/personaindex";
import { NavLink } from "react-router-dom";
import { Premiosobra } from "../components/premiosobra";
import InstagramIcon from '@mui/icons-material/Instagram';
import FavoriteIcon from '@mui/icons-material/Favorite';

const Persona = () => {
    const { id } = useParams();
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
                            categoria
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
                    favoritos_persona: arrayRemove(id)
                });
                setIsFavorite(false);
            } else {
                await updateDoc(userRef, {
                    favoritos_persona: arrayUnion(id)
                });
                setIsFavorite(true);
            }
        } catch (error) {
            console.error("Error al actualizar los favoritos:", error);
        }
    };

    if (!persona) return <div>Cargando...</div>;

    return (
        <>
            <Grid container spacing={4} sx={{ padding: 4 }}>
                <Grid item xs={12} md={4}>
                    <Box sx={{ textAlign: "center" }}>
                        <img
                            src={persona.foto || "https://via.placeholder.com/300"}
                            alt="Persona"
                            style={{ width: "100%", borderRadius: "8px" }}
                        />
                    </Box>
                </Grid>

                <Grid item xs={12} md={8}>
                    <Stack 
                        direction="row" 
                        spacing={2} 
                        sx={{ marginBottom: 2, justifyContent: 'flex-end' }} // Alinea los iconos a la derecha
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                width: 30,
                                height: 30,
                                borderRadius: '50%',
                                backgroundColor: isFavorite ? 'black' : 'white',
                                color: isFavorite ? 'white' : 'black',
                                cursor: 'pointer',
                                border: '1px solid black', // Agrega un borde
                                '&:hover': {
                                    backgroundColor: 'black',
                                    color: 'white',
                                },
                            }}
                            onClick={handleFavoriteClick}
                        >
                            <FavoriteIcon />
                        </Box>
                    </Stack>
                    <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                        {persona.Nombre} {persona.Apellidos}
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: "bold", marginBottom: "8px" }}>
                        {puestos.length > 0 ? puestos.join(" / ") : ""}
                    </Typography>
                    <Typography variant="body2" paragraph>
                        {persona.biografia || ""}
                    </Typography>
                    {persona.instagram && (
                        <Box sx={{ textAlign: "left", marginTop: 2 }}>
                            <a href={`https://www.instagram.com/${persona.instagram}`} target="_blank" rel="noopener noreferrer">
                                <InstagramIcon sx={{ fontSize: 30, color: "black" }} />
                            </a>
                        </Box>
                    )}
                </Grid>
            </Grid>

            {obrasRelacionadas.length > 0 && (
                <>
                    <Typography variant="h5" sx={{ fontWeight: "bold", textAlign: "center", marginY: 3 }}>
                        OBRAS DESTACADAS
                    </Typography>
                    <Grid container spacing={4} sx={{ maxWidth: "100%", margin: "0 auto" }}>
                        {Array.from(new Set(obrasRelacionadas.map(obra => obra.id))) // Elimina duplicados
                            .slice(0, 4)
                            .map((obraId, index) => {
                                const obra = obrasRelacionadas.find(o => o.id === obraId);
                                return (
                                    <Grid item xs={6} sm={3} md={3} key={index}>
                                        <NavLink to={`/obra/${obra.id}`} style={{ textDecoration: 'none' }}>
                                            <Personaindex
                                                nombrepersona={obra.obraTitulo}
                                                puestopersona={obra.personaje}
                                                fotito={obra.cartel}
                                            />
                                        </NavLink>
                                    </Grid>
                                );
                            })}
                    </Grid>
                </>
            )}

            <Box sx={{ marginTop: 5, paddingBottom: 5 }}>
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
                                        const anioFin = !obra.anofin || obra.anofin === 0 || obra.anofin === "0" ? "Actualmente" : obra.anofin;
                                        const anioTexto = anioInicio !== "Año desconocido" ? `(${anioInicio} - ${anioFin})` : "";
                                        return (
                                            <NavLink to={`/obra/${obra.id}`} style={{ textDecoration: 'none' }} key={idx}>
                                                <Stack direction="row" spacing={2} alignItems="center" sx={{ marginBottom: 2 }}>
                                                    <img
                                                        src={obra.cartel || "https://via.placeholder.com/70"}
                                                        alt={obra.obraTitulo}
                                                        style={{ width: "70px", borderRadius: "8px" }}
                                                    />
                                                    <Typography variant="body1" sx={{ lineHeight: 1.2, color: "#333", fontSize: "1rem" }}>
                                                        <b>{obra.obraTitulo}</b>  <br />{anioTexto} <br /> {obra.personaje}
                                                    </Typography>
                                                </Stack>
                                            </NavLink>
                                        );
                                    })}
                            </AccordionDetails>
                        </Accordion>
                    ))
                ) : (
                    <Typography></Typography>
                )}
            </Box>
            {premiosPersona.length > 0 ? (
                <>
                    <Typography variant="h5" component="h5" sx={{ fontWeight: "bold", textAlign: "center", marginTop: 5, marginBottom: 3 }}>
                        PREMIOS
                    </Typography>
                    <Stack
                        direction={{ xs: "column", sm: "row" }}
                        spacing={2}
                        sx={{
                            justifyContent: { xs: "center", sm: "space-around" },
                            alignItems: "center",
                            width: "100%",
                            paddingX: 2,
                            paddingBottom: 5,
                        }}
                    >
                        {premiosPersona.map((premio, index) => (
                            <NavLink key={index} to={`/premios/${premio.id_premio}`} style={{ textDecoration: 'none' }}>
                                <Premiosobra premio={premio.nombre} year={premio.año} condecoracion={premio.categoria} />
                            </NavLink>
                        ))}
                    </Stack>
                </>
            ) : (
                <Typography></Typography>
            )}
        </>
    );
};

export default Persona;
