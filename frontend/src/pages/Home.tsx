import { Link } from 'react-router-dom';

function Home() {
    return (
        <div className="home">
            <h1>Registro de Productores Agrarios</h1>
            <p className="home-subtitle">
                Sistema de registro y consulta de productores, sus cultivos y grupo familiar.
            </p>

            <div className="home-cards">
                <Link to="/productores" className="home-card">
                    <h2>Productores</h2>
                    <p>Registrar, consultar, filtrar y administrar productores agrarios.</p>
                </Link>

                <Link to="/cultivos" className="home-card">
                    <h2>Cultivos</h2>
                    <p>Administrar el catálogo de cultivos disponibles.</p>
                </Link>

                <Link to="/estadisticas" className="home-card">
                    <h2>Estadísticas</h2>
                    <p>Reportes e indicadores sobre productores, cultivos y familiares.</p>
                </Link>
            </div>
        </div>
    );
}

export default Home;