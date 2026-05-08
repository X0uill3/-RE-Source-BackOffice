import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../services/api";

// Toutes les interactions de l'utilisateur connecté
export const useMyInteractions = (userId: string | undefined) => {
    return useQuery({
        queryKey: ['my-interactions', userId],
        queryFn: async () => {
            const response = await api.get('/interactions/user');
            return response.data.data.interactions || [];
        },
        enabled: !!userId,
    });
};

// Favoris de l'utilisateur (ressources avec FAVORITE)
export const useMyFavorites = (userId: string | undefined) => {
    return useQuery({
        queryKey: ['my-favorites', userId],
        queryFn: async () => {
            const response = await api.get('/interactions/user/favorites');
            const data = response.data.data;
            if (Array.isArray(data?.favoriteResources)) return data.favoriteResources;
            if (Array.isArray(data)) return data;
            return [];
        },
        enabled: !!userId,
    });
};

// Enregistrer n'importe quelle interaction (VIEW, FAVORITE, SAVE, SHARE)
export const useRecordInteraction = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: { interactionType: string; ressourceId: string }) => {
            const response = await api.post('/interactions', data);
            return response.data.data.interaction;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['my-interactions'] });
            queryClient.invalidateQueries({ queryKey: ['my-favorites'] });
        },
    });
};

export const useAddFavorite = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (ressourceId: string) => {
            const response = await api.post('/interactions', {
                interactionType: 'FAVORITE',
                ressourceId,
            });
            return response.data.data.interaction;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['my-favorites'] });
            queryClient.invalidateQueries({ queryKey: ['my-interactions'] });
        },
    });
};

export const useRemoveFavorite = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (interactionId: string) => {
            const response = await api.delete(`/interactions/${interactionId}`);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['my-favorites'] });
            queryClient.invalidateQueries({ queryKey: ['my-interactions'] });
        },
    });
};

export const useRemoveInteraction = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (interactionId: string) => {
            const response = await api.delete(`/interactions/${interactionId}`);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['my-interactions'] });
            queryClient.invalidateQueries({ queryKey: ['my-favorites'] });
        },
    });
};
