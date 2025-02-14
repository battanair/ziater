import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import { Obracriticas } from '../components/Obracriticas';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Rating from '@mui/material/Rating';
import { db } from '../firebaseConfig';
import { collection, getDocs, query, where, doc, getDoc, addDoc, updateDoc } from 'firebase/firestore';
import { useAuth } from '../components/AuthContext';

const Criticas = () => {
    const { id_obra } = useParams(); 
    const navigate = useNavigate();
    const { user } = useAuth();
    const [criticas, setCriticas] = useState([]);
    const [tituloObra, setTituloObra] = useState("Cargando...");
    const [open, setOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [userCritica, setUserCritica] = useState(null);
    const [nuevaCritica, setNuevaCritica] = useState({ titulo_critica: '', cuerpo: '', nota: 1 });

    useEffect(() => {
        if (!id_obra) {
            console.warn("id_obra es undefined o null");
            setTituloObra("ID de obra no válido");
            return;
        }

        const fetchCriticas = async () => {
            try {
                const idObraNormalizado = id_obra.trim();
                const q = query(collection(db, "criticas"), where("id_obra", "==", idObraNormalizado));
                const querySnapshot = await getDocs(q);
                const criticasArray = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setCriticas(criticasArray);

                if (user) {
                    const userCrit = criticasArray.find(c => c.user_id === user.uid);
                    setUserCritica(userCrit || null);
                }

                const obraRef = doc(db, "obra", idObraNormalizado);
                const obraSnap = await getDoc(obraRef);
                setTituloObra(obraSnap.exists() ? `Críticas de ${obraSnap.data().titulo}` : "Obra no encontrada");
            } catch (error) {
                console.error("Error obteniendo críticas:", error);
                setTituloObra("Error al obtener datos");
            }
        };

        fetchCriticas();
    }, [id_obra, user]);

    const handleOpenModal = () => {
        if (userCritica) {
            setNuevaCritica({ ...userCritica });
            setEditMode(true);
        } else {
            setNuevaCritica({ titulo_critica: '', cuerpo: '', nota: 1 });
            setEditMode(false);
        }
        setOpen(true);
    };

    const handleSaveCritica = async () => {
        if (!nuevaCritica.titulo_critica || !nuevaCritica.cuerpo) return;
        try {
            if (editMode && userCritica) {
                const criticaRef = doc(db, "criticas", userCritica.id);
                await updateDoc(criticaRef, { ...nuevaCritica });
                setCriticas(criticas.map(c => c.id === userCritica.id ? { ...c, ...nuevaCritica } : c));
                setUserCritica({ ...userCritica, ...nuevaCritica });
            } else {
                const docRef = await addDoc(collection(db, "criticas"), { id_obra, ...nuevaCritica, user_id: user.uid });
                const newCritica = { ...nuevaCritica, id: docRef.id };
                setCriticas([...criticas, newCritica]);
                setUserCritica(newCritica);
            }
            setOpen(false);
        } catch (error) {
            console.error("Error guardando crítica:", error);
        }
    };

    return (
        <Container sx={{ padding: 3 }}>
            <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box display="flex" alignItems="center">
                    <IconButton onClick={() => navigate(`/obra/${id_obra}`)}>
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                        {tituloObra}
                    </Typography>
                </Box>
                {user && (
                    <Button variant="contained" sx={{ backgroundColor: 'black', color: 'white' }} onClick={handleOpenModal}>
                        {userCritica ? "Editar tu crítica" : "Añadir crítica"}
                    </Button>
                )}
            </Box>
            {criticas.length > 0 ? (
                criticas.map((critica) => (
                    <Box key={critica.id} sx={{ margin: 3 }}>
                        <Obracriticas 
                            titulo={critica.titulo_critica}
                            texto={critica.cuerpo}
                            nota={critica.nota}
                        />
                    </Box>
                ))
            ) : (
                <Typography variant="body1" sx={{ margin: 3 }}>
                    No hay críticas disponibles para esta obra.
                </Typography>
            )}
            <Modal open={open} onClose={() => setOpen(false)}>
                <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'white', p: 4, boxShadow: 24, borderRadius: 2 }}>
                    <Typography variant="h6" sx={{ marginBottom: 2 }}>{editMode ? "Editar crítica" : "Añadir crítica"}</Typography>
                    <TextField fullWidth label="Título" margin="dense" value={nuevaCritica.titulo_critica} onChange={(e) => setNuevaCritica({ ...nuevaCritica, titulo_critica: e.target.value })} />
                    <TextField fullWidth multiline rows={4} label="Crítica" margin="dense" value={nuevaCritica.cuerpo} onChange={(e) => setNuevaCritica({ ...nuevaCritica, cuerpo: e.target.value })} />
                    <Typography sx={{ marginTop: 2 }}>Nota:</Typography>
                    <Rating name="nota" value={nuevaCritica.nota / 2} onChange={(e, newValue) => setNuevaCritica({ ...nuevaCritica, nota: newValue * 2 })} precision={0.5} max={5} />
                    <Button fullWidth variant="contained" sx={{ marginTop: 2, backgroundColor: 'black', color: 'white' }} onClick={handleSaveCritica}>
                        Guardar
                    </Button>
                </Box>
            </Modal>
        </Container>
    );
};

export default Criticas;
