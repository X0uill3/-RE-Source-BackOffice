import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';

export const useComments = (resourceId: string) => {
    return useQuery({
        queryKey: ['comments', resourceId],
        queryFn: async () => {
            const response = await api.get(`/comments/ressource/${resourceId}`);
            return response.data.data.comments;
        },
        enabled: !!resourceId,
    });
};

// Tous les commentaires (admin uniquement)
export const useAllComments = () => {
    return useQuery({
        queryKey: ['comments', 'all'],
        queryFn: async () => {
            const response = await api.get('/comments/admin/comments');
            return response.data.data.comments;
        },
    });
};

export const useAddComment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ resourceId, content }: { resourceId: string, content: string }) => {
            const response = await api.post(`/comments/ressource/${resourceId}`, {
                content,
                ressourceId: resourceId,
            });
            return response.data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['comments', variables.resourceId] });
        },
    });
};

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
