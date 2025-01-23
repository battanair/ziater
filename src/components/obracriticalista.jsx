import Stack from "@mui/material/Stack";
import { Obracriticas } from "./Obracriticas";
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';

export const Obracriticalista = () => {
    return (
        <>
            <h5 style={{ textAlign: "center" }}><b>CRÍTICAS</b></h5>

            <Stack
                direction={{ xs: 'column', sm: 'row' }} // Por defecto columna, en pantallas más grandes fila
                spacing={2}
                sx={{
                    width: "100%",
                    padding: 2,
                    flexWrap: "wrap", // Permite que se envuelvan las críticas en dispositivos grandes
                }}
            >
                {/* Critica 1 */}
                <Obracriticas
                    medio="La Gacetilla"
                    texto="Esta es la crítica del primer medio. Darío Duarte, hijo de uruguayos, es un dramaturgo que a sus 45 años se enfrenta a su primer estreno en la Sala Grande del Teatro María Guerrero..."
                    nota="9,5"
                />

                {/* Critica 2 */}
                <Obracriticas
                    medio="Otro medio"
                    texto="Darío Duarte, hijo de uruguayos, es un dramaturgo que a sus 45 años se enfrenta a su primer estreno en la Sala Grande del Teatro María Guerrero..."
                    nota="8"
                />
            </Stack>

            {/* Botón para ver todas las críticas */}
            <Grid
                container
                direction="row"
                sx={{
                    justifyContent: "space-around",
                    alignItems: "flex-start",
                    marginTop: 3,
                }}
            >
                <Button variant="contained" size="large" sx={{ background: 'black', marginBottom: '40px' }}>
                    <h5><b>TODAS LAS CRÍTICAS</b></h5>
                </Button>
            </Grid>
        </>
    );
};
