import type { ActionButtonData } from '@commonComponent/action-buttons';
import type { Specialty } from '@type/specialty.type';
import type { FC } from 'react';

import useUserStore from '@store/user.store';
import { Role } from '@type/user.type';
import { useState } from 'react';

import ActionButtons from '@commonComponent/action-buttons';
import Card from '@commonComponent/card';
import { Alert, Text } from 'react-native';

import { grey } from '@constant/theme';

type SpecialtyItemProps = {
  specialty: Specialty;
  edit: (specialty: Specialty) => void;
  remove: (specialty: Specialty) => void;
};

const SpecialtyCard: FC<SpecialtyItemProps> = ({ specialty, edit, remove }) => {
  const isAdmin = useUserStore(state => state.user?.role === Role.ADMIN);
  const [actionVisible, setActionVisible] = useState(false);

  const actionButtons: ActionButtonData[] = [
    {
      iconName: 'square-edit-outline',
      text: 'Редактировать специальность',
      action: () => {
        edit(specialty);
        setActionVisible(false);
      },
    },
    {
      iconName: 'delete-outline',
      text: 'Удалить специальность',
      action: () => removeConfirm(specialty),
    },
  ];

  function removeConfirm(specialty: Specialty) {
    Alert.alert('Удаление', `Удалить ${specialty.name}?\n\nПосле удаления нельзя восстановить!`, [
      {
        text: 'Да',
        onPress: () => remove(specialty),
      },
      {
        text: 'Нет',
      },
    ]);
  }

  return (
    <Card>
      <Card.Header
        content={<Text>{specialty.name}</Text>}
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

      {specialty.desc && (
        <Card.Body>
          <Text style={{ color: grey[6] }}>{specialty.desc}</Text>
        </Card.Body>
      )}
    </Card>
  );
};

export default SpecialtyCard;
