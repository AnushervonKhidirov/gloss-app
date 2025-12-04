import type { ActionButtonData } from '@commonComponent/action-buttons-modal';
import type { Specialty } from '@type/specialty.type';
import type { FC } from 'react';

import { Card, WingBlank } from '@ant-design/react-native';
import ActionButtonsModal from '@commonComponent/action-buttons-modal';
import useUserStore from '@store/user.store';
import { Role } from '@type/user.type';
import { useState } from 'react';
import { Alert, Text, View } from 'react-native';

import { cardStyle } from '@constant/card-style';
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
        styles={cardStyle.header}
        title={<Text>{specialty.name}</Text>}
        extra={
          isAdmin && (
            <ActionButtonsModal
              actions={actionButtons}
              visible={actionVisible}
              setVisible={setActionVisible}
            />
          )
        }
      />

      {specialty.desc ? (
        <Card.Body>
          <WingBlank>
            <Text style={{ color: grey[6] }}>{specialty.desc}</Text>
          </WingBlank>
        </Card.Body>
      ) : (
        <View />
      )}
    </Card>
  );
};

export default SpecialtyCard;
