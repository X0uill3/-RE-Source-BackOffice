import { useQuery } from "@tanstack/react-query";
import api from "../services/api";

export const useMyFavorites = (userId: string | undefined) => {
    return useQuery({
        queryKey: ['my-favorites', userId],
        queryFn: async () => {
            const response = await api.get('/interactions/user/favorites');
            const data = response.data.data;
            // L'API retourne { favoriteResources: [...] } où chaque élément est une interaction
            // avec la ressource populée dans le champ ressourceId
            if (Array.isArray(data?.favoriteResources)) return data.favoriteResources;
            if (Array.isArray(data)) return data;
            return [];
        },
        enabled: !!userId
    });
};
