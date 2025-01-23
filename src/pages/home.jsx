import { NavLink } from "react-router";

const Home = () => {
    return (
        <>
            <p>Bienvenide a Ziater.com jejeje</p>
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
