import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Completá todos los campos');
            return;
        }

        const ok = login(email, password);
        if (ok) {
            navigate('/');
        } else {
            setError('Credenciales incorrectas. Probá con admin@rpa.com / admin123');
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <h1>🌱 RPA</h1>
                <p className="login-subtitle">Registro de Productores Agrarios</p>

                <form onSubmit={handleSubmit}>
                    <div className="form-field">
                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@rpa.com"
                            autoComplete="username"
                        />
                    </div>

                    <div className="form-field">
                        <label>Contraseña</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••"
                            autoComplete="current-password"
                        />
                    </div>

                    {error && <div className="login-error">{error}</div>}

                    <button type="submit" className="btn btn-primary login-btn">
                        Ingresar
                    </button>
                </form>

                <p className="login-hint">
                    Credenciales de prueba: <br />
                    <code>admin@rpa.com</code> / <code>admin123</code>
                </p>
            </div>
        </div>
    );
}

export default Login;