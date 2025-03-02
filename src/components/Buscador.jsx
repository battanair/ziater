import * as React from 'react';
import { Link } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Avatar from '@mui/material/Avatar';
import { db } from '../firebaseConfig'; // Asegúrate de importar tu configuración de Firebase
import { collection, getDocs } from 'firebase/firestore';
import { styled } from '@mui/material/styles';

const CustomTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    '&.Mui-focused fieldset': {
      borderColor: 'black',
    },
    '&.Mui-focused .MuiInputBase-input': {
      color: 'black',
    },
  },
  '& .MuiInputLabel-root': {
    '&.Mui-focused': {
      color: 'black',
    },
  },
});

export default function Asynchronous() {
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [inputValue, setInputValue] = React.useState('');

  const fetchOptions = async (input) => {
    if (input.length === 0) {
      setOptions([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    let allOptions = [];

    const collections = [
      { name: 'obra', label: 'titulo', image: 'cartel', path: 'obra' },
      { name: 'persona', label: 'Nombre', extraLabel: 'Apellidos', image: 'foto', path: 'persona' },
      { name: 'productoras', label: 'nombre_prod', image: 'foto_prod', path: 'compania' },
      { name: 'premios', label: 'nombre_premio', image: 'foto_premio', path: 'premios' },
      { name: 'teatro', label: 'nombre_teatro', image: 'foto', path: 'teatro' } // Añadido para teatros
    ];

    for (let col of collections) {
      const querySnapshot = await getDocs(collection(db, col.name));
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const fullName = col.extraLabel ? `${data[col.label] || ''} ${data[col.extraLabel] || ''}`.trim() : data[col.label];
        allOptions.push({
          id: doc.id,
          name: fullName || 'Sin nombre',
          img: data[col.image] || '',
          path: `/${col.path}/${doc.id}`
        });
      });
    }

    setOptions(allOptions.slice(0, 10)); // Limitar a 10 resultados
    setLoading(false);
  };

  const handleOpen = () => {
    setOpen(true);
    fetchOptions(inputValue);
  };

  const handleClose = () => {
    setOpen(false);
    setOptions([]);
  };

  const handleInputChange = (event, value) => {
    setInputValue(value);
    fetchOptions(value);
  };

  return (
    <Autocomplete
      sx={{ width: 300 }}
      open={open}
      onOpen={handleOpen}
      onClose={handleClose}
      onInputChange={handleInputChange}
      isOptionEqualToValue={(option, value) => option.name === value.name}
      getOptionLabel={(option) => option.name}
      options={options}
      loading={loading}
      renderOption={(props, option) => (
        <li {...props} key={option.id} style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
          <Link to={option.path} style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit', width: '100%', padding: '8px' }}>
            <Avatar 
              src={option.img} 
              alt={option.name} 
              sx={{ width: 40, height: 60, marginRight: 1, borderRadius: '4px' }} 
              variant="square"
            />
            {option.name}
          </Link>
        </li>
      )}
      renderInput={(params) => (
        <CustomTextField
          {...params}
          label="Buscar"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
}
