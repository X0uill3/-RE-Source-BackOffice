import { useQuery } from "@tanstack/react-query";
import api from "../services/api";

export const useMyFavorites = (userId: string | undefined) => {
    return useQuery({
        queryKey: ['my-favorites', userId],
       queryFn: async () => {
        const response = await api.get('/interactions/user/favorites');
        console.log('API favorites response:', response.data);
        
        const data = response.data.data;
        
        // On s'assure de toujours retourner un tableau
        if (Array.isArray(data)) return data;
        if (Array.isArray(data?.favorites)) return data.favorites;
        if (Array.isArray(response.data?.favorites)) return response.data.favorites;
        
        return [];
    },
        enabled: !!userId
    });
};