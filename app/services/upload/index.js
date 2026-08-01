import api from "@/lib/api/axiosInstance";
import { API_ENDPOINTS } from "../api-endpoints";

export const UploadService = {
  uploadFile: async (formData) => {
    const response = await api.post(API_ENDPOINTS.UPLOAD.FILE, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
};
