import { useEffect, useState } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend,
} from 'recharts';
import { estadisticasApi } from '../api';
import type { Estadisticas, ApiError } from '../types';

const COLORES_TORTA = ['#2563eb', '#ec4899', '#8b5cf6', '#f59e0b', '#10b981'];
const COLORES_BARRAS = ['#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe'];

// Convierte { "Soja": 6, "Maíz": 4 } en [{ name: "Soja", value: 6 }, ...]
function recordAArray(record: Record<string, number>): { name: string; value: number }[] {
    return Object.entries(record)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value);
}

function EstadisticasPage() {
    const [stats, setStats] = useState<Estadisticas | null>(null);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const cargar = async () => {
            try {
                setCargando(true);
                setError(null);
                const data = await estadisticasApi.obtener();
                setStats(data);
            } catch (err) {
                const apiError = err as ApiError;
                setError(apiError.mensaje || 'Error al cargar las estadísticas');
            } finally {
                setCargando(false);
            }
        };
        cargar();
    }, []);

    if (cargando) return <p className="estado-carga">Cargando estadísticas...</p>;

    if (error) {
        return (
            <div className="estado-error">
                <p>{error}</p>
                <button onClick={() => window.location.reload()}>Reintentar</button>
            </div>
        );
    }

    if (!stats) return null;

    // Si no hay datos cargados, mostramos un aviso amigable
    if (stats.totalProductores === 0) {
        return (
            <div className="page">
                <h1>Estadísticas</h1>
                <p className="estado-vacio">
                    No hay datos para mostrar todavía. Cargá algunos productores primero.
                </p>
            </div>
        );
    }

    const datosSexo = recordAArray(stats.porSexo);
    const datosDepartamento = recordAArray(stats.porDepartamento);
    const datosCultivo = recordAArray(stats.porCultivo);
    const datosParentesco = recordAArray(stats.porParentesco);

    return (
        <div className="page">
            <h1>Estadísticas</h1>

            {/* ===== Tarjetas de totales ===== */}
            <div className="stats-cards">
                <div className="stat-card">
                    <span className="stat-value">{stats.totalProductores}</span>
                    <span className="stat-label">Productores</span>
                </div>
                <div className="stat-card">
                    <span className="stat-value">{stats.totalCultivos}</span>
                    <span className="stat-label">Cultivos</span>
                </div>
                <div className="stat-card">
                    <span className="stat-value">{stats.totalFamiliares}</span>
                    <span className="stat-label">Familiares</span>
                </div>
                <div className="stat-card">
          <span className="stat-value">
            {stats.promedioFamiliaresPorProductor != null
                ? stats.promedioFamiliaresPorProductor.toFixed(2)
                : '—'}
          </span>
                    <span className="stat-label">Fam. / productor</span>
                </div>
            </div>

            {/* ===== Gráfico de torta: distribución por sexo ===== */}
            <section className="grafico-card">
                <h2>Distribución por sexo</h2>
                <div className="grafico-container">
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={datosSexo}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                label={(entry) => `${entry.name}: ${entry.value}`}
                            >
                                {datosSexo.map((_, i) => (
                                    <Cell key={i} fill={COLORES_TORTA[i % COLORES_TORTA.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </section>

            {/* ===== Gráfico de barras: productores por departamento ===== */}
            <section className="grafico-card">
                <h2>Productores por departamento</h2>
                <div className="grafico-container">
                    <ResponsiveContainer width="100%" height={320}>
                        <BarChart data={datosDepartamento}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" angle={-15} textAnchor="end" height={70} />
                            <YAxis allowDecimals={false} />
                            <Tooltip />
                            <Bar dataKey="value" name="Productores" fill="#2563eb" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </section>

            {/* ===== Gráfico de barras: productores por cultivo ===== */}
            <section className="grafico-card">
                <h2>Productores por cultivo</h2>
                <div className="grafico-container">
                    <ResponsiveContainer width="100%" height={320}>
                        <BarChart data={datosCultivo} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" allowDecimals={false} />
                            <YAxis type="category" dataKey="name" width={100} />
                            <Tooltip />
                            <Bar dataKey="value" name="Productores" fill="#10b981" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </section>

            {/* ===== Gráfico de barras: familiares por parentesco ===== */}
            <section className="grafico-card">
                <h2>Familiares por parentesco</h2>
                <div className="grafico-container">
                    <ResponsiveContainer width="100%" height={320}>
                        <BarChart data={datosParentesco}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" angle={-15} textAnchor="end" height={70} />
                            <YAxis allowDecimals={false} />
                            <Tooltip />
                            <Bar dataKey="value" name="Familiares" fill="#8b5cf6" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </section>
        </div>
    );
}

export default EstadisticasPage;