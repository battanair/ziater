import Home from "../pages/home";
import Persona from "../pages/persona"
import Obra2 from "../pages/Obra2";


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
  }
 
];

