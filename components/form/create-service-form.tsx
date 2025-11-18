import type { Category } from '@type/category.type';
import type { CreateService, Service } from '@type/service.type';
import type { FC } from 'react';

import { Button, Form, Input } from '@ant-design/react-native';
import AutoSelect from '@components/input/autoselect';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ServiceService } from '@services/service.service';

type CreateServiceFormProps = { categories: Category[]; onSuccess: (service: Service) => void };

const serviceService = new ServiceService();

const CreateServiceForm: FC<CreateServiceFormProps> = ({ categories, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  async function onFinish(value: CreateService) {
    setLoading(true);

    const [service, err] = await serviceService.create(value);

    if (err) {
      console.log(err);
    } else {
      onSuccess(service);
    }

    setLoading(false);
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.form_wrapper}>
        <Form form={form} onFinish={onFinish}>
          <Form.Item name="name" rules={[{ required: true, message: 'Введите название' }]}>
            <Input placeholder="Название"></Input>
          </Form.Item>

          <Form.Item
            name="price"
            getValueFromEvent={e => Number.parseInt(e.nativeEvent.text)}
            rules={[{ required: true, message: 'Введите Цена' }]}
          >
            <Input type="number" placeholder="Цена"></Input>
          </Form.Item>

          <Form.Item
            name="duration"
            getValueFromEvent={e => Number.parseInt(e.nativeEvent.text)}
            rules={[{ required: true, message: 'Введите продолжительность' }]}
          >
            <Input type="number" placeholder="Продолжительность"></Input>
          </Form.Item>

          <Form.Item name="categoryId" rules={[{ required: true, message: 'Выберите категорию' }]}>
            <AutoSelect name="categoryId" placeholder="Категория" items={categories}></AutoSelect>
          </Form.Item>

          <Form.Item name="desc">
            <Input.TextArea placeholder="Описание"></Input.TextArea>
          </Form.Item>

          <Form.Item>
            <Button type="primary" onPress={form.submit} loading={loading}>
              Создать
            </Button>
          </Form.Item>
        </Form>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  form_wrapper: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default CreateServiceForm;
