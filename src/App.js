import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { Routes, Route } from "react-router";
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Navbar from './components/Navbar';
import { routeConfig } from "./routing/routerConfig";




const App = () => (
  <div className="app">
   
    
    <Box sx={{background: 'lightgrey'}}>
    <Navbar />
     <Container maxWidth="md" sx={{background: 'white', marginTop: '50px', boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', paddingLeft: 3, paddingRight:3 }}>
    
     <Routes>
        {routeConfig.map((item) => {
          return (
            <>
              <Route path={item.path} element={item.page} />
            </>
          );
        })}
      </Routes>
      </Container>
      </Box>
  </div>
);

export default App;
