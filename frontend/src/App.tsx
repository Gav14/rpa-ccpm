import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import ListadoProductores from './pages/ListadoProductores';
import ListadoCultivos from './pages/ListadoCultivos';
import Estadisticas from './pages/Estadisticas';
import FormularioProductor from './pages/FormularioProductor';
import DetalleProductor from './pages/DetalleProductor';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<Layout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/productores" element={<ListadoProductores />} />
                    <Route path="/cultivos" element={<ListadoCultivos />} />
                    <Route path="/estadisticas" element={<Estadisticas />} />
                    <Route path="/productores/nuevo" element={<FormularioProductor />} />
                    <Route path="/productores/:id" element={<DetalleProductor />} />
                    <Route path="/productores/:id/editar" element={<FormularioProductor />} />
                    {/* Ruta comodín: cualquier URL desconocida redirige a Home */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;