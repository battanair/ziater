import { Typography } from "@mui/material"
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';


export const Premiosobra = ({premio, year, condecoracion}) =>{return(

    <Paper
    elevation={3}
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
       width: { xs: '200px', md: '200px' },
       height: { xs: '60px', md: '60px' },
      padding: 1,
      backgroundColor: 'white',
      borderRadius: '16px',
    }}
  > 
  <Stack
        sx={{
            alignItems: "center",
        }}
        direction="row"
        divider={<Divider orientation="vertical" flexItem />}
        spacing={2}
      >
        <EmojiEventsIcon />
        <Typography
  variant="body1"
  sx={{
    lineHeight: 1.2,
    color: '#333',
    fontSize: '0.8rem',
  }}
>
  <b>{premio} {year}</b>
  <br />
{condecoracion}
</Typography>
        
      </Stack>
  </Paper>

)}

