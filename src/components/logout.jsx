import { getAuth, signOut } from "firebase/auth";

const handleLogout = () => {
  const auth = getAuth();

  signOut(auth)
    .then(() => {
      localStorage.removeItem("token"); // Elimina el token guardado
      window.location.href = "/login"; // Redirige al login
    })
    .catch((error) => {
      console.error("Error al cerrar sesión", error);
    });
};

export default handleLogout;