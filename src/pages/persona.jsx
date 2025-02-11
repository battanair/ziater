import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc, collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebaseConfig"; // Asegúrate de que db está bien exportado desde firebaseConfig
import { Grid, Box, Typography, Accordion, AccordionSummary, AccordionDetails, Stack } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Imagenesobra from "../components/imagenesobra";
import Personaindex from "../components/personaindex";
import { NavLink } from "react-router-dom";
import { Premiosobra } from "../components/premiosobra";

const Persona = () => {
    const { id } = useParams();
    const [persona, setPersona] = useState(null);
    const [obrasRelacionadas, setObrasRelacionadas] = useState([]);
    const [puestos, setPuestos] = useState([]);
    const [premiosPersona, setPremiosPersona] = useState([]);


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
    
                        puestosSet.add(trabajoData.puesto); // Guardamos los puestos únicos
    
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
                            nombre: nombrePremio,
                            año: premioData.anio_premper,
                            categoria: premioData.galardon_pers
                        };
                    })
                );
    
                setPremiosPersona(premios);
            } catch (error) {
                console.error("Error al obtener los premios de la persona:", error);
            }
        };
    
        fetchPersona();
        fetchObrasRelacionadas();
        fetchPremiosPersona();
    }, [id]);
    

    if (!persona) return <h1>Cargando datos...</h1>;

    return (
        <>
            <Grid container spacing={4} sx={{ paddingTop: 4, paddingBottom: 4, paddingLeft: 4 }}>
                {/* Columna 1: Imagen */}
                <Grid item xs={12} md={4}>
                    <Box sx={{ textAlign: "center" }}>
                        <img
                            src={persona.foto || "https://via.placeholder.com/300"} // Fallback si no hay foto
                            alt="Persona"
                            style={{ width: "100%", borderRadius: "8px" }}
                        />
                    </Box>
                </Grid>

                {/* Columna 2: Texto */}
                <Grid item xs={12} md={8}>
                    <Box sx={{ display: "flex", alignItems: "baseline", gap: 1, marginBottom: 1 }}>
                        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                            {persona.Nombre} {persona.Apellidos}
                        </Typography>
                    </Box>

                    <Typography variant="body1" sx={{ fontWeight: "bold", marginBottom: "8px" }}>
                        {puestos.length > 0 ? puestos.join(" / ") : ""}
                    </Typography>

                    <Typography variant="body2" paragraph>
                        {persona.biografía || ""}
                    </Typography>
                </Grid>
            </Grid>

            {/* OBRAS RELACIONADAS */}
            
            {obrasRelacionadas.length > 0 ? (
    <>
        <Typography
            variant="h5"
            component="h5"
            sx={{ fontWeight: "bold", textAlign: "center", marginTop: 5, marginBottom: 3 }}
        >
            OBRAS DESTACADAS
        </Typography>
        <Grid container spacing={4} sx={{ maxWidth: "100%", margin: "0 auto" }}>
            {obrasRelacionadas.slice(0, 4).map((obra, index) => ( // Limitamos a 4
                <Grid item xs={6} sm={3} md={3} key={index}>
                    <NavLink to={`/obra/${obra.id}`} style={{ textDecoration: 'none' }}>
                        <Personaindex
                            nombrepersona={obra.obraTitulo}
                            puestopersona={obra.personaje}
                            fotito={obra.cartel}
                        />
                    </NavLink>
                </Grid>
            ))}
        </Grid> {/* 👈 Asegúrate de cerrar correctamente el Grid */}
    </>
) : (
    <Typography>" "</Typography>
)}



            {/* ACORDEÓN DE ELENCO */}
            <Box sx={{ marginTop: 5, paddingBottom: 5 }}>
                {puestos.length > 0 ? (
                    puestos.map((puesto, index) => (
                        <Accordion key={index}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls={`panel${index}-content`} id={`panel${index}-header`} sx={{background: "black", color: "white"}}>
                                <h5>{puesto}</h5>
                            </AccordionSummary>
                            <AccordionDetails>
                                {obrasRelacionadas
                                    .filter(obra => obra.puesto === puesto)
                                    .map((obra, idx) => {
                                        const anioInicio = obra.anoinicio || "Año desconocido";
                                        const anioFin = !obra.anofin || obra.anofin === 0 ? "Actualmente" : obra.anofin;
                                        const anioTexto = anioInicio !== "Año desconocido" ? `(${anioInicio} - ${anioFin})` : "";

                                        return (
                                            <NavLink to={`/obra/${obra.id}`} style={{ textDecoration: 'none' }} >
                                                <Stack key={idx} direction="row" spacing={2} alignItems="center">
                                                    <img
                                                        src={obra.cartel || "https://via.placeholder.com/70"}
                                                        alt={obra.obraTitulo}
                                                        style={{ width: "70px", borderRadius: "8px" }}
                                                    />
                                                    <Typography variant="body1" sx={{ lineHeight: 1.2, color: "#333", fontSize: "1rem" }}>
                                                        <b>{obra.obraTitulo}</b> {anioTexto} <br /> {obra.personaje} <br /> {obra.categoria || ""}
                                                    </Typography>
                                                </Stack>
                                            </NavLink>
                                        );
                                    })}
                            </AccordionDetails>
                        </Accordion>
                    ))
                ) : (
                    <Typography>""</Typography>
                )}
            </Box>

            {/* PREMIOS */}
            {/* PREMIOS */}
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
    {premiosPersona.length > 0 ? (
        premiosPersona.map((premio, index) => (
            <Premiosobra key={index} premio={premio.nombre} year={premio.año} condecoracion={premio.categoria} />
        ))
    ) : (
        <Typography>No hay premios registrados.</Typography>
    )}
</Stack>

        </>
    );
};

export default Persona;
