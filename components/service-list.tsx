import type { Service } from '@type/service.type';
import type { FC, PropsWithChildren } from 'react';

import { Card, WingBlank } from '@ant-design/react-native';
import { StyleSheet, Text, View } from 'react-native';

import { minutesToTime } from '@helper/time-converter.helper';

type ServiceListProps = PropsWithChildren<{
  emptyMessage?: string;
  services: Service[];
}>;

type ServiceItemProps = {
  service: Service;
};

const ServiceList: FC<ServiceListProps> = ({ services, emptyMessage, children }) => {
  const message = emptyMessage ?? 'Список услуг пуст';

  return (
    <View style={style.container}>
      <View>{children}</View>

      <View style={style.list}>
        {services.length > 0 ? (
          services.map(service => <ServiceItem key={service.id} service={service} />)
        ) : (
          <Text>{message}</Text>
        )}
      </View>
    </View>
  );
};

const ServiceItem: FC<ServiceItemProps> = ({ service }) => {
  return (
    <Card>
      <Card.Header title={service.name} extra={service.category.value} />

      {service.desc ? (
        <Card.Body>
          <WingBlank>
            <Text>{service.desc}</Text>
          </WingBlank>
        </Card.Body>
      ) : (
        <View></View>
      )}

      <Card.Footer content={service.price + ' с'} extra={minutesToTime(service.duration)} />
    </Card>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 20,
    flexDirection: 'column',
    boxSizing: 'border-box',
  },
  list: {
    gap: 10,
    flex: 1,
  },
});

export default ServiceList;
