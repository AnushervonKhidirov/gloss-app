import type { Category, CreateCategory } from '@type/category.type';
import type { FC } from 'react';

import { Button, Form, Input } from '@ant-design/react-native';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';

import categoryService from '@services/category.service';

const CreateCategoryForm: FC<{ onSuccess: (category: Category) => void }> = ({ onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  async function onFinish(value: CreateCategory) {
    setLoading(true);

    const [category, err] = await categoryService.create(value);

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
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.form_wrapper}>
        <Form form={form} onFinish={onFinish}>
          <Form.Item
            name="value"
            rules={[{ required: true, message: 'Введите название категории' }]}
          >
            <Input placeholder="Название категории"></Input>
          </Form.Item>

          <Form.Item>
            <Button type="primary" onPress={form.submit} loading={loading}>
              Создать
            </Button>
          </Form.Item>
        </Form>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  form_wrapper: {
    display: 'flex',
    height: '100%',
    justifyContent: 'center',
  },
});

export default CreateCategoryForm;
