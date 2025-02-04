import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import DashboardIcon from '@mui/icons-material/Dashboard';
import FavoriteIcon from '@mui/icons-material/Favorite';
import BarChartIcon from '@mui/icons-material/BarChart';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { useDemoRouter } from '@toolpad/core/internal';
import DescriptionIcon from '@mui/icons-material/Description';
import ControlPointIcon from '@mui/icons-material/ControlPoint';

const NAVIGATION = [
  {
    segment: 'cuenta',
    title: 'Tu Cuenta',
    icon: <DashboardIcon />,
  },
  {
    segment: 'favorites',
    title: 'Favoritos',
    icon: <FavoriteIcon />,
  },
  {
    segment: 'reports',
    title: 'Reports',
    icon: <BarChartIcon />,
  },
    {
      segment: 'addnadir',
      title: 'Añadir',
      icon: <ControlPointIcon />,
      children: [
        {
          segment: 'nueva-obra',
          title: 'Obra',
          icon: <DescriptionIcon />,
        },
        {
          segment: 'nueva-persona',
          title: 'Persona',
          icon: <DescriptionIcon />,
        },{
            segment: 'nueva-company',
            title: 'Compañía',
            icon: <DescriptionIcon />,
          },
      ],
    }
];
  



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
      <Typography>Dashboard content for {pathname}</Typography>
    </Box>
  );
}

DemoPageContent.propTypes = {
  pathname: PropTypes.string.isRequired,
};

function Dashboard(props) {
  const { window } = props;

  const router = useDemoRouter('/dashboard');

  // Remove this const when copying and pasting into your project.
  const demoWindow = window !== undefined ? window() : undefined;

  return (
    <AppProvider
      navigation={NAVIGATION}
      router={router}
      window={demoWindow}
    >
      <DashboardLayout disableNavigation disableCollapsibleSidebar sx={{ width: '100%', flexGrow: 1 }}>
        <DemoPageContent pathname={router.pathname} />
      </DashboardLayout>
    </AppProvider>
  );
}

Dashboard.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * Remove this when copying and pasting into your project.
   */
  window: PropTypes.func,
};

export default Dashboard;
