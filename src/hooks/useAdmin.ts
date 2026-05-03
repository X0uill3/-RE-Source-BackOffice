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

export const useModerateComment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ commentId, action }: { commentId: string, action: 'approve' | 'reject' }) => {
            const response = await api.patch(`/comments/${commentId}/moderate`, { action });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['comments'] });
        },
    });
};

export const useToggleResource = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ resourceId, isPublic }: { resourceId: string, isPublic: boolean }) => {
            const response = await api.patch(`/resources/${resourceId}`, { isPublic: !isPublic });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['resources'] });
        },
    });
};