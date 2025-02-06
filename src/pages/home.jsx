import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const Home = () => {
    const [user, setUser] = useState(null);
    const auth = getAuth();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });

        return () => unsubscribe(); // Cleanup al desmontar
    }, []);

    return (
        <>
            <h2>Bienvenide a Ziater.com jejeje</h2>
            <NavLink to="/obra/1" style={{ marginRight: '10px', textDecoration: 'none', color: 'blue' }}>
                OBRA
            </NavLink>
            <NavLink to="/persona/1" style={{ marginRight: '10px', textDecoration: 'none', color: 'blue' }}>
                PERSONA
            </NavLink>

            {/* Solo mostrar LOGIN y REGISTRO si NO está logueado */}
            {!user && (
                <>
                    <NavLink to="/login" style={{ marginRight: '10px', textDecoration: 'none', color: 'blue' }}>
                        LOGIN
                    </NavLink>
                    <NavLink to="/signup" style={{ marginRight: '10px', textDecoration: 'none', color: 'blue' }}>
                        REGISTRO
                    </NavLink>
                </>
            )}

            {/* Solo mostrar DASHBOARD si está logueado */}
            {user && (
                <NavLink to="/dashboard" style={{ marginRight: '10px', textDecoration: 'none', color: 'blue' }}>
                    DASHBOARD
                </NavLink>
            )}
        </>
    );
};

export default Home;

