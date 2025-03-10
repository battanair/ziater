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
import Teatro from "../pages/teatro";
import Edit from "../components/Editiar";
import NewAwardProfile from "../components/NewAwardProfile";
import NewCompanyProfile from "../components/NewCompanyProfile";
import NewPlayProfile from "../components/NewPlayProfile";
import NewTeatroProfile from "../components/NewTeatroProfile";
import NewEditUser from "../components/NewEditUser";
import NewEditUser2 from "../components/NewEditUser2";
import NewEditUser3 from "../components/NewEditUser3";
import EditarPremios from "../components/editarpremios";
import EditarPremio2 from "../components/editarpremio2";
import EditPlay from "../components/EditPlay";
import EditPlayWork from "../components/EditPlayWork";
import EditPlayWork2 from "../components/EditPlayWork2";
import EditPlayAwards from "../components/EditPlayAwards";
import EditPlayAwards2 from "../components/EditPlayAwards2";
import PoliticaCookies from "../pages/politica-de-cookies";
import PrivacyPolicy from "../pages/PrivacyPolicy";

export const routeConfig = [
  { path: "/", page: <Home /> },
  { path: "/obra/:id", page: <Obra2 /> },
  { path: "/persona/:id", page: <Persona /> },
  { path: "/compania/:id", page: <Compania /> },
  { path: "/criticas/:id_obra", page: <Criticas /> },
  { path: "/UserProfile", page: <UserProfile /> },
  { path: "/Todoelequipo/:id_obra", page: <Todoelequipo /> },
  { path: "/Premios/:id", page: <Premios /> },
  { path: "/teatro/:id", page: <Teatro /> },
  { path: "/politica-de-cookies", page: <PoliticaCookies /> },
  { path: "/politica-de-privacidad", page: <PrivacyPolicy /> },

  // Solo si NO está logueado
  { path: "/login", page: <PublicRoute><Login /></PublicRoute> },
  { path: "/signup", page: <PublicRoute><Signup /></PublicRoute> },

  // Solo si ESTÁ logueado
  { path: "/dashboard", page: <PrivateRoute><Dashboard /></PrivateRoute> },
  { path: "/edit", page: <PrivateRoute><Edit /></PrivateRoute> },
  { path: "/edit-award/:id", page: <PrivateRoute><NewAwardProfile /></PrivateRoute> },
  { path: "/edit-company/:id", page: <PrivateRoute><NewCompanyProfile /></PrivateRoute> },
  { path: "/edit-play/:id", page: <PrivateRoute><EditPlay /></PrivateRoute> },
  { path: "/edit-sala/:id", page: <PrivateRoute><NewTeatroProfile /></PrivateRoute> },
  { path: "/edit-persona/:id", page: <PrivateRoute><NewEditUser /></PrivateRoute> },
  { path: "/newedituser2/:id", page: <PrivateRoute><NewEditUser2 /></PrivateRoute> },
  { path: "/edit-user3/:id", page: <PrivateRoute><NewEditUser3 /></PrivateRoute> },
  { path: "/edit-user3/", page: <PrivateRoute><NewEditUser3 /></PrivateRoute> },
  { path: "/editarpremios/:id", page: <PrivateRoute><EditarPremios /></PrivateRoute> },
  { path: "/editarpremio2/:id", page: <PrivateRoute><EditarPremio2 /></PrivateRoute> },
  { path: "/editarpremio2", page: <PrivateRoute><EditarPremio2 /></PrivateRoute> },
  { path: "/editplaywork/:id", page: <PrivateRoute><EditPlayWork /></PrivateRoute> },
  { path: "/editplaywork2/:id", page: <PrivateRoute><EditPlayWork2 /></PrivateRoute> },
  { path: "/editplaywork2/", page: <PrivateRoute><EditPlayWork2 /></PrivateRoute> },
  { path: "/editplayawards/:id", page: <PrivateRoute><EditPlayAwards /></PrivateRoute> },
  { path: "/editplayawards2/:id", page: <PrivateRoute><EditPlayAwards2 /></PrivateRoute> },
  { path: "/editplayawards2/", page: <PrivateRoute><EditPlayAwards2 /></PrivateRoute> },
];
