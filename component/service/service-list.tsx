import type { Service } from '@type/service.type';
import type { FC, PropsWithChildren } from 'react';

import { Card, WingBlank } from '@ant-design/react-native';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import ActionButtons from '../common/action-buttons';

import { gray } from '@ant-design/colors';
import { scrollerTabMarginBottom } from '@constant/scroller';
import { minutesToTime } from '@helper/time-converter.helper';

type ServiceListProps = PropsWithChildren<{
  services: Service[];
  emptyMessage?: string;
  editable?: boolean;
  refreshing: boolean;
  onEdit?: (service: Service) => void;
  onRemove?: (service: Service) => void;
  onRefresh: () => Promise<void>;
}>;

type ServiceItemProps = {
  service: Service;
  editable: boolean;
  onEdit?: (service: Service) => void;
  onRemove?: (service: Service) => void;
};

type ServiceItemHeaderTextProps = {
  title: string;
  category: string;
};

const ServiceList: FC<ServiceListProps> = ({
  services,
  emptyMessage,
  editable = false,
  refreshing = false,
  onEdit,
  onRemove,
  onRefresh,
  children,
}) => {
  const message = emptyMessage ?? 'Список услуг пуст';

  return (
    <View style={style.container}>
      {children}

      <ScrollView
        style={{ marginBottom: scrollerTabMarginBottom }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={style.list}>
          {services.length > 0 ? (
            services.map(service => (
              <ServiceItem
                key={service.id}
                service={service}
                editable={editable}
                onEdit={onEdit}
                onRemove={onRemove}
              />
            ))
          ) : (
            <Text>{message}</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const ServiceItem: FC<ServiceItemProps> = ({ service, editable, onEdit, onRemove }) => {
  return (
    <Card>
      <Card.Header
        title={<ServiceItemHeaderText title={service.name} category={service.category.value} />}
        extra={
          editable && (
            <ActionButtons
              styles={{ alignSelf: 'flex-end' }}
              onEdit={onEdit?.bind(null, service)}
              onRemove={onRemove?.bind(null, service)}
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
        <View></View>
      )}

      <Card.Footer content={service.price + ' с'} extra={minutesToTime(service.duration)} />
    </Card>
  );
};

const ServiceItemHeaderText: FC<ServiceItemHeaderTextProps> = ({ title, category }) => {
  return (
    <View>
      <Text style={{ fontSize: 17 }}>{title}</Text>
      <Text style={{ color: gray[2] }}>{category}</Text>
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
  list: {
    gap: 10,
    flex: 1,
  },
});

export default ServiceList;
