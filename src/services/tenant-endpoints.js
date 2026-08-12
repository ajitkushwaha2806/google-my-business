export const TENANT_ENDPOINT = {
  MENU: {
    CATEGORIES: (slug) => `/api/${slug}/menu/category`,
    ITEMS: (slug, categoryId) => `/api/${slug}/menu/category/${categoryId}/items`,
  },
};
