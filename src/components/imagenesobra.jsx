import React, { useState, useRef } from "react";
import Slider from "react-slick";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const ImagenesObra = ({ imagenes = [] }) => {
  const [open, setOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const sliderRef = useRef(null);

  // Filtrar imágenes no válidas
  const validImages = imagenes.filter((img) => img);

  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: Math.min(2, validImages.length),
    slidesToScroll: 1,
    centerMode: validImages.length > 1,
    arrows: false, // Desactivar flechas por defecto de slick-carousel
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

  const handleOpen = (index) => {
    setCurrentIndex(index);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handlePrev = () => {
    if (sliderRef.current) {
      sliderRef.current.slickPrev();
    }
  };

  const handleNext = () => {
    if (sliderRef.current) {
      sliderRef.current.slickNext();
    }
  };

  return (
    <div style={{ maxWidth: "100%", margin: "0", padding: "0", position: "relative" }}>
      {validImages.length > 0 ? (
        <div style={{ position: "relative" }}>
          <Slider ref={sliderRef} {...settings}>
            {validImages.map((src, index) => (
              <div key={index} style={{ padding: "0" }}>
                <img
                  src={src}
                  alt={`Slide ${index}`}
                  style={{
                    height: "200px",
                    width: "100%",
                    objectFit: "cover",
                    display: "block",
                    cursor: "pointer",
                  }}
                  onClick={() => handleOpen(index)}
                />
              </div>
            ))}
          </Slider>

          {validImages.length > 1 && (
            <>
              <IconButton
                onClick={handlePrev}
                sx={{
                  position: "absolute",
                  left: 10,
                  top: "50%",
                  transform: "translateY(-50%)",
                  zIndex: 2,
                  color: "white",
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  '&:hover': { backgroundColor: "rgba(0, 0, 0, 0.7)" }
                }}
              >
                <ArrowBackIosNewIcon />
              </IconButton>
              <IconButton
                onClick={handleNext}
                sx={{
                  position: "absolute",
                  right: 10,
                  top: "50%",
                  transform: "translateY(-50%)",
                  zIndex: 2,
                  color: "white",
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  '&:hover': { backgroundColor: "rgba(0, 0, 0, 0.7)" }
                }}
              >
                <ArrowForwardIosIcon />
              </IconButton>
            </>
          )}
        </div>
      ) : (
        <p>No hay imágenes disponibles</p>
      )}

      {/* Modal */}
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
          onClick={handleClose}
        >
          <Box
            onClick={(e) => e.stopPropagation()}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
            }}
          >
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

            {validImages.length > 1 && (
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
            )}

            <img
              src={validImages[currentIndex]}
              alt={`Ampliada ${currentIndex}`}
              style={{
                maxHeight: "90%",
                maxWidth: "90%",
                objectFit: "contain",
              }}
            />

            {validImages.length > 1 && (
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
            )}
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default ImagenesObra;
