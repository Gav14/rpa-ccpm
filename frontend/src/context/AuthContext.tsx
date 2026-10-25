import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

interface Usuario {
    nombre: string;
    email: string;
}

interface AuthContextType {
    usuario: Usuario | null;
    login: (email: string, password: string) => boolean;
    logout: () => void;
    cargando: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USUARIO_KEY = 'rpa_usuario';

// Credenciales fijas simuladas
const CREDENCIALES = {
    email: 'admin@rpa.com',
    password: 'admin123',
    nombre: 'Administrador',
};

export function AuthProvider({ children }: { children: ReactNode }) {
    const [usuario, setUsuario] = useState<Usuario | null>(null);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const guardado = localStorage.getItem(USUARIO_KEY);
        if (guardado) {
            try {
                setUsuario(JSON.parse(guardado));
            } catch {
                localStorage.removeItem(USUARIO_KEY);
            }
        }
        setCargando(false);
    }, []);

    const login = (email: string, password: string): boolean => {
        if (email === CREDENCIALES.email && password === CREDENCIALES.password) {
            const nuevoUsuario = { nombre: CREDENCIALES.nombre, email };
            setUsuario(nuevoUsuario);
            localStorage.setItem(USUARIO_KEY, JSON.stringify(nuevoUsuario));
            return true;
        }
        return false;
    };

    const logout = () => {
        setUsuario(null);
        localStorage.removeItem(USUARIO_KEY);
    };

    return (
        <AuthContext.Provider value={{ usuario, login, logout, cargando }}>
    {children}
    </AuthContext.Provider>
);
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider');
    return context;
}