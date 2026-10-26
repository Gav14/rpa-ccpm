import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute() {
    const { usuario, cargando } = useAuth();

    if (cargando) {
        return <p className="estado-carga">Verificando sesión...</p>;
    }

    if (!usuario) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}

export default ProtectedRoute;