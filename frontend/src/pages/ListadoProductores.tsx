import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { productoresApi, cultivosApi } from '../api';
import { useDebounce } from '../hooks/useDebounce';
import type {
    ProductorResponse,
    ProductorFiltros,
    CultivoResponse,
    Sexo,
    ApiError,
} from '../types';

const SEXOS: Sexo[] = ['MASCULINO', 'FEMENINO', 'OTRO'];

const filtrosVacios: ProductorFiltros = {
    apellido: '',
    nombre: '',
    dni: '',
    sexo: undefined,
    departamento: '',
    municipio: '',
    cultivo: '',
};

function ListadoProductores() {
    const [productores, setProductores] = useState<ProductorResponse[]>([]);
    const [cultivos, setCultivos] = useState<CultivoResponse[]>([]);
    const [filtros, setFiltros] = useState<ProductorFiltros>(filtrosVacios);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Debounce solo del objeto de filtros para no disparar una petición por tecla
    const filtrosDebounced = useDebounce(filtros, 400);

    // Cargar catálogo de cultivos una sola vez (para el select)
    useEffect(() => {
        cultivosApi.listar().then(setCultivos).catch(() => { /* silencioso */ });
    }, []);

    // Recargar la lista cada vez que cambian los filtros debounced
    useEffect(() => {
        const cargar = async () => {
            try {
                setCargando(true);
                setError(null);
                // Limpiamos strings vacíos para no mandarlos al backend
                const filtrosLimpios: ProductorFiltros = {};
                (Object.keys(filtrosDebounced) as (keyof ProductorFiltros)[]).forEach((k) => {
                    const v = filtrosDebounced[k];
                    if (v !== undefined && v !== '' && v !== null) {
                        (filtrosLimpios as Record<string, unknown>)[k] = v;
                    }
                });
                const data = await productoresApi.listar(filtrosLimpios);
                setProductores(data);
            } catch (err) {
                const apiError = err as ApiError;
                setError(apiError.mensaje || 'Error al cargar los productores');
            } finally {
                setCargando(false);
            }
        };
        cargar();
    }, [filtrosDebounced]);

    const handleFiltro = (campo: keyof ProductorFiltros, valor: string) => {
        setFiltros((prev) => ({
            ...prev,
            [campo]: valor === '' ? undefined : valor,
        }));
    };

    const limpiarFiltros = () => setFiltros(filtrosVacios);

    const hayFiltrosActivos = Object.values(filtros).some(
        (v) => v !== undefined && v !== ''
    );

    const handleEliminar = async (p: ProductorResponse) => {
        const confirmado = window.confirm(
            `¿Eliminar a ${p.apellido}, ${p.nombre}? Esta acción no se puede deshacer.`
        );
        if (!confirmado) return;
        try {
            await productoresApi.eliminar(p.id);
            setProductores((prev) => prev.filter((x) => x.id !== p.id));
        } catch (err) {
            const apiError = err as ApiError;
            alert(apiError.mensaje || 'Error al eliminar');
        }
    };

    return (
        <div className="page">
            <div className="page-header">
                <h1>Productores</h1>
                <Link to="/productores/nuevo" className="btn btn-primary">
                    + Nuevo productor
                </Link>
            </div>

            {/* ===== Panel de filtros ===== */}
            <section className="filtros-panel">
                <div className="filtros-header">
                    <h2>Filtros</h2>
                    {hayFiltrosActivos && (
                        <button className="btn-limpiar" onClick={limpiarFiltros}>
                            Limpiar filtros
                        </button>
                    )}
                </div>
                <div className="filtros-grid">
                    <div className="form-field">
                        <label>Apellido</label>
                        <input
                            type="text"
                            value={filtros.apellido || ''}
                            onChange={(e) => handleFiltro('apellido', e.target.value)}
                            placeholder="Buscar por apellido"
                        />
                    </div>
                    <div className="form-field">
                        <label>Nombre</label>
                        <input
                            type="text"
                            value={filtros.nombre || ''}
                            onChange={(e) => handleFiltro('nombre', e.target.value)}
                            placeholder="Buscar por nombre"
                        />
                    </div>
                    <div className="form-field">
                        <label>DNI</label>
                        <input
                            type="text"
                            value={filtros.dni || ''}
                            onChange={(e) => handleFiltro('dni', e.target.value)}
                            placeholder="Buscar por DNI"
                        />
                    </div>
                    <div className="form-field">
                        <label>Sexo</label>
                        <select
                            value={filtros.sexo || ''}
                            onChange={(e) => handleFiltro('sexo', e.target.value)}
                        >
                            <option value="">Todos</option>
                            {SEXOS.map((s) => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-field">
                        <label>Departamento</label>
                        <input
                            type="text"
                            value={filtros.departamento || ''}
                            onChange={(e) => handleFiltro('departamento', e.target.value)}
                            placeholder="Ej: Río Cuarto"
                        />
                    </div>
                    <div className="form-field">
                        <label>Municipio</label>
                        <input
                            type="text"
                            value={filtros.municipio || ''}
                            onChange={(e) => handleFiltro('municipio', e.target.value)}
                            placeholder="Ej: Río Cuarto"
                        />
                    </div>
                    <div className="form-field">
                        <label>Cultivo</label>
                        <select
                            value={filtros.cultivo || ''}
                            onChange={(e) => handleFiltro('cultivo', e.target.value)}
                        >
                            <option value="">Todos</option>
                            {cultivos.map((c) => (
                                <option key={c.id} value={c.nombre}>{c.nombre}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </section>

            {/* ===== Resultados ===== */}
            {cargando ? (
                <p className="estado-carga">Cargando productores...</p>
            ) : error ? (
                <div className="estado-error"><p>{error}</p></div>
            ) : (
                <>
                    <p className="resultado-count">
                        {productores.length}{' '}
                        {productores.length === 1 ? 'productor encontrado' : 'productores encontrados'}
                    </p>

                    {productores.length === 0 ? (
                        <p className="estado-vacio">
                            {hayFiltrosActivos
                                ? 'No hay productores que coincidan con los filtros.'
                                : 'No hay productores registrados todavía.'}
                        </p>
                    ) : (
                        <div className="tabla-wrapper">
                            <table className="tabla">
                            <thead>
                            <tr>
                                <th>Apellido</th>
                                <th>Nombre</th>
                                <th>DNI</th>
                                <th>Sexo</th>
                                <th>Municipio</th>
                                <th>Cultivos</th>
                                <th>Acciones</th>
                            </tr>
                            </thead>
                            <tbody>
                            {productores.map((p) => (
                                <tr key={p.id}>
                                    <td>{p.apellido}</td>
                                    <td>{p.nombre}</td>
                                    <td>{p.dni}</td>
                                    <td>{p.sexo}</td>
                                    <td>{p.municipio}</td>
                                    <td>{p.cultivos.join(', ') || '—'}</td>
                                    <td className="acciones-cell">
                                        <Link to={`/productores/${p.id}`}>Ver</Link>
                                        <Link to={`/productores/${p.id}/editar`}>Editar</Link>
                                        <button
                                            className="link-danger"
                                            onClick={() => handleEliminar(p)}
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                            </table>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default ListadoProductores;