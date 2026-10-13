import apiClient from './client';
import type { CultivoRequest, CultivoResponse } from '../types';

export const cultivosApi = {
    listar: async (): Promise<CultivoResponse[]> => {
        const { data } = await apiClient.get<CultivoResponse[]>('/cultivos');
        return data;
    },

    crear: async (request: CultivoRequest): Promise<CultivoResponse> => {
        const { data } = await apiClient.post<CultivoResponse>('/cultivos', request);
        return data;
    },

    eliminar: async (id: number): Promise<void> => {
        await apiClient.delete(`/cultivos/${id}`);
    },
};