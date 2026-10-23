import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { productoresApi, cultivosApi } from '../api';
import type {
    ProductorRequest,
    CultivoResponse,
    FamiliarRequest,
    Sexo,
    Parentesco,
    ApiError,
} from '../types';

const SEXOS: Sexo[] = ['MASCULINO', 'FEMENINO', 'OTRO'];
const PARENTESCOS: Parentesco[] = [
    'HIJO', 'HIJA', 'CONYUGE', 'PADRE', 'MADRE',
    'TIO', 'TIA', 'ABUELO', 'ABUELA',
    'HERMANO', 'HERMANA', 'OTRO',
];

// Type local: familiar + una key para React
type FamiliarForm = FamiliarRequest & { _key: string };

const familiarVacio = (): FamiliarForm => ({
    _key: crypto.randomUUID(),
    apellido: '',
    nombre: '',
    sexo: 'MASCULINO',
    dni: '',
    fechaNacimiento: '',
    parentesco: 'HIJO',
});

const estadoInicial = {
    apellido: '',
    nombre: '',
    dni: '',
    sexo: 'MASCULINO' as Sexo,
    tituloMaximo: '',
    fechaNacimiento: '',
    departamento: '',
    municipio: '',
    domicilio: '',
    cultivoIds: [] as number[],
};

