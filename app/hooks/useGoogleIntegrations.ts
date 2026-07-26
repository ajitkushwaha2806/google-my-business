import { useQuery } from "@tanstack/react-query";
import { getGoogleIntegrations } from "@/services/google.service";

export const useGoogleIntegrations = () => {
    return useQuery({
        queryKey: ["google-integrations"],
        queryFn: getGoogleIntegrations,
    });
};
