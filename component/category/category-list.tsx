import type { Category } from '@type/category.type';
import type { FC, PropsWithChildren } from 'react';

import ScrollView from '@commonComponent/scroll-view';
import CategoryCard from './category-card';

type CategoryListProps = PropsWithChildren<{
  categories: Category[];
  onEdit?: (category: Category) => void;
  onRemove?: (category: Category) => void;
  refresh: () => Promise<void>;
}>;

const CategoryList: FC<CategoryListProps> = ({
  categories,
  onEdit,
  onRemove,
  refresh,
  children,
}) => {
  return (
    <ScrollView
      searchable
      onRefresh={refresh}
      items={categories}
      renderItem={category => (
        <CategoryCard key={category.id} category={category} onEdit={onEdit} onRemove={onRemove} />
      )}
    >
      {children}
    </ScrollView>
  );
};

export default CategoryList;
