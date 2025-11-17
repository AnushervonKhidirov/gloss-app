import type { Category } from '@type/category.type';
import type { FC, PropsWithChildren } from 'react';

import { StyleSheet, Text, View } from 'react-native';

type CategoryListProps = PropsWithChildren<{
  categories: Category[];
}>;

type CategoryItemProps = {
  category: Category;
};

const CategoryList: FC<CategoryListProps> = ({ categories, children }) => {
  return (
    <View style={style.container}>
      <View>{children}</View>

      <View>
        {categories.map(category => (
          <CategoryItem key={category.id} category={category} />
        ))}
      </View>
    </View>
  );
};

const CategoryItem: FC<CategoryItemProps> = ({ category }) => {
  return (
    <View style={style.category_item}>
      <Text>{category.value}</Text>
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 20,
    flexDirection: 'column',
    boxSizing: 'border-box',
  },
  category_item: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000',
  },
});

export default CategoryList;
