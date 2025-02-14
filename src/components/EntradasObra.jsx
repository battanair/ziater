import React, { useEffect, useState } from "react";
import { doc, collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig"; // Importa tu configuración de Firebase
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Typography,
  Button,
} from "@mui/material";

const EntradasObra = ({ obraId }) => {
  const [entradas, setEntradas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEntradas = async () => {
      if (!obraId) return;

      try {
        console.log("Consultando Firestore para obraId:", obraId);

        const obraRef = doc(db, "obra", obraId);
        const entradasRef = collection(obraRef, "entradas");
        const querySnapshot = await getDocs(entradasRef);

        if (querySnapshot.empty) {
          console.log("No hay entradas registradas en Firestore.");
          setEntradas([]);
          return;
        }

        const fetchedEntradas = querySnapshot.docs.flatMap((doc) => {
          const data = doc.data();
          console.log("Entrada encontrada:", data);
          return data.fechas_entradas?.map((timestamp) => ({
            id: doc.id,
            fecha: timestamp?.seconds ? new Date(timestamp.seconds * 1000) : null,
            precio: data.precio,
            enlace_entradas: data.enlace_entradas,
          })) || [];
        });

        // Ordenar las entradas por fecha
        fetchedEntradas.sort((a, b) => (a.fecha && b.fecha ? a.fecha - b.fecha : 0));

        setEntradas(fetchedEntradas);
      } catch (error) {
        console.error("Error cargando entradas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEntradas();
  }, [obraId]);

  return (
    <TableContainer component={Paper} sx={{ maxWidth: 600, margin: "auto", mt: 3, p: 2 }}>
      <Typography variant="h6" align="center" gutterBottom>
        Entradas a la venta
      </Typography>
      {loading ? (
        <CircularProgress sx={{ display: "block", margin: "auto" }} />
      ) : entradas.length > 0 ? (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center"><b>Fecha</b></TableCell>
              <TableCell align="center"><b>Hora</b></TableCell>
              <TableCell align="center"><b>Precio</b></TableCell>
              <TableCell align="center"><b>Enlace</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {entradas.map((entrada) => (
              <TableRow key={entrada.id}>
                <TableCell align="center">{entrada.fecha ? entrada.fecha.toLocaleDateString("es-ES", { day: "2-digit", month: "long", year: "numeric" }) : "Fecha no disponible"}</TableCell>
                <TableCell align="center">{entrada.fecha ? entrada.fecha.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }) : "Hora no disponible"}</TableCell>
                <TableCell align="center">{entrada.precio}€</TableCell>
                <TableCell align="center">
                  <a href={entrada.enlace_entradas} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                    <Button variant="contained" size="medium" sx={{ background: 'black' }}>
                      Comprar
                    </Button>
                  </a>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <Typography align="center" sx={{ mt: 2 }}>
          No hay entradas disponibles
        </Typography>
      )}
    </TableContainer>
  );
};

export default EntradasObra;
