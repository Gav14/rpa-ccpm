import apiClient from './client';
import type { Estadisticas } from '../types';

export const estadisticasApi = {
    obtener: async (): Promise<Estadisticas> => {
        const { data } = await apiClient.get<Estadisticas>('/estadisticas');
        return data;
    },
};