export const API_ENDPOINTS = {
    RESTAURANT: {
        CREATE_RESTAURANT: "/api/restaurant",
        GET_ALL_RESTAURANT: "/api/restaurant",
        GET_RESTAURANT_BY_ID: (id) => `/api/restaurant/${id}`,
        UPDATE_RESTAURANT: (id) => `/api/restaurant/${id}`,
        DELETE_RESTAURANT: (id) => `/api/restaurant/${id}`,
    },
    UPLOAD: {
        FILE: "/api/upload"
    }
}