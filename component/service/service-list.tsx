import type { Service } from '@type/service.type';
import type { FC, Key, PropsWithChildren } from 'react';

import ScrollView from '@commonComponent/scroll-view';
import ServiceCard from './service-card';

type ServiceListProps = PropsWithChildren<{
  services: Service[];
  edit?: (service: Service) => void;
  remove?: (service: Service) => void;
  onRefresh: () => Promise<void>;
  keyExtractor?: (service: Service) => Key;
}>;

const ServiceList: FC<ServiceListProps> = ({
  services,
  edit,
  remove,
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
          edit={edit}
          remove={remove}
        />
      )}
    >
      {children}
    </ScrollView>
  );
};

export default ServiceList;
