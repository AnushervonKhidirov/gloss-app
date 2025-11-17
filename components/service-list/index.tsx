import type { Service } from '@type/service.type';
import type { FC, PropsWithChildren } from 'react';

import { StyleSheet, Text, View } from 'react-native';

type ServiceListProps = PropsWithChildren<{
  services: Service[];
}>;

type ServiceItemProps = {
  service: Service;
};

const ServiceList: FC<ServiceListProps> = ({ services, children }) => {
  return (
    <View style={style.container}>
      <View>{children}</View>

      <View>
        {services.map(service => (
          <ServiceItem key={service.id} service={service} />
        ))}
      </View>
    </View>
  );
};

const ServiceItem: FC<ServiceItemProps> = ({ service }) => {
  return (
    <View style={style.service_item}>
      <Text>{service.name}</Text>
      <Text>{service.price}</Text>
    </View>
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
  service_item: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000',
  },
});

export default ServiceList;
