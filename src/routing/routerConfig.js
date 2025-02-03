import Home from "../pages/home";
import Persona from "../pages/persona"
import Obra2 from "../pages/Obra2";
import Login from "../pages/Login";
import Signup from "../pages/Signup";


export const routeConfig = [
  {
    name: "Root",
    path: "/",
    page: <Home />,
  },{
    name: "Obra",
    path: "/obra/:id",
    page: <Obra2 />,
  },{
    name: "Persona",
    path: "/persona/:id",
    page: <Persona />,
  },{
    name: "Login",
    path: "/login",
    page: <Login />,
  },{
    name: "Signup",
    path: "/Signup",
    page: <Signup />,
  }
 
];

