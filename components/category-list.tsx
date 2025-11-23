import type { Category } from '@type/category.type';
import type { FC, PropsWithChildren } from 'react';

import { Card } from '@ant-design/react-native';
import { StyleSheet, Text, View } from 'react-native';
import ActionButtons from './action-buttons';

type CategoryListProps = PropsWithChildren<{
  emptyMessage?: string;
  categories: Category[];
}>;

type CategoryItemProps = {
  category: Category;
};

const CategoryList: FC<CategoryListProps> = ({ categories, emptyMessage, children }) => {
  const message = emptyMessage ?? 'Нет созданных категорий';

  return (
    <View style={style.container}>
      <View>{children}</View>

      <View style={style.list}>
        {categories.length > 0 ? (
          categories.map(category => <CategoryItem key={category.id} category={category} />)
        ) : (
          <Text>{message}</Text>
        )}
      </View>
    </View>
  );
};

const CategoryItem: FC<CategoryItemProps> = ({ category }) => {
  return (
    <Card styles={{ card: style.card }}>
      <Text style={{ fontSize: 18, flex: 1 }}>{category.value}</Text>
      <ActionButtons />
    </Card>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 20,
  },
  card: {
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    flexDirection: 'row',
  },
  list: {
    gap: 10,
    flex: 1,
  },
});

export default CategoryList;
