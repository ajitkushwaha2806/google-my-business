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
    },
    MENU: {
        CATEGORY: {
            CREATE: (resId) => `/api/restaurant/${resId}/menu/category`,
            GET_ALL: (resId) => `/api/restaurant/${resId}/menu/category`,
            UPDATE: (resId) => `/api/restaurant/${resId}/menu/category`,
            DELETE: (resId) => `/api/restaurant/${resId}/menu/category`,
        },
        ITEM: {
            CREATE: (resId) => `/api/restaurant/${resId}/menu/item`,
            GET_ALL: (resId) => `/api/restaurant/${resId}/menu/item`,
            UPDATE: (resId) => `/api/restaurant/${resId}/menu/item`,
            DELETE: (resId) => `/api/restaurant/${resId}/menu/item`,
        },
        IMPORT_ZOMATO: (resId) => `/api/restaurant/${resId}/menu/import/zomato`
    },
    STAFF: {
        CREATE: (resId) => `/api/restaurant/${resId}/staff`,
        GET_ALL: (resId) => `/api/restaurant/${resId}/staff`,
        UPDATE: (resId, staffId) => `/api/restaurant/${resId}/staff/${staffId}`,
        DELETE: (resId, staffId) => `/api/restaurant/${resId}/staff/${staffId}`,
    },
    ROLE: {
        GET_ALL: (resId) => `/api/restaurant/${resId}/role`,
    }
}