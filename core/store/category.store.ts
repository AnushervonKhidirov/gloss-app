import type { Category } from '@type/category.type';

import { create } from 'zustand';

type CategoryState = {
  categories: Category[];
};

type CategoryActions = {
  setCategories: (categories: Category[]) => void;
  pushCategories: (categories: Category[]) => void;
  editCategory: (category: Category) => void;
  deleteCategory: (category: Category) => void;
};

const useCategoryStore = create<CategoryState & CategoryActions>(set => ({
  categories: [],

  setCategories: categories => set(() => ({ categories })),

  pushCategories: newCategories =>
    set(state => ({ categories: [...state.categories, ...newCategories] })),

  editCategory: editedCategory =>
    set(state => {
      const newCategoryList = state.categories.map(category => {
        return category.id === editedCategory.id ? editedCategory : category;
      });
      return { categories: newCategoryList };
    }),

  deleteCategory: deletedCategory =>
    set(state => {
      const newCategoryList = state.categories.filter(
        category => category.id !== deletedCategory.id,
      );
      return { categories: newCategoryList };
    }),
}));

export default useCategoryStore;
