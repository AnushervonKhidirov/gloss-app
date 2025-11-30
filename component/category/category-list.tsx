import type { Category } from '@type/category.type';
import type { FC, PropsWithChildren } from 'react';

import { useState } from 'react';
import { RefreshControl, ScrollView, Text, View } from 'react-native';
import CategoryCard from './category-card';

type CategoryListProps = PropsWithChildren<{
  categories: Category[];
  emptyMessage?: string;
  onEdit?: (category: Category) => void;
  onRemove?: (category: Category) => void;
  refresh: () => Promise<void>;
}>;

const CategoryList: FC<CategoryListProps> = ({
  categories,
  onEdit,
  onRemove,
  refresh,
  emptyMessage,
  children,
}) => {
  const message = emptyMessage ?? 'Список категорий пуст';

  const [refreshing, setRefreshing] = useState(false);

  async function onRefresh() {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  }

  return (
    <View style={{ flex: 1, gap: 16 }}>
      <ScrollView
        style={{ flex: 1, paddingRight: 10, marginRight: -10 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={{ gap: 10, flex: 1 }}>
          {categories.length > 0 ? (
            categories.map(category => (
              <CategoryCard
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

      {children}
    </View>
  );
};

export default CategoryList;
