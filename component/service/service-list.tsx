import type { Service } from '@type/service.type';
import { type FC, type Key, type PropsWithChildren } from 'react';

import ScrollView from '@commonComponent/scroll-view';
import ServiceCard from './service-card';

type ServiceListProps = PropsWithChildren<{
  services: Service[];
  onEdit?: (service: Service) => void;
  onRemove?: (service: Service) => void;
  onRefresh: () => Promise<void>;
  keyExtractor?: (service: Service) => Key;
}>;

const ServiceList: FC<ServiceListProps> = ({
  services,
  onEdit,
  onRemove,
  onRefresh,
  keyExtractor,
  children,
}) => {
  return (
    <ScrollView
      searchable
      onRefresh={onRefresh}
      items={services}
      renderItem={service => (
        <ServiceCard
          key={keyExtractor ? keyExtractor(service) : service.id}
          service={service}
          onEdit={onEdit}
          onRemove={onRemove}
        />
      )}
    >
      {children}
    </ScrollView>
  );
};

export default ServiceList;
