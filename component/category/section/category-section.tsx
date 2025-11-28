import type { Category } from '@type/category.type';

import useServiceStore from '@store/service.store';
import { useState } from 'react';

import { Button } from '@ant-design/react-native';
import Modal from '@commonComponent/modal';
import { Alert } from 'react-native';
import CategoryList from '../category-list';
import CreateCategoryForm from '../form/create-category-form';
import EditCategoryForm from '../form/edit-category-form';

import categoryService from '@service/category.service';

const CategorySection = () => {
  const { categories, pushCategories, editCategory, deleteCategory } = useServiceStore(
    state => state,
  );

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
      if (err.statusCode === 403) {
        Alert.alert('Запрет', 'Только администранор может создавать услуги');
      } else if (err.statusCode >= 500) {
        Alert.alert('Ошибка сервера', 'Что-то пошло не так, попробуйте позже');
      } else {
        Alert.alert('Ошибка', 'Причина не известна');
      }
    } else {
      deleteCategory(removedService);
    }
  }

  return (
    <CategoryList categories={categories} onEdit={openEditServiceModal} onRemove={removeConfirm}>
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
        title="Создание категории"
        isOpen={editCategoryModalVisible}
        close={() => setEditCategoryModalVisible(false)}
      >
        <EditCategoryForm categoryToEdit={toEdit} onSuccess={edit} />
      </Modal>
    </CategoryList>
  );
};

export default CategorySection;
