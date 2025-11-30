import type { Category } from '@type/category.type';

import categoryService from '@service/category.service';
import useCategoryStore from '@store/category.store';
import useUserStore from '@store/user.store';
import { Role } from '@type/user.type';
import { useLayoutEffect, useState } from 'react';

import { Button } from '@ant-design/react-native';
import LoadingView from '@commonComponent/loading-view';
import Modal from '@commonComponent/modal';
import CategoryList from '@component/category/category-list';
import CreateCategoryForm from '@component/category/form/create-category-form';
import EditCategoryForm from '@component/category/form/edit-category-form';
import { Alert } from 'react-native';

const CategoryScreen = () => {
  const user = useUserStore(state => state.user);
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

  function removeConfirm(category: Category) {
    Alert.alert(
      'Удаление',
      `После удаления нельзя восстановить! Вы хотите удалить ${category.value}?`,
      [
        {
          text: 'Да',
          onPress: () => remove(category),
        },
        {
          text: 'Нет',
        },
      ],
    );
  }

  async function remove(category: Category) {
    const [removedService, err] = await categoryService.delete(category.id);

    if (err) {
      Alert.alert(err.error, err.message);
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
      Alert.alert(err.error, err.message);
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
        onEdit={user?.role === Role.ADMIN ? openEditServiceModal : undefined}
        onRemove={user?.role === Role.ADMIN ? removeConfirm : undefined}
      >
        {user?.role === Role.ADMIN && (
          <>
            <Button type="primary" onPress={() => setCreateCategoryModalVisible(true)}>
              Создать категорию
            </Button>

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
          </>
        )}
      </CategoryList>
    </LoadingView>
  );
};

export default CategoryScreen;
