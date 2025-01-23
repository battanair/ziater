import React, { useState } from "react";
import Slider from "react-slick";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Imagenesobra = ({imagen1, imagen2, imagen3, imagen4, imagen5}) => {
  const [open, setOpen] = useState(false); // Estado para el modal
  const [currentIndex, setCurrentIndex] = useState(0); // Índice de la imagen actual

  const images = [
    `${imagen1}`,
    `${imagen2}`,
    `${imagen3}`,
    `${imagen4}`,
    `${imagen5}`,
  ];

  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    centerMode: true,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  // Abre el modal y establece el índice de la imagen seleccionada
  const handleOpen = (index) => {
    setCurrentIndex(index);
    setOpen(true);
  };

  // Cierra el modal
  const handleClose = () => {
    setOpen(false);
  };

  // Mueve a la imagen anterior
  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  // Mueve a la siguiente imagen
  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div style={{ maxWidth: "100%", margin: "0", padding: "0" }}>
      {/* Slider */}
      <Slider {...settings}>
        {images.map((src, index) => (
          <div key={index} style={{ padding: "0" }}>
            <img
              src={src}
              alt={`Slide ${index}`}
              style={{
                height: "200px",
                width: "100%",
                objectFit: "cover",
                display: "block",
                cursor: "pointer", // Cursor de puntero para indicar clic
              }}
              onClick={() => handleOpen(index)} // Abre la imagen al hacer clic
            />
          </div>
        ))}
      </Slider>

      {/* Modal para mostrar la imagen ampliada */}
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            position: "relative",
          }}
          onClick={handleClose} // Cierra al hacer clic fuera
        >
          {/* Detener propagación del clic dentro del modal */}
          <Box
            onClick={(e) => e.stopPropagation()}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
            }}
          >
            {/* Botón cerrar */}
            <IconButton
              onClick={handleClose}
              sx={{
                position: "absolute",
                top: "16px",
                right: "16px",
                color: "white",
              }}
            >
              <CloseIcon />
            </IconButton>

            {/* Botón anterior */}
            <IconButton
              onClick={handlePrev}
              sx={{
                position: "absolute",
                left: "16px",
                color: "white",
              }}
            >
              <ArrowBackIosNewIcon />
            </IconButton>

            {/* Imagen ampliada */}
            <img
              src={images[currentIndex]}
              alt={`Ampliada ${currentIndex}`}
              style={{
                maxHeight: "90%",
                maxWidth: "90%",
                objectFit: "contain",
              }}
            />

            {/* Botón siguiente */}
            <IconButton
              onClick={handleNext}
              sx={{
                position: "absolute",
                right: "16px",
                color: "white",
              }}
            >
              <ArrowForwardIosIcon />
            </IconButton>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default Imagenesobra;
