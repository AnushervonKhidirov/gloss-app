import type { SelectedService, Service } from '@type/service.type';
import type { FC } from 'react';

import { Card, Checkbox, Input, WingBlank } from '@ant-design/react-native';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { cardStyles } from '@constant/styles';
import { grey } from '@constant/theme';
import { minutesToTime } from '@helper/time-converter.helper';

type ServiceItemProps = {
  service: Service;
  selectedService?: SelectedService;
  onSelect: (service: Service, selected: boolean) => void;
};

const SelectedServiceCard: FC<ServiceItemProps> = ({ service, selectedService, onSelect }) => {
  const [selected, setSelected] = useState(!!selectedService);
  const [customPrice, setCustomPrice] = useState<number | null>(
    selectedService ? selectedService.price : null,
  );

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
    <Pressable onPress={() => setSelected(!selected)}>
      <Card>
        <Card.Header
          styles={cardStyles.header}
          title={<ServiceHeader title={service.name} category={service.category.value} />}
          extra={
            <Checkbox
              styles={{ checkbox_wrapper: { width: 20 } }}
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
          <View />
        )}

        <Card.Footer content={service.price + ' с'} extra={minutesToTime(service.duration)} />

        <WingBlank>
          <Input
            type="number"
            styles={{ input: styles.input }}
            value={customPrice ? customPrice.toString() : undefined}
            placeholder="Ваша цена (не объязательно)"
            onChangeText={inputHandler}
          />
        </WingBlank>
      </Card>
    </Pressable>
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

const styles = StyleSheet.create({
  input: {
    borderWidth: StyleSheet.hairlineWidth,
    marginBlock: 10,
    borderColor: grey[4],
    borderRadius: 5,
    fontSize: 13,
  },
});

export default SelectedServiceCard;
