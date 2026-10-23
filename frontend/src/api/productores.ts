import apiClient from './client';
import type {
    ProductorRequest,
    ProductorResponse,
    ProductorFiltros,
} from '../types';

export const productoresApi = {
    listar: async (filtros?: ProductorFiltros): Promise<ProductorResponse[]> => {
        // axios serializa automáticamente el objeto a query string,
        // pero ignora los campos undefined. Solo manda los que tienen valor.
        const { data } = await apiClient.get<ProductorResponse[]>('/productores', {
            params: filtros,
        });
        return data;
    },

    buscarPorId: async (id: number): Promise<ProductorResponse> => {
        const { data } = await apiClient.get<ProductorResponse>(`/productores/${id}`);
        return data;
    },

    crear: async (request: ProductorRequest): Promise<ProductorResponse> => {
        const { data } = await apiClient.post<ProductorResponse>('/productores', request);
        return data;
    },

    actualizar: async (
        id: number,
        request: ProductorRequest
    ): Promise<ProductorResponse> => {
        const { data } = await apiClient.put<ProductorResponse>(
            `/productores/${id}`,
            request
        );
        return data;
    },

    eliminar: async (id: number): Promise<void> => {
        await apiClient.delete(`/productores/${id}`);
    },
};