function FormularioProductor() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const esEdicion = Boolean(id);

    const [form, setForm] = useState(estadoInicial);
    const [familiares, setFamiliares] = useState<FamiliarForm[]>([]);
    const [cultivosDisponibles, setCultivosDisponibles] = useState<CultivoResponse[]>([]);
    const [cargando, setCargando] = useState(true);
    const [guardando, setGuardando] = useState(false);
    const [errores, setErrores] = useState<Record<string, string>>({});
    const [errorGeneral, setErrorGeneral] = useState<string | null>(null);

    useEffect(() => {
        const cargar = async () => {
            try {
                setCargando(true);
                setErrorGeneral(null);

                const cultivos = await cultivosApi.listar();
                setCultivosDisponibles(cultivos);

                if (esEdicion && id) {
                    const p = await productoresApi.buscarPorId(Number(id));

                    const cultivoIds = p.cultivos
                        .map((nombre) => cultivos.find((c) => c.nombre === nombre)?.id)
                        .filter((cid): cid is number => cid !== undefined);

                    setForm({
                        apellido: p.apellido,
                        nombre: p.nombre,
                        dni: p.dni,
                        sexo: p.sexo,
                        tituloMaximo: p.tituloMaximo || '',
                        fechaNacimiento: p.fechaNacimiento,
                        departamento: p.departamento,
                        municipio: p.municipio,
                        domicilio: p.domicilio || '',
                        cultivoIds,
                    });

                    setFamiliares(
                        p.familiares.map((f) => ({
                            _key: crypto.randomUUID(),
                            apellido: f.apellido,
                            nombre: f.nombre,
                            sexo: f.sexo,
                            dni: f.dni || '',
                            fechaNacimiento: f.fechaNacimiento || '',
                            parentesco: f.parentesco,
                        }))
                    );
                }
            } catch (err) {
                const apiError = err as ApiError;
                setErrorGeneral(
                    apiError.mensaje || 'Error al cargar los datos. ¿Está el backend corriendo?'
                );
            } finally {
                setCargando(false);
            }
        };

        cargar();
    }, [id, esEdicion]);

    const handleChange = <K extends keyof typeof form>(
        campo: K,
        valor: (typeof form)[K]
    ) => {
        setForm((prev) => ({ ...prev, [campo]: valor }));
        if (errores[campo as string]) {
            setErrores((prev) => {
                const copia = { ...prev };
                delete copia[campo as string];
                return copia;
            });
        }
    };

    const toggleCultivo = (cultivoId: number) => {
        setForm((prev) => {
            const yaEsta = prev.cultivoIds.includes(cultivoId);
            return {
                ...prev,
                cultivoIds: yaEsta
                    ? prev.cultivoIds.filter((cid) => cid !== cultivoId)
                    : [...prev.cultivoIds, cultivoId],
            };
        });
        if (errores.cultivoIds) {
            setErrores((prev) => {
                const copia = { ...prev };
                delete copia.cultivoIds;
                return copia;
            });
        }
    };

    // ---------- Familiares ----------

    const agregarFamiliar = () => {
        setFamiliares((prev) => [...prev, familiarVacio()]);
    };

    const eliminarFamiliar = (key: string) => {
        setFamiliares((prev) => prev.filter((f) => f._key !== key));
    };

    const actualizarFamiliar = <K extends keyof FamiliarRequest>(
        key: string,
        campo: K,
        valor: FamiliarRequest[K]
    ) => {
        setFamiliares((prev) =>
            prev.map((f) => (f._key === key ? { ...f, [campo]: valor } : f))
        );
    };

    // ---------- Submit ----------

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setGuardando(true);
        setErrores({});
        setErrorGeneral(null);

        // Armamos el payload quitando la _key interna
        const payload: ProductorRequest = {
            ...form,
            familiares: familiares.map(({ _key, ...rest }) => rest),
        };

        try {
            if (esEdicion && id) {
                await productoresApi.actualizar(Number(id), payload);
            } else {
                await productoresApi.crear(payload);
            }
            navigate('/productores');
        } catch (err) {
            const apiError = err as ApiError;
            if (apiError.errores) {
                setErrores(apiError.errores);
            } else {
                setErrorGeneral(apiError.mensaje || apiError.error || 'Error al guardar');
            }
        } finally {
            setGuardando(false);
        }
    };

    if (cargando) return <p className="estado-carga">Cargando...</p>;

    return (
        <div className="page">
            <div className="page-header">
                <h1>{esEdicion ? 'Editar productor' : 'Nuevo productor'}</h1>
                <Link to="/productores" className="btn">Cancelar</Link>
            </div>

            {errorGeneral && (
                <div className="estado-error">
                    <p>{errorGeneral}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="formulario">
                <div className="form-grid">
                    <div className="form-field">
                        <label>Apellido *</label>
                        <input type="text" value={form.apellido}
                               onChange={(e) => handleChange('apellido', e.target.value)}
                               className={errores.apellido ? 'input-error' : ''} />
                        {errores.apellido && <span className="error-msg">{errores.apellido}</span>}
                    </div>

                    <div className="form-field">
                        <label>Nombre *</label>
                        <input type="text" value={form.nombre}
                               onChange={(e) => handleChange('nombre', e.target.value)}
                               className={errores.nombre ? 'input-error' : ''} />
                        {errores.nombre && <span className="error-msg">{errores.nombre}</span>}
                    </div>

                    <div className="form-field">
                        <label>DNI *</label>
                        <input type="text" value={form.dni}
                               onChange={(e) => handleChange('dni', e.target.value)}
                               className={errores.dni ? 'input-error' : ''} />
                        {errores.dni && <span className="error-msg">{errores.dni}</span>}
                    </div>

                    <div className="form-field">
                        <label>Sexo *</label>
                        <select value={form.sexo}
                                onChange={(e) => handleChange('sexo', e.target.value as Sexo)}>
                            {SEXOS.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>

                    <div className="form-field">
                        <label>Título máximo</label>
                        <input type="text" value={form.tituloMaximo || ''}
                               onChange={(e) => handleChange('tituloMaximo', e.target.value)} />
                    </div>

                    <div className="form-field">
                        <label>Fecha de nacimiento *</label>
                        <input type="date" value={form.fechaNacimiento}
                               onChange={(e) => handleChange('fechaNacimiento', e.target.value)}
                               className={errores.fechaNacimiento ? 'input-error' : ''} />
                        {errores.fechaNacimiento && (
                            <span className="error-msg">{errores.fechaNacimiento}</span>
                        )}
                    </div>

                    <div className="form-field">
                        <label>Departamento *</label>
                        <input type="text" value={form.departamento}
                               onChange={(e) => handleChange('departamento', e.target.value)}
                               className={errores.departamento ? 'input-error' : ''} />
                        {errores.departamento && (
                            <span className="error-msg">{errores.departamento}</span>
                        )}
                    </div>

                    <div className="form-field">
                        <label>Municipio *</label>
                        <input type="text" value={form.municipio}
                               onChange={(e) => handleChange('municipio', e.target.value)}
                               className={errores.municipio ? 'input-error' : ''} />
                        {errores.municipio && <span className="error-msg">{errores.municipio}</span>}
                    </div>

                    <div className="form-field form-field-full">
                        <label>Domicilio</label>
                        <input type="text" value={form.domicilio || ''}
                               onChange={(e) => handleChange('domicilio', e.target.value)} />
                    </div>
                </div>

                {/* ===== Cultivos ===== */}
                <fieldset className="form-section">
                    <legend>Cultivos * (al menos uno)</legend>
                    {cultivosDisponibles.length === 0 ? (
                        <p className="estado-vacio">
                            No hay cultivos cargados. Creá alguno primero.
                        </p>
                    ) : (
                        <div className="checkbox-grid">
                            {cultivosDisponibles.map((c) => (
                                <label key={c.id} className="checkbox-item">
                                    <input type="checkbox"
                                           checked={form.cultivoIds.includes(c.id)}
                                           onChange={() => toggleCultivo(c.id)} />
                                    {c.nombre}
                                </label>
                            ))}
                        </div>
                    )}
                    {errores.cultivoIds && (
                        <span className="error-msg">{errores.cultivoIds}</span>
                    )}
                </fieldset>

                {/* ===== Familiares ===== */}
                <fieldset className="form-section">
                    <legend>Grupo familiar</legend>

                    {familiares.length === 0 ? (
                        <p className="estado-vacio">
                            No hay familiares cargados. Agregá uno si corresponde.
                        </p>
                    ) : (
                        <div className="familiares-lista">
                            {familiares.map((f, idx) => (
                                <div key={f._key} className="familiar-card">
                                    <div className="familiar-card-header">
                                        <h4>Familiar #{idx + 1}</h4>
                                        <button
                                            type="button"
                                            className="btn-eliminar"
                                            onClick={() => eliminarFamiliar(f._key)}
                                        >
                                            ✕ Eliminar
                                        </button>
                                    </div>
                                    <div className="form-grid">
                                        <div className="form-field">
                                            <label>Apellido *</label>
                                            <input type="text" value={f.apellido}
                                                   onChange={(e) => actualizarFamiliar(f._key, 'apellido', e.target.value)} />
                                        </div>
                                        <div className="form-field">
                                            <label>Nombre *</label>
                                            <input type="text" value={f.nombre}
                                                   onChange={(e) => actualizarFamiliar(f._key, 'nombre', e.target.value)} />
                                        </div>
                                        <div className="form-field">
                                            <label>Sexo *</label>
                                            <select value={f.sexo}
                                                    onChange={(e) => actualizarFamiliar(f._key, 'sexo', e.target.value as Sexo)}>
                                                {SEXOS.map((s) => <option key={s} value={s}>{s}</option>)}
                                            </select>
                                        </div>
                                        <div className="form-field">
                                            <label>Parentesco *</label>
                                            <select value={f.parentesco}
                                                    onChange={(e) => actualizarFamiliar(f._key, 'parentesco', e.target.value as Parentesco)}>
                                                {PARENTESCOS.map((p) => <option key={p} value={p}>{p}</option>)}
                                            </select>
                                        </div>
                                        <div className="form-field">
                                            <label>DNI</label>
                                            <input type="text" value={f.dni || ''}
                                                   onChange={(e) => actualizarFamiliar(f._key, 'dni', e.target.value)} />
                                        </div>
                                        <div className="form-field">
                                            <label>Fecha de nacimiento</label>
                                            <input type="date" value={f.fechaNacimiento || ''}
                                                   onChange={(e) => actualizarFamiliar(f._key, 'fechaNacimiento', e.target.value)} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <button type="button" className="btn btn-secondary" onClick={agregarFamiliar}>
                        + Agregar familiar
                    </button>
                </fieldset>

                <div className="form-actions">
                    <Link to="/productores" className="btn">Cancelar</Link>
                    <button type="submit" className="btn btn-primary" disabled={guardando}>
                        {guardando ? 'Guardando...' : esEdicion ? 'Guardar cambios' : 'Crear productor'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default FormularioProductor;