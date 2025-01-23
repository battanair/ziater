import { Typography } from "@mui/material";
import Paper from "@mui/material/Paper";

export const Obracriticas = ({ medio, texto, nota }) => {
    return (
        <Paper
            elevation={3}
            sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                padding: 2,
                backgroundColor: "white",
                borderRadius: "16px",
            }}
        >
            {/* Contenedor para el título y la nota */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between", // Espacio entre los elementos
                    alignItems: "center", // Centra verticalmente
                    marginBottom: 8, // Espaciado con el contenido siguiente
                }}
            >
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    {medio}
                </Typography>
                <div
                    style={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%", // Círculo
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "lightgrey",
                        color: "black",
                        fontWeight: "bold",
                    }}
                >
                    {nota}
                </div>
            </div>

            {/* Texto de la crítica */}
            <Typography variant="body2">
                {texto}{" "}
                <a href="#" style={{ textDecoration: "underline", color: "inherit" }}>
                    (más)
                </a>
            </Typography>
        </Paper>
    );
};
