import type { Category } from '@type/category.type';
import type { FC, PropsWithChildren } from 'react';

import ScrollView from '@commonComponent/scroll-view';
import CategoryCard from './category-card';

type CategoryListProps = PropsWithChildren<{
  categories: Category[];
  edit: (category: Category) => void;
  remove: (category: Category) => void;
  refresh: () => Promise<void>;
}>;

const CategoryList: FC<CategoryListProps> = ({ categories, edit, remove, refresh, children }) => {
  return (
    <ScrollView
      searchable
      onRefresh={refresh}
      items={categories}
      renderItem={category => (
        <CategoryCard key={category.id} category={category} edit={edit} remove={remove} />
      )}
    >
      {children}
    </ScrollView>
  );
};

export default CategoryList;
