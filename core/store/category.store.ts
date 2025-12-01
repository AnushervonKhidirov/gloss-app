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
      return {
        categories: state.categories.map(category =>
          category.id === editedCategory.id ? editedCategory : category,
        ),
      };
    }),

  deleteCategory: deletedCategory =>
    set(state => {
      return {
        categories: state.categories.filter(category => category.id !== deletedCategory.id),
      };
    }),
}));

export default useCategoryStore;
