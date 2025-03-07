import React, { useState } from "react";
import { Container, Typography, Button, Box, Divider, TextField } from "@mui/material";
import { styled } from "@mui/system";
import { motion } from "framer-motion";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { db } from '../firebaseConfig';
import { collection, addDoc } from "firebase/firestore";

const HeroSection = styled(Box)(({ theme }) => ({
  textAlign: "center",
  padding: "6rem 2rem",
  backgroundColor: "white",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  height: "calc(70vh - 221px)", // Adjust for navbar height
  justifyContent: "center",
  [theme.breakpoints.down('sm')]: {
    height: "calc(70vh - 331px)", // Adjust for smaller navbar height on small screens
  },
}));

const Section = styled(Box)(({ theme }) => ({
  padding: "6rem 2rem",
  maxWidth: "900px",
  margin: "auto",
  textAlign: "left",
  height: "50vh", // Adjust for navbar height
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  [theme.breakpoints.down('sm')]: {
    height: "60vh", // Adjust for smaller navbar height on small screens
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
  fontSize: "1rem",
    fontWeight: "bold",
  backgroundColor: "white",
  color: "black",
  '&:hover': {
    backgroundColor: "#ddd",
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

const Arrow = styled('div')`
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  color: black;
  padding: 10px;
  border-radius: 50%;
  cursor: pointer;
  z-index: 1;
  font-size: 24px;
  box-shadow: none;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  &:hover, &:active {
    color: black;
  }
`;

const ContactSection = styled(Box)(({ theme }) => ({
  backgroundColor: "black",
  color: "white",
  padding: "4rem 2rem",
  textAlign: "center",
}));

const ContactForm = styled('form')({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  marginTop: "2rem",
});

const StyledTextField = styled(TextField)({
  '& .MuiInputBase-input': {
    color: 'white',
  },
  '& .MuiInputLabel-root': {
    color: 'white',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: 'white',
    },
    '&:hover fieldset': {
      borderColor: 'white',
    },
    '&.Mui-focused fieldset': {
      borderColor: 'white',
    },
  },
});

function NextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <Arrow
      className={`slick-arrow slick-next ${className}`}
      style={{ ...style, right: "5px" }}
      onClick={onClick}
    >
      &gt;
    </Arrow>
  );
}

function PrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <Arrow
      className={`slick-arrow slick-prev ${className}`}
      style={{ ...style, left: "-25px" }}
      onClick={onClick}
    >
      &lt;
    </Arrow>
  );
}

export default function Home() {
  const [scrollProgress, setScrollProgress] = useState(0);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      message: formData.get('message'),
    };
    try {
      await addDoc(collection(db, "fallos"), data);
      alert("Mensaje enviado con éxito");
    } catch (error) {
      console.error("Error al enviar el mensaje: ", error);
      alert("Hubo un error al enviar el mensaje");
    }
    event.target.reset();
  };

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
      <Slider {...settings}>
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
      </Slider>

      {/* Contact Section */}
      <ContactSection sx={{width: "100%"}}>
        <Typography variant="h6" gutterBottom sx={{ color: "white" }}>
          Hola, toda esta web está siendo programada por una sola persona que lo está haciendo con todo el cariño del mundo. Si hay algún error por favor ponte en contacto conmigo.
        </Typography>
        <ContactForm onSubmit={handleSubmit}>
          <StyledTextField
            label="Nombre"
            name="name"
            variant="outlined"
            margin="normal"
            fullWidth
            required
          />
          <StyledTextField
            label="Email"
            name="email"
            type="email"
            variant="outlined"
            margin="normal"
            fullWidth
            required
          />
          <StyledTextField
            label="Mensaje"
            name="message"
            variant="outlined"
            margin="normal"
            fullWidth
            required
            multiline
            rows={4}
          />
          <StyledButton type="submit">Enviar</StyledButton>
        </ContactForm>
      </ContactSection>
    </Container>
  );
}
