import MenuItem from "@/models/Item";
import ImageAsset from "@/models/Image";
import Category from "@/models/Category";

export const MenuService = {
  getAllCategories: async (resId) => {
    const categories = await Category.find({
      restaurant: resId,
      parentCategory: null,
    }).populate("image").lean();

    const categoriesWithImages = await Promise.all(
      categories.map(async (category) => {
        if (!category.image) {
          const itemWithImage = await MenuItem.findOne({
            category: category._id,
            image: { $ne: null },
          }).populate("image").lean();

          if (itemWithImage) {
            category.image = itemWithImage.image;
          }
        }
        return category;
      })
    );

    return { categories: categoriesWithImages };
  },

  getAllItemsByCategory: async (resId, categoryId) => {
    const items = await MenuItem.find({
      restaurant: resId,
      category: categoryId,
    })
      .populate("subCategory", "name")
      .populate("image")
      .lean();

    const groupedItems = items.reduce((acc, item) => {
      const subCatName = item.subCategory?.name || "Others";
      if (!acc[subCatName]) {
        acc[subCatName] = [];
      }
      acc[subCatName].push(item);
      return acc;
    }, {});

    return { items: groupedItems };
  }
};