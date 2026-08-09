import axios from "axios";
import { API_ENDPOINTS } from "../../api-endpoints";

export const MenuService = {
    category: {
        create: async (resId, data) => {
            const response = await axios.post(API_ENDPOINTS.MENU.CATEGORY.CREATE(resId), data);
            return response.data;
        },
        getAll: async (resId) => {
            const response = await axios.get(API_ENDPOINTS.MENU.CATEGORY.GET_ALL(resId));
            return response.data;
        },
        update: async (resId, categoryId, data) => {
            const response = await axios.put(`${API_ENDPOINTS.MENU.CATEGORY.UPDATE(resId)}?categoryId=${categoryId}`, data);
            return response.data;
        },
        delete: async (resId, categoryId) => {
            const response = await axios.delete(`${API_ENDPOINTS.MENU.CATEGORY.DELETE(resId)}?categoryId=${categoryId}`);
            return response.data;
        }
    },
    item: {
        create: async (resId, data) => {
            const response = await axios.post(API_ENDPOINTS.MENU.ITEM.CREATE(resId), data);
            return response.data;
        },
        getAll: async (resId, params = {}) => {
            const queryStr = new URLSearchParams(params).toString();
            const url = API_ENDPOINTS.MENU.ITEM.GET_ALL(resId) + (queryStr ? `?${queryStr}` : '');
            const response = await axios.get(url);
            return response.data;
        },
        update: async (resId, itemId, data) => {
            const response = await axios.put(`${API_ENDPOINTS.MENU.ITEM.UPDATE(resId)}?itemId=${itemId}`, data);
            return response.data;
        },
        delete: async (resId, itemId) => {
            const response = await axios.delete(`${API_ENDPOINTS.MENU.ITEM.DELETE(resId)}?itemId=${itemId}`);
            return response.data;
        }
    },
    importZomato: async (resId, pageUrl) => {
        const response = await axios.get(`${API_ENDPOINTS.MENU.IMPORT_ZOMATO(resId)}?pageUrl=${encodeURIComponent(pageUrl)}`);
        return response.data;
    }
};
