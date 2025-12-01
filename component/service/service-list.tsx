import type { Service } from '@type/service.type';
import type { FC, PropsWithChildren } from 'react';

import { Text, View } from 'react-native';
import ServiceCard from './service-csrd';

import ScrollView from '@commonComponent/scroll-view';

type ServiceListProps = PropsWithChildren<{
  services: Service[];
  emptyMessage?: string;
  onEdit?: (service: Service) => void;
  onRemove?: (service: Service) => void;
  onRefresh: () => Promise<void>;
}>;

const ServiceList: FC<ServiceListProps> = ({
  services,
  emptyMessage,
  onEdit,
  onRemove,
  onRefresh,
  children,
}) => {
  const message = emptyMessage ?? 'Список услуг пуст';

  return (
    <View style={{ flex: 1, gap: 16 }}>
      <ScrollView onRefresh={onRefresh}>
        {services.length > 0 ? (
          services.map(service => (
            <ServiceCard key={service.id} service={service} onEdit={onEdit} onRemove={onRemove} />
          ))
        ) : (
          <Text>{message}</Text>
        )}
      </ScrollView>

      {children}
    </View>
  );
};

export default ServiceList;
