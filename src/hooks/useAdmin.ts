import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';

export const useUsers = () => {
    return useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const response = await api.get('/users');
            return response.data.data.users;
        },
    });
};

export const useDeleteUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (userId: string) => {
            const response = await api.delete(`/users/${userId}`);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
    });
};

// Rejeter = supprimer le commentaire (pas d'endpoint de modération dans le backend)
export const useDeleteComment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (commentId: string) => {
            const response = await api.delete(`/comments/${commentId}`);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['comments'] });
        },
    });
};

export const useToggleResourceVisibility = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ resourceId, visibility }: { resourceId: string, visibility: string }) => {
            const newVisibility = visibility === 'Public' ? 'Private' : 'Public';
            const response = await api.patch(`/resources/${resourceId}`, { visibility: newVisibility });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['resources'] });
        },
    });
};
