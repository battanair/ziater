import { NavLink } from "react-router";

const Home = () => {
    return (
        <>
            <h2>Bienvenide a Ziater.com jejeje</h2>
            <NavLink to="/obra/1" style={{ marginRight: '10px', textDecoration: 'none', color: 'blue' }}>
                OBRA
            </NavLink>
            <NavLink to="/persona/1" style={{marginRight: '10px', textDecoration: 'none', color: 'blue' }}>
                PERSONA
            </NavLink>
            <NavLink to="/login" style={{ marginRight: '10px', textDecoration: 'none', color: 'blue' }}>
                LOGIN 
            </NavLink>
            <NavLink to="/Signup" style={{ marginRight: '10px', textDecoration: 'none', color: 'blue' }}>
                REGISTRO
            </NavLink>
        </>
    );
}

export default Home;
