import type { Category } from '@type/category.type';
import type { FC, PropsWithChildren } from 'react';

import { Card } from '@ant-design/react-native';
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

      <View style={style.list}>
        {categories.length > 0 ? (
          categories.map(category => <CategoryItem key={category.id} category={category} />)
        ) : (
          <Text>Нет созданных категорий</Text>
        )}
      </View>
    </View>
  );
};

const CategoryItem: FC<CategoryItemProps> = ({ category }) => {
  return (
    <Card styles={{ card: style.card }}>
      <Text style={{ fontSize: 18 }}>{category.value}</Text>
    </Card>
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
  card: {
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 10,
    paddingLeft: 10,
  },
  list: {
    gap: 10,
    flex: 1,
  },
});

export default CategoryList;
