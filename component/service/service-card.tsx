import type { ActionButtonData } from '@commonComponent/action-buttons';
import type { Service } from '@type/service.type';
import type { FC } from 'react';

import { Card, WingBlank } from '@ant-design/react-native';
import ActionButtons from '@commonComponent/action-buttons';
import useUserStore from '@store/user.store';
import { Role } from '@type/user.type';
import { useEffect, useState } from 'react';
import { Alert, Text, View } from 'react-native';

import { cardStyle } from '@constant/card-style';
import { grey } from '@constant/theme';
import { minutesToTime } from '@helper/time-converter.helper';

type ServiceItemProps = {
  service: Service;
  edit?: (service: Service) => void;
  remove?: (service: Service) => void;
};

const ServiceCard: FC<ServiceItemProps> = ({ service, edit, remove }) => {
  const isAdmin = useUserStore(state => state.user?.role === Role.ADMIN);

  const [actions, setActions] = useState<ActionButtonData[]>([]);
  const [actionVisible, setActionVisible] = useState(false);

  function removeConfirm(service: Service) {
    Alert.alert(
      'Удаление',
      `После удаления нельзя восстановить! Вы хотите удалить ${service.name}?`,
      [
        {
          text: 'Да',
          onPress: remove
            ? () => {
                setActionVisible(false);
                remove(service);
              }
            : undefined,
        },
        {
          text: 'Нет',
        },
      ],
    );
  }

  useEffect(() => {
    const actionButtons: ActionButtonData[] = [];

    if (edit) {
      actionButtons.push({
        iconName: 'square-edit-outline',
        text: 'Редактировать услугу',
        action: () => {
          edit(service);
          setActionVisible(false);
        },
      });
    }

    if (remove) {
      actionButtons.push({
        iconName: 'delete-outline',
        text: 'Удалить услугу',
        action: () => removeConfirm(service),
      });
    }

    setActions(actionButtons);
  }, []);

  return (
    <Card>
      <Card.Header
        styles={cardStyle.header}
        title={<ServiceHeader title={service.name} category={service.category.value} />}
        extra={
          isAdmin && (
            <ActionButtons
              actions={isAdmin ? actions : []}
              visible={actionVisible}
              setVisible={setActionVisible}
            />
          )
        }
      />

      {service.desc ? (
        <Card.Body>
          <WingBlank>
            <Text>{service.desc}</Text>
          </WingBlank>
        </Card.Body>
      ) : (
        <View />
      )}

      <Card.Footer content={service.price + ' с'} extra={minutesToTime(service.duration)} />
    </Card>
  );
};

const ServiceHeader: FC<{ title: string; category: string }> = ({ title, category }) => {
  return (
    <View>
      <Text style={{ fontSize: 17 }}>{title}</Text>
      <Text style={{ color: grey[6] }}>{category}</Text>
    </View>
  );
};

export default ServiceCard;
