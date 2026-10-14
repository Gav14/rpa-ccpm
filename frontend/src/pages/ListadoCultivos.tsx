import { useEffect, useState } from 'react';
import { cultivosApi } from '../api';
import type { CultivoResponse, ApiError } from '../types';

function ListadoCultivos() {
    const [cultivos, setCultivos] = useState<CultivoResponse[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Formulario de alta inline
    const [nuevoNombre, setNuevoNombre] = useState('');
    const [creando, setCreando] = useState(false);
    const [errorCrear, setErrorCrear] = useState<string | null>(null);

    const cargar = async () => {
        try {
            setCargando(true);
            setError(null);
            const data = await cultivosApi.listar();
            setCultivos(data);
        } catch (err) {
            const apiError = err as ApiError;
            setError(apiError.mensaje || 'Error al cargar los cultivos');
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        cargar();
    }, []);

    const handleCrear = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorCrear(null);

        const nombre = nuevoNombre.trim();
        if (!nombre) {
            setErrorCrear('El nombre es obligatorio');
            return;
        }

        try {
            setCreando(true);
            const creado = await cultivosApi.crear({ nombre });
            // Agregamos el nuevo a la lista local (actualización optimista)
            setCultivos((prev) => [...prev, creado].sort((a, b) =>
                a.nombre.localeCompare(b.nombre)
            ));
            setNuevoNombre('');
        } catch (err) {
            const apiError = err as ApiError;
            setErrorCrear(apiError.mensaje || 'Error al crear el cultivo');
        } finally {
            setCreando(false);
        }
    };

    const handleEliminar = async (c: CultivoResponse) => {
        const confirmado = window.confirm(
            `¿Eliminar el cultivo "${c.nombre}"? Esta acción no se puede deshacer.`
        );
        if (!confirmado) return;

        try {
            await cultivosApi.eliminar(c.id);
            setCultivos((prev) => prev.filter((x) => x.id !== c.id));
        } catch (err) {
            const apiError = err as ApiError;
            alert(apiError.mensaje || 'Error al eliminar');
        }
    };

    if (cargando) return <p className="estado-carga">Cargando cultivos...</p>;

    if (error) {
        return (
            <div className="estado-error">
                <p>{error}</p>
                <button onClick={cargar}>Reintentar</button>
            </div>
        );
    }

    return (
        <div className="page">
            <div className="page-header">
                <h1>Cultivos</h1>
            </div>

            {/* Formulario de alta inline */}
            <form onSubmit={handleCrear} className="form-inline">
                <input
                    type="text"
                    placeholder="Nombre del nuevo cultivo"
                    value={nuevoNombre}
                    onChange={(e) => {
                        setNuevoNombre(e.target.value);
                        if (errorCrear) setErrorCrear(null);
                    }}
                    disabled={creando}
                />
                <button type="submit" className="btn btn-primary" disabled={creando}>
                    {creando ? 'Creando...' : '+ Agregar'}
                </button>
            </form>

            {errorCrear && <p className="error-msg form-inline-error">{errorCrear}</p>}

            {cultivos.length === 0 ? (
                <p className="estado-vacio">
                    No hay cultivos cargados. Agregá el primero arriba.
                </p>
            ) : (
                <div className="tabla-wrapper">
                <table className="tabla">
                    <thead>
                    <tr>
                        <th style={{ width: '80px' }}>ID</th>
                        <th>Nombre</th>
                        <th style={{ width: '120px' }}>Acciones</th>
                    </tr>
                    </thead>
                    <tbody>
                    {cultivos.map((c) => (
                        <tr key={c.id}>
                            <td>{c.id}</td>
                            <td>{c.nombre}</td>
                            <td>
                                <button
                                    className="link-danger"
                                    onClick={() => handleEliminar(c)}
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
        </div>
    );
}

export default ListadoCultivos;