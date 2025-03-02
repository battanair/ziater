import React, { useEffect, useState } from "react";
import { Container, Typography, Button, Box, Divider } from "@mui/material";
import { styled } from "@mui/system";
import { motion } from "framer-motion";

const HeroSection = styled(Box)({
  textAlign: "center",
  padding: "6rem 2rem",
  backgroundColor: "white",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
});

const Section = styled(Box)({
  padding: "6rem 2rem",
  maxWidth: "900px",
  margin: "auto",
  textAlign: "left",
});

const BlackDivider = styled(Divider)({
  backgroundColor: "black",
  height: "4px",
  width: "100%",
  margin: "5rem 0",
});

const StyledButton = styled(Button)({
  marginTop: "2rem",
  padding: "1rem 2.5rem",
  fontSize: "1.2rem",
  borderRadius: "30px",
  fontWeight: "bold",
  backgroundColor: "black",
  color: "white",
  '&:hover': {
    backgroundColor: "#444",
  }
});

const ProgressBar = styled(Box)(({ width }) => ({
  position: "fixed",
  bottom: 0,
  left: 0,
  width: `${width}%`,
  height: "15px",
  backgroundColor: "black",
  transition: "width 0.2s ease-out",
}));

export default function Home() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / scrollHeight) * 100;
      setScrollProgress(progress);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <Container maxWidth="lg">
      <ProgressBar width={scrollProgress} />

      {/* Hero Section */}
      <HeroSection component={motion.div} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          ¿Estás preparado para el cambio de
          las artes escénicas españolas?
        </Typography>
      </HeroSection>

      <BlackDivider />

      {/* Secciones */}
      {[
        { title: "QUÉ ES", subtitle: "La gran base de datos escénica", text: "Descubre todos los rincones de los profesionales de las artes en vivo, la mayor red como profesional y la opción de guardar programas de mano." },
        { title: "CÓMO FUNCIONA", subtitle: "Las artes vivas inmortalizadas", text: "Una interfaz sencilla y amigable para tener al alcance de tu mano la creación escénica actual y pasada." },
        { subtitle: "El arte de lo más humano más cerca que nunca", text: "Los perfiles podrán incluir sus trabajos. Los espectadores encontrarán la información del mundo de las artes vivas dentro para acercarlo aún más al gran público." },
        { title: "CUÁNTO CUESTA", subtitle: "La cultura como bien público", text: "Interfaz de usuario/espectador: GRATIS SIEMPRE. Índice de perfiles pro: GRATIS SIEMPRE. Más detalles de la información bajo MEMBRESÍA." },
        { title: "POR QUÉ", subtitle: "Necesidad y compromiso", text: "Este proyecto nace de la necesidad de amor por el teatro. Compilar la información entre el sector público y privado." },
        { title: "Encuentra mucho más de lo que pensabas que existía.", subtitle: "Bienvenido a la auténtica digitalización de las artes vivas", text: "Lo que ocurre en un escenario, no se queda en él." },

      ].map((section, index) => (
        <Section key={index} component={motion.div} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          {section.title && <Typography variant="subtitle1" fontWeight="bold">{section.title}</Typography>}
          <Typography variant="h4" gutterBottom fontWeight="bold">
            {section.subtitle}
          </Typography>
          <Typography>{section.text}</Typography>
        </Section>
      ))}
    </Container>
  );
}
