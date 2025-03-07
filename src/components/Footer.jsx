import React from 'react';
import { NavLink } from 'react-router-dom';
import InstagramIcon from '@mui/icons-material/Instagram';

const Footer = () => {
  return (
    <footer style={{ backgroundColor: 'black', padding: '20px', textAlign: 'center' }}>
      <NavLink to="/politica-de-cookies" style={{ color: 'white', margin: '0 10px', textDecoration: 'none' }}>
        Política de Cookies
      </NavLink>
      <a href="https://www.instagram.com/ziater_/" style={{ color: 'white', margin: '0 10px', textDecoration: 'none', fontSize: '24px' }} target="_blank" rel="noopener noreferrer">
        <InstagramIcon />
      </a>
    </footer>
  );
};

export default Footer;