import Home from "../pages/home";
import Persona from "../pages/persona";
import Obra2 from "../pages/Obra2";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Dashboard from "../pages/dashboard";
import PrivateRoute from "../components/PrivateRoute";
import PublicRoute from "../components/PublicRoute";
import Compania from "../pages/Compania";
import Criticas from "../pages/Criticas";
import UserProfile from "../pages/UserProfile";
import Todoelequipo from "../pages/Todoelequipo";
import Premios from "../pages/Premios";

export const routeConfig = [
  { path: "/", page: <Home /> },
  { path: "/obra/:id", page: <Obra2 /> },
  { path: "/persona/:id", page: <Persona /> },
  { path: "/compania/:id", page: <Compania /> },
  { path: "/criticas/:id_obra", page: <Criticas /> },
  { path: "/UserProfile", page: <UserProfile /> },
  { path: "/Todoelequipo/:id_obra", page: <Todoelequipo /> },
  { path: "/Premios/:id", page: <Premios /> },




  // Solo si NO está logueado
  { path: "/login", page: <PublicRoute><Login /></PublicRoute> },
  { path: "/signup", page: <PublicRoute><Signup /></PublicRoute> },

  // Solo si ESTÁ logueado
  { path: "/dashboard", page: <PrivateRoute><Dashboard /></PrivateRoute> },
];
