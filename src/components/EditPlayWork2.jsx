import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import {
  Autocomplete,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Button,
  IconButton,
} from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { doc, getDoc, updateDoc, addDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";

const initialTrabajoState = {
  id_persona: "",
  puesto: "",
  titulo: "",
  fecha_inicio: "",
  fecha_fin: "",
  id_obra: "",
};

const EditPlayWork2 = ({ artistas = [], errors = {} }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id_obra = queryParams.get("id_obra");
  const [trabajo, setTrabajo] = useState({ ...initialTrabajoState, id_obra });
  const [loading, setLoading] = useState(false);
  const [persona, setPersona] = useState({ Nombre: "", Apellidos: "" });
  const [personas, setPersonas] = useState([]);

  console.log("id desde URL:", id); // Verificar que `id` llega
  console.log("id_obra desde URL:", id_obra); // Verificar que `id_obra` llega

  const fetchTrabajo = useCallback(async () => {
    if (!id) return;
    
    try {
      console.log(`Consultando Firestore con id: ${id}`);
      const docRef = doc(db, "persona_obra", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        console.log("Documento encontrado:", docSnap.data());
        setTrabajo(docSnap.data());
        fetchPersona(docSnap.data().id_persona);
      } else {
        console.warn("No se encontró el documento en Firestore");
        setTrabajo(initialTrabajoState);
      }
    } catch (error) {
      console.error("Error al obtener el documento:", error);
      setTrabajo(initialTrabajoState);
    }
  }, [id]);

  const fetchPersona = async (id_persona) => {
    try {
      const docRef = doc(db, "persona", id_persona);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setPersona(docSnap.data());
      } else {
        console.warn("No se encontró la persona en Firestore");
      }
    } catch (error) {
      console.error("Error al obtener la persona:", error);
    }
  };

  const fetchPersonas = async () => {
    try {
      const personasSnapshot = await getDocs(collection(db, "persona"));
      setPersonas(personasSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Error al obtener las personas:", error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchTrabajo();
    }
    fetchPersonas();
  }, [fetchTrabajo, id]);

  const handleTrabajoChange = (field, value) => {
    setTrabajo((prevTrabajo) => ({
      ...prevTrabajo,
      [field]: value,
    }));
  };

  const saveTrabajo = async () => {
    setLoading(true);
    try {
      if (id) {
        const docRef = doc(db, "persona_obra", id);
        await updateDoc(docRef, trabajo);
        console.log("Documento actualizado correctamente.");
      } else {
        await addDoc(collection(db, "persona_obra"), trabajo);
        console.log("Documento añadido correctamente.");
      }
    } catch (error) {
      console.error("Error al guardar el documento:", error);
    }
    setLoading(false);
    navigate(-1);
  };

  return (
    <Box sx={{ paddingTop: "50px", paddingBottom: "50px" }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <IconButton onClick={() => navigate(-1)} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6">{id ? "Editar Trabajo" : "Añadir Trabajo"}</Typography>
      </Box>

      {!id && (
        <Autocomplete
          sx={{ mb: 2 }}
          options={personas}
          getOptionLabel={(option) => (option?.Nombre ? `${option.Nombre} ${option.Apellidos}` : '')}
          filterOptions={(options, { inputValue }) => 
            options
              .filter((option) => 
                `${option.Nombre} ${option.Apellidos}`.toLowerCase().includes(inputValue.toLowerCase())
              )
              .slice(0, 5) // Limita a un máximo de 5 opciones
          }
          value={personas.find((persona) => persona.id === trabajo.id_persona) || null}
          onChange={(event, newValue) => {
            if (newValue && typeof newValue === 'object') {
              handleTrabajoChange('id_persona', newValue.id); // Guarda el ID de la persona seleccionada
            }
          }}
          renderOption={(props, option) => (
            <Box
              {...props}
              sx={{ display: 'flex', alignItems: 'center', gap: 2, padding: '8px' }}
            >
              <img
                src={option?.foto || '/default-avatar.png'} // Ruta de la foto o imagen por defecto
                alt={`${option.Nombre} ${option.Apellidos}`}
                style={{
                  width: 40,
                  height: 60, // Altura mayor para que sea rectangular
                  objectFit: 'cover', // Mantiene las proporciones de la imagen
                  borderRadius: '4px', // Bordes ligeramente redondeados
                }}
              />
              <Typography>{`${option.Nombre} ${option.Apellidos}`}</Typography>
            </Box>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Persona"
              fullWidth
              onBlur={(e) => {
                const value = e.target.value.trim();

                if (value.startsWith('http')) {
                  const id = value.split('/').pop(); // Extrae la ID de la URL
                  handleTrabajoChange('id_persona', id);
                }
              }}
              disabled={!!trabajo.id_persona} // Deshabilita el campo si ya hay un id_persona
            />
          )}
        />
      )}

      {id && (
        <TextField
          label="Persona"
          value={`${persona.Nombre} ${persona.Apellidos}`}
          fullWidth
          sx={{ mb: 2 }}
          InputProps={{
            readOnly: true,
          }}
        />
      )}

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Departamento</InputLabel>
        <Select
          value={trabajo.puesto || ""}
          onChange={(e) => handleTrabajoChange("puesto", e.target.value)}
          error={!!errors.trabajos}
        >
          {["Actor", "Dramaturgia", "Iluminación", "Dirección", "Escenografía", "Espacio Sonoro", "Vestuario", "Asesoría", "Fotografía", "Diseño", "Comunicación"].map((puesto) => (
            <MenuItem key={puesto} value={puesto}>{puesto}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        label="Trabajo / Personaje"
        value={trabajo.titulo || ""}
        onChange={(e) => handleTrabajoChange("titulo", e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
        placeholder={trabajo.titulo || ""}
      />
      <TextField
        label="Fecha Inicio"
        type="number"
        value={trabajo.fecha_inicio || ""}
        onChange={(e) => handleTrabajoChange("fecha_inicio", e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
        placeholder={trabajo.fecha_inicio || ""}
      />
      <Box display="flex" alignItems="center" gap={2}>
        <TextField
          label="Fecha Fin"
          type="number"
          value={trabajo.fecha_fin || ""}
          onChange={(e) => handleTrabajoChange("fecha_fin", e.target.value)}
          fullWidth
          placeholder={trabajo.fecha_fin || ""}
        />
        <Button
          variant="outlined"
          onClick={() => handleTrabajoChange("fecha_fin", "0")}
          sx={{ color: "black", borderColor: "black" }}
        >
          Actualmente
        </Button>
      </Box>

      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={saveTrabajo}
        disabled={loading}
        sx={{ mt: 2, backgroundColor: "black", color: "white" }} // Cambia el color del texto a blanco
      >
        {loading ? "Guardando..." : id ? "Guardar cambios" : "Añadir trabajo"}
      </Button>
    </Box>
  );
};

export default EditPlayWork2;
