import Grid from '@mui/material/Grid2';
import Personaindex from './personaindex';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Switch from '@mui/material/Switch';


const AntSwitch = styled(Switch)(({ theme }) => ({
  width: 28,
  height: 16,
  padding: 0,
  display: 'flex',
  '&:active': {
    '& .MuiSwitch-thumb': {
      width: 15,
    },
    '& .MuiSwitch-switchBase.Mui-checked': {
      transform: 'translateX(9px)',
    },
  },
  '& .MuiSwitch-switchBase': {
    padding: 2,
    '&.Mui-checked': {
      transform: 'translateX(12px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: 'black',
      },
    },
  },
  '& .MuiSwitch-thumb': {
    boxShadow: theme.shadows[1],
    width: 12,
    height: 12,
    borderRadius: 6,
    transition: theme.transitions.create(['width'], {
      duration: 200,
    }),
  },
  '& .MuiSwitch-track': {
    borderRadius: 16 / 2,
    opacity: 1,
    backgroundColor:
      theme.palette.mode === 'dark' ? '#177ddc' : '#aab4be',
    boxSizing: 'border-box',
  },
}));

const Elencoobra = () => {
  return (
    <>
      <Grid
        container
        sx={{
          paddingTop: 4,
          paddingBottom: 8,
          textAlign: 'center',
        }}
        direction={'column'}
      >
        <h5>
          <b>ELENCO</b>
        </h5>

        <Stack
          direction="row"
          spacing={1}
          sx={{
            justifyContent: 'center',
            alignItems: 'center',
            
          }}
        >
          <Typography>Original</Typography>
          <AntSwitch defaultChecked inputProps={{ 'aria-label': 'ant design' }} />
          <Typography>Actual</Typography>
        </Stack>

        <Grid
          container
          direction="row"
          sx={{
            justifyContent: 'space-evenly',
            alignItems: 'flex-start',
            marginTop: 3,
          }}
        >
          <Personaindex nombrepersona="Actriz Actrizer" puestopersona="Personaje 1" />
          <Personaindex nombrepersona="Actor Actorez" puestopersona="Personaje 2" />
          <Personaindex nombrepersona="Actriz Actrizer" puestopersona="Personaje 3" />
          <Personaindex nombrepersona="Actor Actorez" puestopersona="Personaje 4" />
        </Grid>
        <Grid
          container
          direction="row"
          sx={{
            justifyContent: 'space-around',
            alignItems: 'flex-start',
            marginTop: 3,
          }}
        >
          <Button
            variant="contained"
            size="large"
            sx={{ background: 'black' }}
          >
            <h5>
              <b>TODO EL EQUIPO</b>
            </h5>
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

export default Elencoobra;
