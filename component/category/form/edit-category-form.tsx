import type { Category, UpdateCategory } from '@type/category.type';
import type { FC } from 'react';

import { Button, Form, Input } from '@ant-design/react-native';
import { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import categoryService from '@services/category.service';

type EditCategoryFormProps = {
  categoryToEdit: Category | null;
  onSuccess: (category: Category) => void;
};

const EditCategoryForm: FC<EditCategoryFormProps> = ({ categoryToEdit, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  async function onFinish(value: UpdateCategory) {
    if (!categoryToEdit) return;

    setLoading(true);

    const [category, err] = await categoryService.update(categoryToEdit.id, value);

    if (err) {
      if (err.statusCode === 403) {
        Alert.alert('Запрет', 'Только администранор может создавать категории');
      } else if (err.statusCode >= 500) {
        Alert.alert('Ошибка сервера', 'Что-то пошло не так, попробуйте позже');
      } else {
        Alert.alert('Ошибка', 'Причина не известна');
      }
    } else {
      onSuccess(category);
    }

    setLoading(false);
  }

  return (
    categoryToEdit && (
      <SafeAreaView>
        <View style={styles.form_wrapper}>
          <Form form={form} onFinish={onFinish}>
            <Form.Item
              initialValue={categoryToEdit.value}
              name="value"
              rules={[{ required: true, message: 'Введите название категории' }]}
            >
              <Input placeholder="Название категории"></Input>
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
    display: 'flex',
    height: '100%',
    justifyContent: 'center',
  },
});

export default EditCategoryForm;
