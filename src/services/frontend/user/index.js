import axios from "axios";

export const UserService = {
    create: async (resId, data) => {
        const response = await axios.post(`/api/restaurant/${resId}/user`, data);
        return response.data;
    },
    getAll: async (resId) => {
        const response = await axios.get(`/api/restaurant/${resId}/user`);
        return response.data;
    },
    update: async (resId, userId, data) => {
        const response = await axios.put(`/api/restaurant/${resId}/user/${userId}`, data);
        return response.data;
    },
    delete: async (resId, userId) => {
        const response = await axios.delete(`/api/restaurant/${resId}/user/${userId}`);
        return response.data;
    }
};
