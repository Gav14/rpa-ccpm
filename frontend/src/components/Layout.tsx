import { Outlet, NavLink } from 'react-router-dom';

function Layout() {
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