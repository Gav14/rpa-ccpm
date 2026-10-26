// ============================================================
// Enums (espejo de Sexo.java y Parentesco.java)
// ============================================================

export type Sexo = 'MASCULINO' | 'FEMENINO' | 'OTRO';

export type Parentesco =
    | 'HIJO'
    | 'HIJA'
    | 'CONYUGE'
    | 'PADRE'
    | 'MADRE'
    | 'TIO'
    | 'TIA'
    | 'ABUELO'
    | 'ABUELA'
    | 'HERMANO'
    | 'HERMANA'
    | 'OTRO';

// ============================================================
// Familiar (espejo de FamiliarRequest.java)
// ============================================================

export interface FamiliarRequest {
    apellido: string;
    nombre: string;
    sexo: Sexo;
    dni?: string;
    fechaNacimiento?: string; // ISO date: "YYYY-MM-DD"
    parentesco: Parentesco;
}

export interface FamiliarResponse extends FamiliarRequest {
    id: number;
}

// ============================================================
// Cultivo (espejo de Cultivo.java y CultivoRequest.java)
// ============================================================

export interface CultivoRequest {
    nombre: string;
}

export interface CultivoResponse {
    id: number;
    nombre: string;
}

// ============================================================
// Productor (espejo de ProductorRequest.java y ProductorResponse.java)
// ============================================================

export interface ProductorRequest {
    apellido: string;
    nombre: string;
    dni: string;
    sexo: Sexo;
    tituloMaximo?: string;
    fechaNacimiento: string; // ISO date
    departamento: string;
    municipio: string;
    domicilio?: string;
    cultivoIds: number[];
    familiares: FamiliarRequest[];
}

export interface ProductorResponse {
    id: number;
    apellido: string;
    nombre: string;
    dni: string;
    sexo: Sexo;
    tituloMaximo?: string;
    fechaNacimiento: string;
    departamento: string;
    municipio: string;
    domicilio?: string;
    cultivos: string[]; // nombres, no IDs
    familiares: FamiliarResponse[];
    fotoUrl?: string;
}

// ============================================================
// Filtros de búsqueda (para query params de GET /api/productores)
// ============================================================

export interface ProductorFiltros {
    apellido?: string;
    nombre?: string;
    dni?: string;
    sexo?: Sexo;
    departamento?: string;
    municipio?: string;
    cultivo?: string;
}

// ============================================================
// Estadísticas (espejo de lo que devuelve EstadisticasController)
// ============================================================

export interface Estadisticas {
    totalProductores: number;
    totalCultivos: number;
    totalFamiliares: number;
    promedioFamiliaresPorProductor: number | null;
    porDepartamento: Record<string, number>;
    porMunicipio: Record<string, number>;
    porSexo: Record<string, number>;
    porCultivo: Record<string, number>;
    porParentesco: Record<string, number>;
}

// ============================================================
// Estructura estándar de error que devuelve tu GlobalExceptionHandler
// ============================================================

export interface ApiError {
    status: number;
    error: string;
    mensaje?: string;
    errores?: Record<string, string>;
    timestamp?: string;
}