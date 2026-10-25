import { useState } from 'react';
import apiClient from '../api/client';

interface Props {
    productorId: number;
    fotoActual?: string;
    onFotoSubida: (url: string) => void;
}

function SubirFoto({ productorId, fotoActual, onFotoSubida }: Props) {
    const [subiendo, setSubiendo] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validación básica en el front
        if (!file.type.startsWith('image/')) {
            setError('Solo se permiten imágenes');
            return;
        }

        const formData = new FormData();
        formData.append('archivo', file);

        try {
            setSubiendo(true);
            setError(null);
            const { data } = await apiClient.post(`/productores/${productorId}/foto`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            onFotoSubida(data.fotoUrl);
        } catch (err: any) {
            setError(err.mensaje || 'Error al subir la foto');
        } finally {
            setSubiendo(false);
        }
    };

    // URL completa para mostrar la imagen
    const urlCompleta = fotoActual
        ? `http://localhost:8080${fotoActual}`
        : null;

    return (
        <div className="foto-container">
            {urlCompleta ? (
                <img src={urlCompleta} alt="Foto del productor" className="foto-productor" />
            ) : (
                <div className="foto-placeholder">Sin foto</div>
            )}

            <div className="foto-acciones">
                <label className="btn btn-secondary btn-sm">
                    {subiendo ? 'Subiendo...' : 'Cambiar foto'}
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        disabled={subiendo}
                        style={{ display: 'none' }}
                    />
                </label>
                {error && <span className="error-msg">{error}</span>}
            </div>
        </div>
    );
}

export default SubirFoto;