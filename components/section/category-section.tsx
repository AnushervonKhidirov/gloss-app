import type { Category } from '@type/category.type';

import useServiceStore from '@store/service.store';
import { useState } from 'react';

import { Button } from '@ant-design/react-native';
import CategoryList from '@components/category-list';
import CreateCategoryForm from '@components/form/create-category-form';
import Modal from '@components/modal';

const CategorySection = () => {
  const { categories, pushCategories } = useServiceStore(state => state);
  const [createCategoryModalVisible, setCreateCategoryModalVisible] = useState(false);

  function pushCategory(category: Category) {
    pushCategories([category]);
    setCreateCategoryModalVisible(false);
  }

  return (
    <CategoryList categories={categories}>
      <Button type="primary" onPress={() => setCreateCategoryModalVisible(true)}>
        Создать категорию
      </Button>

      <Modal
        title="Создание категории"
        isOpen={createCategoryModalVisible}
        close={() => setCreateCategoryModalVisible(false)}
      >
        <CreateCategoryForm onSuccess={pushCategory} />
      </Modal>
    </CategoryList>
  );
};

export default CategorySection;
