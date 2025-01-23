import Stack from '@mui/material/Stack';
import Item from './item';

const Categoriaobra = ({ categoria1, categoria2, nota }) => {
    return (
        <Stack
            direction="row"
            spacing={1}
            sx={{
                justifyContent: "flex-end",
                alignItems: "center",
                marginBottom: 2
            }}
        >
            <Item>{categoria1}</Item>
            <Item>{categoria2}</Item>
            <Item
                sx={{
                    width: 40, // Ajusta el tamaño del círculo
                    height: 40,
                    borderRadius: "50%", // Hace el objeto redondo
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "lightgrey", // Fondo opcional
                    color: "black", // Color del texto opcional
                    fontWeight: "bold", // Opcional para destacar la nota
                }}
            >
                {nota}
            </Item>
        </Stack>
    );
};

export default Categoriaobra;




