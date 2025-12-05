import type { ActionButtonData } from '@commonComponent/action-buttons';
import type { Category } from '@type/category.type';
import type { FC } from 'react';

import ActionButtons from '@commonComponent/action-buttons';
import Card from '@commonComponent/card';
import useUserStore from '@store/user.store';
import { Role } from '@type/user.type';
import { useState } from 'react';
import { Alert, Text } from 'react-native';

type CategoryItemProps = {
  category: Category;
  edit: (category: Category) => void;
  remove: (category: Category) => void;
};

const CategoryCard: FC<CategoryItemProps> = ({ category, edit, remove }) => {
  const isAdmin = useUserStore(state => state.user?.role === Role.ADMIN);
  const [actionVisible, setActionVisible] = useState(false);

  const actionButtons: ActionButtonData[] = [
    {
      iconName: 'square-edit-outline',
      text: 'Редактировать категорию',
      action: () => {
        edit(category);
        setActionVisible(false);
      },
    },
    {
      iconName: 'delete-outline',
      text: 'Удалить категорию',
      action: () => removeConfirm(category),
    },
  ];

  function removeConfirm(category: Category) {
    Alert.alert('Удаление', `Удалить ${category.value}?\n\nПосле удаления нельзя восстановить!`, [
      {
        text: 'Да',
        onPress: () => {
          setActionVisible(false);
          remove(category);
        },
      },
      {
        text: 'Нет',
      },
    ]);
  }

  return (
    <Card style={{ paddingTop: 5, paddingRight: 0, paddingBottom: 5, paddingLeft: 0 }}>
      <Card.Header
        content={<Text style={{ fontSize: 18 }}>{category.value}</Text>}
        extra={
          isAdmin && (
            <ActionButtons
              actions={actionButtons}
              visible={actionVisible}
              setVisible={setActionVisible}
            />
          )
        }
      />
    </Card>
  );
};

export default CategoryCard;
