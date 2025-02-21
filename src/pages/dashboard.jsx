import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import DashboardIcon from '@mui/icons-material/Dashboard';
import FavoriteIcon from '@mui/icons-material/Favorite';
import BarChartIcon from '@mui/icons-material/BarChart';
import DescriptionIcon from '@mui/icons-material/Description';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';

import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { useDemoRouter } from '@toolpad/core/internal';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

// Importa los componentes de cada sección
import Cuenta from '../components/Cuenta';
import NuevaObra from '../components/NuevaObra';
import NewUserProfile from '../components/NewUserProfile';
import NewCompanyProfile from '../components/NewCompanyProfile';
import handleLogout from '../components/logout';
import NewAwardProfile from '../components/NewAwardProfile';
import NewPlayProfile from '../components/NewPlayProfile';
import NewTeatroProfile from '../components/NewTeatroProfile';

const COMPONENT_MAP = {
  cuenta: <Cuenta />, 
  'nueva-obra': <NewPlayProfile />, 
  'nueva-persona': <NewUserProfile />,
  'nueva-company': <NewCompanyProfile />,
  'nuevo-premios': <NewAwardProfile />,
  'nuevo-teatro': <NewTeatroProfile />,
};

function DemoPageContent({ pathname }) {
  return (
    <Box
      sx={{
        py: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        width: '100%',
        height: '100%',
        flexGrow: 1,
      }}
    >
      {COMPONENT_MAP[pathname] || <Typography>Página no encontrada</Typography>}
    </Box>
  );
}

DemoPageContent.propTypes = {
  pathname: PropTypes.string.isRequired,
};

function Dashboard(props) {
  const { window } = props;
  const router = useDemoRouter('/dashboard');
  const navigate = useNavigate();

  // Función de logout
  const handleLogoutClick = async () => {
    await handleLogout();
    navigate('/');
  };

  // Renderiza el botón de logout
  const renderLogoutButton = () => (
    <Button
      onClick={handleLogoutClick}
      sx={{
        
        backgroundColor: 'white',
        color: 'black',
        textTransform: 'none',
        width: '100%',
        justifyContent: 'flex-start',
        '&:hover': {
          backgroundColor: '#f0f0f0',
        },
      }}
    >
      Cerrar sesión
    </Button>
  );

  // Definir NAVIGATION dentro del componente
  const NAVIGATION = [
    { segment: 'cuenta', title: 'Tu Cuenta', icon: <DashboardIcon /> },
    { segment: 'vistos', title: 'Vistos', icon: <VisibilityIcon /> },
    { segment: 'favorites', title: 'Favoritos', icon: <FavoriteIcon /> },
    { segment: 'editar', title: 'Editar', icon: < EditIcon/> },
    {
      segment: 'addnadir',
      title: 'Añadir',
      icon: <ControlPointIcon />,
      children: [
        { segment: 'nueva-obra', title: 'Obra', icon: <DescriptionIcon /> },
        { segment: 'nueva-persona', title: 'Persona', icon: <DescriptionIcon /> },
        { segment: 'nueva-company', title: 'Compañía', icon: <DescriptionIcon /> },
        { segment: 'nuevo-premios', title: 'Premios', icon: <DescriptionIcon /> },
        { segment: 'nuevo-teatro', title: 'Teatro/Sala', icon: <DescriptionIcon /> },
      ],
    },
    { segment: 'logout', title: renderLogoutButton(), icon: null }, // Renderiza el botón aquí
  ];

  // Extraer el último segmento de la ruta
  const segments = router.pathname.split('/');
  const currentSegment = segments.length > 2 ? segments.pop() : 'cuenta';

  const demoWindow = window !== undefined ? window() : undefined;

  return (
    <AppProvider navigation={NAVIGATION} router={router} window={demoWindow}>
      <DashboardLayout disableNavigation disableCollapsibleSidebar sx={{ width: '100%', flexGrow: 1 }}>
        <DemoPageContent pathname={currentSegment} />
      </DashboardLayout>
    </AppProvider>
  );
}

Dashboard.propTypes = {
  window: PropTypes.func,
};

export default Dashboard;
