import type { Category } from '@type/category.type';

import categoryService from '@service/category.service';
import useCategoryStore from '@store/category.store';
import useUserStore from '@store/user.store';
import { Role } from '@type/user.type';
import { useLayoutEffect, useState } from 'react';

import CategoryList from '@component/category/category-list';
import CreateCategoryForm from '@component/category/form/create-category-form';
import EditCategoryForm from '@component/category/form/edit-category-form';
import { Button, LoadingView, Modal } from '@component/common';

import { alertError } from '@helper/error-handler';

const CategoryScreen = () => {
  const isAdmin = useUserStore(state => state.user?.role === Role.ADMIN);
  const { categories, pushCategories, editCategory, deleteCategory, setCategories } =
    useCategoryStore(state => state);

  const [loading, setLoading] = useState(false);

  const [toEdit, setToEdit] = useState<Category | null>(null);
  const [createCategoryModalVisible, setCreateCategoryModalVisible] = useState(false);
  const [editCategoryModalVisible, setEditCategoryModalVisible] = useState(false);

  function push(category: Category) {
    pushCategories([category]);
    setCreateCategoryModalVisible(false);
  }

  function edit(category: Category) {
    editCategory(category);
    setEditCategoryModalVisible(false);
  }

  function openEditServiceModal(category: Category) {
    setToEdit(category);
    setEditCategoryModalVisible(true);
  }

  async function remove(category: Category) {
    const [removedService, err] = await categoryService.delete(category.id);

    if (err) {
      alertError(err);
    } else {
      deleteCategory(removedService);
    }
  }

  async function fetchOnLoad() {
    setLoading(true);
    await fetch();
    setLoading(false);
  }

  async function fetch() {
    const [categories, err] = await categoryService.findMany();

    if (err) {
      alertError(err);
    } else {
      setCategories(categories);
    }
  }

  useLayoutEffect(() => {
    fetchOnLoad();
  }, []);

  return (
    <LoadingView loading={loading}>
      <CategoryList
        categories={categories}
        refresh={fetch}
        edit={openEditServiceModal}
        remove={remove}
      >
        {isAdmin && (
          <Button title="Создать категорию" onPress={() => setCreateCategoryModalVisible(true)} />
        )}
      </CategoryList>

      <Modal
        title="Создание категории"
        isOpen={createCategoryModalVisible}
        close={() => setCreateCategoryModalVisible(false)}
      >
        <CreateCategoryForm onSuccess={push} />
      </Modal>

      <Modal
        title="Редактирование категории"
        isOpen={editCategoryModalVisible}
        close={() => setEditCategoryModalVisible(false)}
      >
        <EditCategoryForm categoryToEdit={toEdit} onSuccess={edit} />
      </Modal>
    </LoadingView>
  );
};

export default CategoryScreen;
