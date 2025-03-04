import React, { useEffect, useState, useRef } from "react";
import { Container, Typography, Button, Box, Divider } from "@mui/material";
import { styled } from "@mui/system";
import { motion } from "framer-motion";

const HeroSection = styled(Box)(({ theme }) => ({
  textAlign: "center",
  padding: "6rem 2rem",
  backgroundColor: "white",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  height: "calc(100vh - 221px)", // Adjust for navbar height
  justifyContent: "center",
  [theme.breakpoints.down('sm')]: {
    height: "calc(100vh - 331px)", // Adjust for smaller navbar height on small screens
  },
}));

const Section = styled(Box)(({ theme }) => ({
  padding: "6rem 2rem",
  maxWidth: "900px",
  margin: "auto",
  textAlign: "left",
  height: "100vh", // Adjust for navbar height
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  [theme.breakpoints.down('sm')]: {
    height: "100vh", // Adjust for smaller navbar height on small screens
  },
}));

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
  const isScrolling = useRef(false);
  const firstScroll = useRef(true);

  useEffect(() => {
    const handleScroll = () => {
      if (isScrolling.current) return;

      const scrollTop = window.scrollY;
      const viewportHeight = window.innerHeight;
      const navbarHeight = firstScroll.current ? (window.innerWidth < 600 ? 331 : 221) : 0;
      const currentSection = Math.round((scrollTop + navbarHeight) / viewportHeight);

      isScrolling.current = true;
      window.scrollTo({
        top: currentSection * viewportHeight - navbarHeight,
        behavior: "smooth",
      });

      setTimeout(() => {
        isScrolling.current = false;
        firstScroll.current = false;
      }, 500); // Adjust the timeout duration as needed for smoother scroll
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <Container maxWidth="lg">
      <ProgressBar width={scrollProgress} />

      {/* Hero Section */}
      <HeroSection component={motion.div} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
        <Typography variant="h5" gutterBottom fontWeight="bold" fontSize="2.5rem">
          ¿Cambiamos mano a mano las artes escénicas?
        </Typography>
      </HeroSection>

      {/* Secciones */}
      {[
        { title: "QUÉ ES", subtitle: "La gran base de datos escénica", text: "Descubre todos los rincones de los profesionales de las artes en vivo, la mayor red como profesional y la opción de guardar programas de mano." },
        { title: "CÓMO FUNCIONA", subtitle: "Las artes vivas inmortalizadas", text: "Una interfaz sencilla y amigable para tener al alcance de tu mano la creación escénica actual y pasada." },
        { subtitle: "El arte de lo más humano más cerca que nunca", text: "Los perfiles podrán incluir sus trabajos. Los espectadores encontrarán la información del mundo de las artes vivas dentro para acercarlo aún más al gran público." },
        { title: "CUÁNTO CUESTA", subtitle: "La cultura como bien público", text: "Interfaz de usuario/espectador: GRATIS SIEMPRE. Índice de perfiles pro: GRATIS SIEMPRE. Más detalles de la información bajo MEMBRESÍA." },
        { title: "POR QUÉ", subtitle: "Necesidad y compromiso", text: "Este proyecto nace de la necesidad de amor por el teatro. Compilar la información entre el sector público y privado." },
        { title: "Encuentra mucho más de lo que pensabas que existía.", subtitle: "Bienvenido a la auténtica digitalización de las artes vivas", text: "Lo que ocurre en un escenario, no se queda en él." },
      ].map((section, index) => (
        <Section
          key={index}
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
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
