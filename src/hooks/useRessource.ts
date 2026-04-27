import { useQuery } from "@tanstack/react-query";
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