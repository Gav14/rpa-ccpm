import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { productoresApi } from '../api';
import type { ProductorResponse, ApiError } from '../types';
import SubirFoto from '../components/SubirFoto'; 

function DetalleProductor() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [productor, setProductor] = useState<ProductorResponse | null>(null);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [eliminando, setEliminando] = useState(false);

    useEffect(() => {
        const cargar = async () => {
            try {
                setCargando(true);
                setError(null);
                const data = await productoresApi.buscarPorId(Number(id));
                setProductor(data);
            } catch (err) {
                const apiError = err as ApiError;
                setError(apiError.mensaje || 'Error al cargar el productor');
            } finally {
                setCargando(false);
            }
        };
        cargar();
    }, [id]);

    const handleEliminar = async () => {
        if (!productor) return;
        const confirmado = window.confirm(
            `¿Eliminar a ${productor.apellido}, ${productor.nombre}? Esta acción no se puede deshacer.`
        );
        if (!confirmado) return;

        try {
            setEliminando(true);
            await productoresApi.eliminar(productor.id);
            navigate('/productores');
        } catch (err) {
            const apiError = err as ApiError;
            setError(apiError.mensaje || 'Error al eliminar');
            setEliminando(false);
        }
    };

    // Función que se ejecuta cuando SubirFoto termina exitosamente
    const handleFotoSubida = (url: string) => {
        if (productor) {
            setProductor({ ...productor, fotoUrl: url });
        }
    };

    if (cargando) return <p className="estado-carga">Cargando productor...</p>;
    if (error) return <div className="estado-error"><p>{error}</p></div>;
    if (!productor) return null;

    const p = productor;

    return (
        <div className="page">
            <div className="page-header">
                <div>
                    <Link to="/productores" className="breadcrumb">← Volver al listado</Link>
                    <h1>{p.apellido}, {p.nombre}</h1>
                </div>
                <div className="page-actions">
                    <Link to={`/productores/${p.id}/editar`} className="btn">Editar</Link>
                    <button
                        className="btn btn-danger"
                        onClick={handleEliminar}
                        disabled={eliminando}
                    >
                        {eliminando ? 'Eliminando...' : 'Eliminar'}
                    </button>
                </div>
            </div>

            {/* Grid de 3 columnas (se adapta según el tamaño de pantalla) */}
            <div className="detalle-grid">

                {/* NUEVA COLUMNA: FOTO */}
                <section className="detalle-card">
                    <h2>Foto de perfil</h2>
                    <SubirFoto
                        productorId={p.id}
                        fotoActual={p.fotoUrl}
                        onFotoSubida={handleFotoSubida}
                    />
                </section>

                {/* COLUMNA 1: DATOS PERSONALES */}
                <section className="detalle-card">
                    <h2>Datos personales</h2>
                    <dl className="detalle-list">
                        <dt>DNI</dt><dd>{p.dni}</dd>
                        <dt>Sexo</dt><dd>{p.sexo}</dd>
                        <dt>Fecha de nacimiento</dt><dd>{p.fechaNacimiento}</dd>
                        <dt>Título máximo</dt><dd>{p.tituloMaximo || '—'}</dd>
                    </dl>
                </section>

                {/* COLUMNA 2: UBICACIÓN */}
                <section className="detalle-card">
                    <h2>Ubicación</h2>
                    <dl className="detalle-list">
                        <dt>Departamento</dt><dd>{p.departamento}</dd>
                        <dt>Municipio</dt><dd>{p.municipio}</dd>
                        <dt>Domicilio</dt><dd>{p.domicilio || '—'}</dd>
                    </dl>
                </section>
            </div>

            <section className="detalle-card">
                <h2>Cultivos ({p.cultivos.length})</h2>
                {p.cultivos.length === 0 ? (
                    <p className="estado-vacio">Sin cultivos registrados.</p>
                ) : (
                    <div className="tags">
                        {p.cultivos.map((c) => (
                            <span key={c} className="tag">{c}</span>
                        ))}
                    </div>
                )}
            </section>

            <section className="detalle-card">
                <h2>Grupo familiar ({p.familiares.length})</h2>
                {p.familiares.length === 0 ? (
                    <p className="estado-vacio">Sin familiares registrados.</p>
                ) : (
                    <div className="tabla-wrapper">
                        <table className="tabla">
                            <thead>
                            <tr>
                                <th>Apellido</th>
                                <th>Nombre</th>
                                <th>Parentesco</th>
                                <th>Sexo</th>
                                <th>DNI</th>
                                <th>Fecha nac.</th>
                            </tr>
                            </thead>
                            <tbody>
                            {p.familiares.map((f) => (
                                <tr key={f.id}>
                                    <td>{f.apellido}</td>
                                    <td>{f.nombre}</td>
                                    <td>{f.parentesco}</td>
                                    <td>{f.sexo}</td>
                                    <td>{f.dni || '—'}</td>
                                    <td>{f.fechaNacimiento || '—'}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </div>
    );
}

export default DetalleProductor;