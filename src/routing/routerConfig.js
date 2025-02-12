import Home from "../pages/home";
import Persona from "../pages/persona";
import Obra2 from "../pages/Obra2";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Dashboard from "../pages/dashboard";
import PrivateRoute from "../components/PrivateRoute";
import PublicRoute from "../components/PublicRoute";
import Compania from "../pages/Compania";

export const routeConfig = [
  { path: "/", page: <Home /> },
  { path: "/obra/:id", page: <Obra2 /> },
  { path: "/persona/:id", page: <Persona /> },
  { path: "/compania/:id", page: <Compania /> },


  // Solo si NO está logueado
  { path: "/login", page: <PublicRoute><Login /></PublicRoute> },
  { path: "/signup", page: <PublicRoute><Signup /></PublicRoute> },

  // Solo si ESTÁ logueado
  { path: "/dashboard", page: <PrivateRoute><Dashboard /></PrivateRoute> },
];
