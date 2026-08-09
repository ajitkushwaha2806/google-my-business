import axios from "axios";
import { API_ENDPOINTS } from "../../api-endpoints";

export const StaffService = {
    create: async (resId, data) => {
        const response = await axios.post(API_ENDPOINTS.STAFF.CREATE(resId), data);
        return response.data;
    },
    getAll: async (resId) => {
        const response = await axios.get(API_ENDPOINTS.STAFF.GET_ALL(resId));
        return response.data;
    },
    update: async (resId, staffId, data) => {
        const response = await axios.put(API_ENDPOINTS.STAFF.UPDATE(resId, staffId), data);
        return response.data;
    },
    delete: async (resId, staffId) => {
        const response = await axios.delete(API_ENDPOINTS.STAFF.DELETE(resId, staffId));
        return response.data;
    }
};
