import type { Category } from '@type/category.type';
import type { FC } from 'react';

import { Card } from '@ant-design/react-native';
import ActionButtons from '@commonComponent/action-buttons';
import { Text } from 'react-native';

type CategoryItemProps = {
  category: Category;
  onEdit?: (category: Category) => void;
  onRemove?: (category: Category) => void;
};

const CategoryCard: FC<CategoryItemProps> = ({ category, onEdit, onRemove }) => {
  return (
    <Card style={{ paddingTop: 5, paddingRight: 0, paddingBottom: 5, paddingLeft: 0 }}>
      <Card.Header
        title={<Text style={{ fontSize: 18 }}>{category.value}</Text>}
        extra={
          <ActionButtons
            styles={{ alignSelf: 'flex-end' }}
            onEdit={onEdit?.bind(null, category)}
            onRemove={onRemove?.bind(null, category)}
          />
        }
      />
    </Card>
  );
};

export default CategoryCard;
