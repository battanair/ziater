import { Navigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";

const PublicRoute = ({ children }) => {
    const { user } = useAuth();
    return user ? <Navigate to="/dashboard" /> : children;
};

export default PublicRoute;
