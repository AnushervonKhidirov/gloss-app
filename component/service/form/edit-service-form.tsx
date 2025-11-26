import type { Category } from '@type/category.type';
import type { Service, UpdateService } from '@type/service.type';
import type { FC } from 'react';

import { Button, Form, Input } from '@ant-design/react-native';
import AutoSelect from '@commonComponent/input/autocomplete';
import { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import serviceService from '@services/service.service';

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
      if (err.statusCode === 403) {
        Alert.alert('Запрет', 'Только администранор может редактировать услуги');
      } else if (err.statusCode >= 500) {
        Alert.alert('Ошибка сервера', 'Что-то пошло не так, попробуйте позже');
      } else {
        Alert.alert('Ошибка', 'Причина не известна');
      }
    } else {
      onSuccess(service);
    }

    setLoading(false);
  }

  return (
    serviceToEdit && (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.form_wrapper}>
          <Form form={form} onFinish={onFinish}>
            <Form.Item
              name="name"
              initialValue={serviceToEdit.name}
              rules={[{ required: true, message: 'Введите название' }]}
            >
              <Input placeholder="Название"></Input>
            </Form.Item>

            <Form.Item
              name="price"
              initialValue={serviceToEdit.price.toString()}
              getValueFromEvent={e => Number.parseInt(e.nativeEvent.text)}
              rules={[{ required: true, message: 'Введите Цена' }]}
            >
              <Input type="number" placeholder="Цена"></Input>
            </Form.Item>

            <Form.Item
              name="duration"
              initialValue={serviceToEdit.duration.toString()}
              getValueFromEvent={e => Number.parseInt(e.nativeEvent.text)}
              rules={[{ required: true, message: 'Введите продолжительность' }]}
            >
              <Input type="number" placeholder="Продолжительность"></Input>
            </Form.Item>

            <Form.Item
              name="categoryId"
              rules={[{ required: true, message: 'Выберите категорию' }]}
            >
              <AutoSelect
                defaultSelected={serviceToEdit.category}
                name="categoryId"
                placeholder="Категория"
                items={categories}
              ></AutoSelect>
            </Form.Item>

            <Form.Item name="desc" initialValue={serviceToEdit.desc}>
              <Input.TextArea placeholder="Описание"></Input.TextArea>
            </Form.Item>

            <Form.Item>
              <Button type="primary" onPress={form.submit} loading={loading}>
                Сохранить
              </Button>
            </Form.Item>
          </Form>
        </View>
      </SafeAreaView>
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
