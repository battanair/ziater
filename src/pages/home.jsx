import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Box, Typography, Button, Grid, Container } from "@mui/material";


const Home = () => {
    const [user, setUser] = useState(null);
    const auth = getAuth();
    const categories = [
        {
          title: "ESPECTÁCULOS",
          items: ["Teatro", "Impro", "Circo", "Musicales", "Stand up", "Danza", "Drag", "Ópera", "Zarzuela", "Performance", "Ficción sonora", "Magia"],
        },
        {
          title: "PROFESIONALES",
          items: ["Dirección", "Dramaturgia", "Reparto", "Artistas", "Iluminación", "Escenografía", "Espacio sonoro", "Vestuario", "Asesoría", "Fotografía", "Diseño", "Comunicación"],
        },
        {
          title: "EMPRESAS Y COMPAÑÍAS",
          items: ["Creativas", "Técnicas", "Casting", "Distribución"],
        },
        {
          title: "MEDIOS",
          items: ["Especializados", "Generalistas"],
        },
      ];

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });

        return () => unsubscribe(); // Cleanup al desmontar
    }, []);

    return (
        <>
           <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "40vh",
        textAlign: "center",
        backgroundColor: "#fff",
        padding: "20px",
      }}
    >
      {/* Contenedor del título */}
      <Box sx={{ width: "100%", textAlign: "left", mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 300, letterSpacing: "2px" }}>
          ZIATER
        </Typography>
      </Box>

      {/* Pregunta central */}
      <Typography variant="h5" sx={{ maxWidth: "600px", fontWeight: 300 }}>
        ¿Estás preparado para el gran cambio de las artes escénicas españolas?
      </Typography>

      {/* Botón */}
      <Button
        variant="contained"
        sx={{
          marginTop: "20px",
          backgroundColor: "#000",
          color: "#fff",
          "&:hover": { backgroundColor: "#333" },
        }}
      >
        SABER MÁS
      </Button>

        {/* Contenedor de la butaca */}
        
      </Box>
      <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography variant="h6" fontWeight="300" gutterBottom>
        ¿QUÉ ES? 
      </Typography>
      <Typography variant="h3" fontWeight="bold" gutterBottom>
        La gran base de datos escénica
      </Typography>
      <Typography variant="h6" color="text.secondary" gutterBottom fontWeight="300">
        Descubre todos los trabajos de los profesionales de las <b>artes en vivo</b>, forma parte de <b>la mayor red como profesional</b>, olvídate de guardar <b>programas de mano</b>.
      </Typography>

      <Grid container spacing={4} sx={{ mt: 4 }}>
        {categories.map((category) => (
          <Grid item xs={12} sm={6} md={3} key={category.title}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              {category.title}
            </Typography>
            {category.items.map((item) => (
              <Typography key={item} variant="body1" color="text.secondary">
                {item}
              </Typography>
            ))}
          </Grid>
        ))}
      </Grid>
    </Container>
      </>
    );
};

export default Home;

