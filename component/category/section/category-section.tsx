import type { Category } from '@type/category.type';

import useServiceStore from '@store/service.store';
import useUserStore from '@store/user.store';
import { Role } from '@type/user.type';
import { useState } from 'react';

import { Button } from '@ant-design/react-native';
import Modal from '@commonComponent/modal';
import { Alert } from 'react-native';
import CategoryList from '../category-list';
import CreateCategoryForm from '../form/create-category-form';
import EditCategoryForm from '../form/edit-category-form';

import categoryService from '@service/category.service';

const CategorySection = () => {
  const user = useUserStore(state => state.user);

  const { categories, pushCategories, editCategory, deleteCategory, setCategories } =
    useServiceStore(state => state);

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

  function openEditServiceModal(category: Category) {
    setToEdit(category);
    setEditCategoryModalVisible(true);
  }

  async function remove(category: Category) {
    const [removedService, err] = await categoryService.delete(category.id);

    if (err) {
      Alert.alert(err.error, err.message);
    } else {
      deleteCategory(removedService);
    }
  }

  async function refreshCategory() {
    const [category, err] = await categoryService.findMany();

    if (err) {
      Alert.alert(err.error, err.message);
    } else {
      setCategories(category);
    }
  }

  return (
    <CategoryList
      categories={categories}
      onEdit={user?.role === Role.ADMIN ? openEditServiceModal : undefined}
      onRemove={user?.role === Role.ADMIN ? removeConfirm : undefined}
      refresh={refreshCategory}
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
  );
};

export default CategorySection;
