import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../services/api";

export const useMyContributions = (userId: string | undefined) => {
    return useQuery({
        queryKey: ['my-contributions', userId], 
        queryFn: async () => {
            const response = await api.get(`/resources/user/${userId}`);
            
            
            return response.data.data.resources || response.data.data || [];
        },
        enabled: !!userId, 
    });
};

export const useResourceDetail = (id: string) => {
    return useQuery({
        queryKey: ['resource', id],
        queryFn: async () => {
            const response = await api.get(`/resources/${id}`);
            return response.data.data.resource;
        },
        enabled: !!id,
    });
};

export const useCreateResource = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (formData: FormData) => {
            const response = await api.post('/resources', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['resources'] });
        },
    });
};