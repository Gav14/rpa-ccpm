import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Layout() {
    const { usuario, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="app-layout">
            <header className="navbar">
                <div className="navbar-brand">
                    <span className="navbar-logo">🌱</span>
                    <span className="navbar-title">RPA</span>
                </div>

                <nav className="navbar-nav">
                    <NavLink to="/" end>Inicio</NavLink>
                    <NavLink to="/productores">Productores</NavLink>
                    <NavLink to="/cultivos">Cultivos</NavLink>
                    <NavLink to="/estadisticas">Estadísticas</NavLink>
                </nav>

                <div className="navbar-user">
                    <span className="navbar-user-name">{usuario?.nombre}</span>
                    <button className="btn-logout" onClick={handleLogout}>
                        Cerrar sesión
                    </button>
                </div>
            </header>

            <main className="container">
                <Outlet />
            </main>

            <footer className="footer">
                <p>Registro de Productores Agrarios — Trabajo Práctico</p>
            </footer>
        </div>
    );
}

export default Layout;