import React, { useState, useEffect } from "react";
import { Container, Typography, Button, Box, Divider, TextField, Grid } from "@mui/material";
import { styled, useTheme } from "@mui/system";
import { motion } from "framer-motion";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { db } from '../firebaseConfig';
import { collection, addDoc, getDocs } from "firebase/firestore";
import Personaindex from "../components/personaindex";
import { NavLink } from 'react-router-dom';
import { Helmet } from "react-helmet-async";


const HeroSection = styled(Box)(({ theme }) => ({
  textAlign: "center",
  padding: "6rem 2rem",
  backgroundColor: "white",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  height: "calc(70vh - 221px)", // Ajuste para la altura del navbar
  justifyContent: "center",
  width: "100%", // Asegura que no exceda el ancho
  [theme.breakpoints.down('sm')]: {
    height: "calc(70vh - 331px)", // Ajuste para pantallas pequeñas
    padding: "3rem 1rem", // Reduce el padding en móviles
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
  width: "100%", // Asegura que no exceda el ancho
  [theme.breakpoints.down('sm')]: {
    padding: "3rem 1rem",
    height: "auto", // Adjust for smaller navbar height on small screens
  },
}));

const GridContainer = styled(Grid)(({ theme }) => ({
  maxWidth: "100%",
  margin: '0 auto',
  marginBottom: 3,
  flexWrap: 'wrap', // Asegura que los elementos se ajusten en móviles
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'row', // Apila los elementos verticalmente en móviles
    padding: "0 1rem", // Reduce el padding en móviles
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
  [theme.breakpoints.down('sm')]: {
    padding: "2rem 1rem",
  },
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

const Footer = styled(Box)(({ theme }) => ({
  backgroundColor: "black",
  color: "white",
  padding: "1rem 2rem",
  textAlign: "center",
  marginTop: "auto",
  [theme.breakpoints.down('sm')]: {
    padding: "0.5rem 1rem",
  },
}));

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
  const theme = useTheme();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [personas, setPersonas] = useState([]);
  const [obras, setObras] = useState([]);

  useEffect(() => {
    const fetchPersonas = async () => {
      const querySnapshot = await getDocs(collection(db, "persona"));
      const personasData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPersonas(personasData);
    };

    const fetchObras = async () => {
      const querySnapshot = await getDocs(collection(db, "obra"));
      const obrasData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setObras(obrasData);
    };

    fetchPersonas();
    fetchObras();
  }, []);

  const getRandomPersonas = (personas, count) => {
    const filteredPersonas = personas.filter(persona => persona.foto && persona.foto !== 'https://res.cloudinary.com/dk0vvcpyn/image/upload/v1740952724/imagenesdefecto/znmg1esf30tgxcwbgpnl.jpg');
    const shuffled = filteredPersonas.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  const getRandomObras = (obras, count) => {
    const filteredObras = obras.filter(obra => obra.cartel && obra.cartel !== 'https://res.cloudinary.com/dk0vvcpyn/image/upload/v1740952724/imagenesdefecto/u92idnadh254vhm9wi84.jpg');
    const shuffled = filteredObras.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true, // Ajusta la altura automáticamente
    responsive: [
      {
        breakpoint: 768, // Para pantallas pequeñas
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
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
    <><Helmet>
        <title>Ziater.com</title>
        <meta name="description" content="La base de datos de artes escénicas. 11" />
      </Helmet>

    <Container 
      sx={{ 
        display: "flex", 
        flexDirection: "column", 
        paddingBottom: 0, 
        maxWidth: "100%", 
        overflowX: "hidden" 
      }}
    >

      {/* Hero Section */}
      <HeroSection component={motion.div} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
        <Typography variant="h5"  fontWeight="bold" fontSize="2.5rem" sx={{ textAlign: { xs: 'center', sm: 'left' }, paddingBottom: 4 }}>
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
            <Typography variant="h4" fontWeight="bold">
              {section.subtitle}
            </Typography>
            <Typography>{section.text}</Typography>
          </Section>
        ))}
      </Slider>

      {/* Personas Destacadas */}
      <Section gutterBottom sx={{ marginBottom: 4 }}>
        <Typography variant="h4" fontWeight="bold" textAlign="center">
          Personas destacadas
        </Typography>
        <GridContainer container spacing={4} justifyContent="center">
          {getRandomPersonas(personas, 4).map(persona => (
            <Grid 
              item 
              xs={12} 
              sm={6} 
              md={3} 
              key={persona.id} 
              sx={{ 
                marginBottom: 4, 
                display: 'flex', 
                justifyContent: 'center', 
                [theme.breakpoints.down('sm')]: { 
                  width: '100%', // Asegura que ocupe todo el ancho en móviles
                  marginBottom: 2 
                } 
              }}
            >
              <NavLink to={`/persona/${persona.id}`} style={{ textDecoration: 'none' }}>
                <Personaindex
                  nombrepersona={`${persona.Nombre} ${persona.Apellidos}`}
                  fotito={persona.foto}
                />
              </NavLink>
            </Grid>
          ))}
        </GridContainer>
      </Section>

      {/* Espectáculos Destacados */}
      <Section gutterBottom sx={{ marginBottom: 5 }}>
        <Typography variant="h4" fontWeight="bold" textAlign="center">
          Espectáculos destacados
        </Typography>
        <GridContainer container spacing={4} justifyContent="center">
            {getRandomObras(obras, 4).map(obra => (
            <Grid item xs={6} sm={6} md={3} key={obra.id} sx={{ marginBottom: 4, display: 'flex', justifyContent: 'center', [theme.breakpoints.down('sm')]: { width: '80%', marginBottom: 2 } }}>
              <NavLink to={`/obra/${obra.id}`} style={{ textDecoration: 'none' }}>
                <Personaindex 
                  nombrepersona={obra.titulo}
                  fotito={obra.cartel}
                />
              </NavLink>
            </Grid>
          ))}
        </GridContainer>
      </Section>

      {/* Contact Section */}
      <ContactSection sx={{width: "100%"}}>
        <Typography variant="h6"  sx={{ color: "white" }}>
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

     
    </Container></>
  );
}
