import type { Service } from '@type/service.type';
import type { FC } from 'react';

import { Card, WingBlank } from '@ant-design/react-native';
import { Text, View } from 'react-native';
import ActionButtons from '../common/action-buttons';

import { gray } from '@ant-design/colors';
import { cardStyle } from '@constant/card-style';
import { minutesToTime } from '@helper/time-converter.helper';

type ServiceItemProps = {
  service: Service;
  onEdit?: (service: Service) => void;
  onRemove?: (service: Service) => void;
};

const ServiceCard: FC<ServiceItemProps> = ({ service, onEdit, onRemove }) => {
  return (
    <Card>
      <Card.Header
        styles={cardStyle.header}
        title={<ServiceItemHeaderText title={service.name} category={service.category.value} />}
        extra={
          <ActionButtons
            onEdit={onEdit?.bind(null, service)}
            onRemove={onRemove?.bind(null, service)}
          />
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

const ServiceItemHeaderText: FC<{ title: string; category: string }> = ({ title, category }) => {
  return (
    <View>
      <Text style={{ fontSize: 17 }}>{title}</Text>
      <Text style={{ color: gray[2] }}>{category}</Text>
    </View>
  );
};

export default ServiceCard;
