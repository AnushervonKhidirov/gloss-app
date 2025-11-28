import type { Category } from '@type/category.type';
import type { FC, PropsWithChildren } from 'react';

import { Card } from '@ant-design/react-native';
import { useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import ActionButtons from '../common/action-buttons';

import { scrollerTabMarginBottom } from '@constant/scroller';

type CategoryListProps = PropsWithChildren<{
  categories: Category[];
  emptyMessage?: string;
  onEdit?: (category: Category) => void;
  onRemove?: (category: Category) => void;
  refresh: () => Promise<void>;
}>;

type CategoryItemProps = {
  category: Category;
  onEdit?: (category: Category) => void;
  onRemove?: (category: Category) => void;
};

const CategoryList: FC<CategoryListProps> = ({
  categories,
  onEdit,
  onRemove,
  refresh,
  emptyMessage,
  children,
}) => {
  const message = emptyMessage ?? 'Нет созданных категорий';

  const [refreshing, setRefreshing] = useState(false);

  async function onRefresh() {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  }

  return (
    <View style={style.container}>
      {children}

      <ScrollView
        style={{ marginBottom: scrollerTabMarginBottom }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={style.list}>
          {categories.length > 0 ? (
            categories.map(category => (
              <CategoryItem
                key={category.id}
                category={category}
                onEdit={onEdit}
                onRemove={onRemove}
              />
            ))
          ) : (
            <Text>{message}</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const CategoryItem: FC<CategoryItemProps> = ({ category, onEdit, onRemove }) => {
  return (
    <Card styles={{ card: style.card }}>
      <Text style={{ fontSize: 18, flex: 1 }}>{category.value}</Text>
      <ActionButtons
        onEdit={onEdit?.bind(null, category)}
        onRemove={onRemove?.bind(null, category)}
      />
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
