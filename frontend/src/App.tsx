import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Home from './pages/Home';
import ListadoProductores from './pages/ListadoProductores';
import FormularioProductor from './pages/FormularioProductor';
import DetalleProductor from './pages/DetalleProductor';
import ListadoCultivos from './pages/ListadoCultivos';
import Estadisticas from './pages/Estadisticas';
import Login from './pages/Login';

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    {/* Ruta pública: Login */}
                    <Route path="/login" element={<Login />} />

                    {/* Rutas protegidas: solo si hay sesión */}
                    <Route element={<ProtectedRoute />}>
                        <Route element={<Layout />}>
                            <Route path="/" element={<Home />} />
                            <Route path="/productores" element={<ListadoProductores />} />
                            <Route path="/productores/nuevo" element={<FormularioProductor />} />
                            <Route path="/productores/:id" element={<DetalleProductor />} />
                            <Route path="/productores/:id/editar" element={<FormularioProductor />} />
                            <Route path="/cultivos" element={<ListadoCultivos />} />
                            <Route path="/estadisticas" element={<Estadisticas />} />
                        </Route>
                    </Route>

                    {/* Catch-all: redirige a Home (que a su vez pedirá login si no hay sesión) */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;