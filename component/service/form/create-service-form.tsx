import type { Category } from '@type/category.type';
import type { CreateService, Service } from '@type/service.type';
import type { FC } from 'react';

import { Form, Input } from '@ant-design/react-native';
import ButtonPrimary from '@commonComponent/button-primary';
import Autocomplete from '@commonComponent/input/autocomplete';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';

import { alertError } from '@helper/error-handler';
import serviceService from '@service/service.service';

type CreateServiceFormProps = { categories: Category[]; onSuccess: (service: Service) => void };

const CreateServiceForm: FC<CreateServiceFormProps> = ({ categories, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  async function onFinish(value: CreateService) {
    if (value.desc?.trim() === '') delete value.desc;

    setLoading(true);

    const [service, err] = await serviceService.create(value);

    if (err) {
      alertError(err);
    } else {
      onSuccess(service);
    }

    setLoading(false);
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.form_wrapper}>
        <Form form={form} onFinish={onFinish}>
          <Form.Item name="name" rules={[{ required: true, message: 'Введите название' }]}>
            <Input placeholder="Название"></Input>
          </Form.Item>

          <Form.Item
            name="price"
            getValueFromEvent={e => Number.parseInt(e.nativeEvent.text)}
            rules={[{ required: true, message: 'Введите цену' }]}
          >
            <Input type="number" placeholder="Цена" />
          </Form.Item>

          <Form.Item
            name="duration"
            getValueFromEvent={e => Number.parseInt(e.nativeEvent.text)}
            rules={[{ required: true, message: 'Введите продолжительность' }]}
          >
            <Input type="number" placeholder="Продолжительность" />
          </Form.Item>

          <Form.Item name="categoryId" rules={[{ required: true, message: 'Выберите категорию' }]}>
            <Autocomplete name="categoryId" placeholder="Категория" items={categories} />
          </Form.Item>

          <Form.Item name="desc">
            <Input.TextArea autoSize={{ minRows: 3, maxRows: 5 }} placeholder="Описание" />
          </Form.Item>

          <Form.Item>
            <ButtonPrimary onPress={form.submit} loading={loading}>
              Создать
            </ButtonPrimary>
          </Form.Item>
        </Form>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  form_wrapper: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default CreateServiceForm;
