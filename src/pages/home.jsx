import { NavLink } from "react-router";

const Home = () => {
    return (
        <>
            <h2>Bienvenide a Ziater.com jejeje</h2>
            <NavLink to="/obra/1" style={{ marginRight: '10px', textDecoration: 'none', color: 'blue' }}>
                OBRA
            </NavLink>
            <NavLink to="/persona/1" style={{ textDecoration: 'none', color: 'blue' }}>
                PERSONA
            </NavLink>
        </>
    );
}

export default Home;
