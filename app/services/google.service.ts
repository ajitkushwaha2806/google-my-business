import { api } from "@/lib/api/client";
import { API_ROUTES } from "@/constants/api";

export const getGoogleIntegrations = async () => {
    const response = await api.get(API_ROUTES.GOOGLE.INTEGRATIONS);
    return response.data;
};

export const disconnectGoogleIntegration = async (googleId: string) => {
    const response = await api.post(API_ROUTES.GOOGLE.DISCONNECT, { googleId });
    return response.data;
};