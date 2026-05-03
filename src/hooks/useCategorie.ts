import { useQuery } from '@tanstack/react-query';
import api from '../services/api';

export const useCategorie = () => {
    return useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            const response = await api.get('/categories');
            return response.data.data.categories;
        },
    });
};