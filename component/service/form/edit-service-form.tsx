import type { Category } from '@type/category.type';
import type { Service, UpdateService } from '@type/service.type';
import type { FC } from 'react';

import { Form, Input } from '@ant-design/react-native';
import Button from '@commonComponent/button';
import Autocomplete from '@commonComponent/input/autocomplete';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';

import { alertError } from '@helper/error-handler';
import serviceService from '@service/service.service';

type EditServiceFormProps = {
  serviceToEdit: Service | null;
  categories: Category[];
  onSuccess: (service: Service) => void;
};

const EditServiceForm: FC<EditServiceFormProps> = ({ serviceToEdit, categories, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  async function onFinish(value: UpdateService) {
    if (!serviceToEdit) return;

    if (typeof value.price === 'string') value.price = +value.price;
    if (typeof value.duration === 'string') value.duration = +value.duration;
    if (value.desc?.trim() === '') delete value.desc;

    setLoading(true);

    const [service, err] = await serviceService.update(serviceToEdit.id, value);

    if (err) {
      alertError(err);
    } else {
      onSuccess(service);
    }

    setLoading(false);
  }

  return (
    serviceToEdit && (
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.form_wrapper}>
          <Form form={form} onFinish={onFinish}>
            <Form.Item
              name="name"
              initialValue={serviceToEdit.name}
              rules={[{ required: true, message: 'Введите название' }]}
            >
              <Input placeholder="Название" />
            </Form.Item>

            <Form.Item
              name="price"
              initialValue={serviceToEdit.price.toString()}
              getValueFromEvent={e => Number.parseInt(e.nativeEvent.text)}
              rules={[{ required: true, message: 'Введите цену' }]}
            >
              <Input type="number" placeholder="Цена" />
            </Form.Item>

            <Form.Item
              name="duration"
              initialValue={serviceToEdit.duration.toString()}
              getValueFromEvent={e => Number.parseInt(e.nativeEvent.text)}
              rules={[{ required: true, message: 'Введите продолжительность' }]}
            >
              <Input type="number" placeholder="Продолжительность" />
            </Form.Item>

            <Form.Item
              name="categoryId"
              rules={[{ required: true, message: 'Выберите категорию' }]}
            >
              <Autocomplete
                defaultSelected={serviceToEdit.category}
                name="categoryId"
                placeholder="Категория"
                items={categories}
              />
            </Form.Item>

            <Form.Item name="desc" initialValue={serviceToEdit.desc}>
              <Input.TextArea autoSize={{ minRows: 3, maxRows: 5 }} placeholder="Описание" />
            </Form.Item>

            <Form.Item>
              <Button title="Сохранить" onPress={form.submit} loading={loading} />
            </Form.Item>
          </Form>
        </View>
      </KeyboardAvoidingView>
    )
  );
};

const styles = StyleSheet.create({
  form_wrapper: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default EditServiceForm;
