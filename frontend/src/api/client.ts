import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10 segundos
});

// Interceptor de respuestas: transforma errores de axios en algo legible
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        // Si el backend respondió con un código de error, usamos su mensaje
        if (error.response) {
            // error.response.data ya tiene { status, error, mensaje, ... }
            return Promise.reject(error.response.data);
        }
        // Si no hubo respuesta (backend apagado, sin red, etc.)
        return Promise.reject({
            status: 0,
            error: 'Error de conexión',
            mensaje: 'No se pudo conectar con el servidor. ¿Está corriendo el backend?',
        });
    }
);

export default apiClient;