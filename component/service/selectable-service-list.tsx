import type { CreateUpdateWorkerService, SelectedService, Service } from '@type/service.type';
import type { FC } from 'react';

import { Button, Card, Checkbox, Input, WingBlank } from '@ant-design/react-native';
import { useEffect, useState } from 'react';
import { Alert, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';

import serviceService from '@services/service.service';

import { gray } from '@ant-design/colors';
import { minutesToTime } from '@helper/time-converter.helper';

type SelectableServiceListProps = {
  services: Service[];
  selectedList: SelectedService[];
  refreshing: boolean;
  onSuccess: (workerServices: SelectedService[]) => void;
  onRefresh: () => Promise<void>;
};

type SelectableServiceItemProps = {
  service: Service;
  selectedService?: SelectedService;
  onSelect: (service: Service, selected: boolean) => void;
};

type ServiceItemHeaderTextProps = {
  title: string;
  category: string;
};

const SelectableServiceList: FC<SelectableServiceListProps> = ({
  services,
  selectedList,
  refreshing,
  onSuccess,
  onRefresh,
}) => {
  const [selectedServices, setSelectedServices] = useState<Service[]>(
    selectedList.map(selected => selected.service),
  );
  const [loading, setLoading] = useState(false);

  async function submit() {
    setLoading(true);

    const workerServices: CreateUpdateWorkerService[] = selectedServices.map(selectedService => {
      const originalService = services.find(service => service.id === selectedService.id);
      const price = originalService?.price === selectedService.price ? null : selectedService.price;

      if (price) return { serviceId: selectedService.id, price: price };
      return { serviceId: selectedService.id };
    });

    const [newWorkerServices, err] = await serviceService.selectedHandler(workerServices);

    if (err) {
      Alert.alert('Ошибка', 'Что-то пошло не так, пожалуйста повторите позже');
    } else {
      onSuccess(newWorkerServices);
    }

    setLoading(false);
  }

  function selectHandler(service: Service, selected: boolean) {
    const newServices = [...selectedServices];
    const existingIndex = newServices.findIndex(serviceItem => serviceItem.id === service.id);

    if (existingIndex === -1 && selected) {
      newServices.push(service);
      setSelectedServices(newServices);
    }

    if (existingIndex !== -1 && selected) {
      newServices[existingIndex] = service;
      setSelectedServices(newServices);
    }

    if (existingIndex !== -1 && !selected) {
      newServices.splice(existingIndex, 1);
      setSelectedServices(newServices);
    }
  }

  return (
    <View style={styles.content}>
      <ScrollView
        style={styles.scroller}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.scrollWrapper}>
          {services.map(service => (
            <SelectableServiceItem
              key={service.id}
              service={service}
              selectedService={selectedList.find(selected => selected.serviceId === service.id)}
              onSelect={selectHandler}
            />
          ))}
        </View>
      </ScrollView>

      <Button type="primary" loading={loading} onPress={submit}>
        Сохранить
      </Button>
    </View>
  );
};

const SelectableServiceItem: FC<SelectableServiceItemProps> = ({
  service,
  selectedService,
  onSelect,
}) => {
  const [customPrice, setCustomPrice] = useState<number | null>(
    selectedService ? selectedService.price : null,
  );
  const [selected, setSelected] = useState(!!selectedService);

  function inputHandler(value: string) {
    setCustomPrice(Number.parseInt(value));
  }

  useEffect(() => {
    const finalService: Service = {
      ...service,
      price: customPrice && !Number.isNaN(customPrice) ? customPrice : service.price,
    };

    onSelect(finalService, selected);
  }, [customPrice, selected]);

  return (
    <View style={styles.cardWrapper}>
      <Card styles={{ card: { flex: 1 } }}>
        <Card.Header
          title={<ServiceItemHeaderText title={service.name} category={service.category.value} />}
          extra={
            <Checkbox
              styles={{ checkbox_wrapper: { alignSelf: 'flex-end', width: 20 } }}
              checked={selected}
              onChange={e => setSelected(e.target.checked)}
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
          <View></View>
        )}

        <Card.Footer content={service.price + ' с'} extra={minutesToTime(service.duration)} />

        <WingBlank>
          <Input
            type="number"
            value={customPrice ? customPrice.toString() : undefined}
            placeholder="Ваша цена (не объязательно)"
            onChangeText={inputHandler}
          />
        </WingBlank>
      </Card>
    </View>
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

const styles = StyleSheet.create({
  content: {
    flex: 1,
    gap: 20,
    marginBottom: 20,
  },
  scroller: {
    flex: 1,
  },
  scrollWrapper: {
    gap: 20,
  },
  cardWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
});

export default SelectableServiceList;
