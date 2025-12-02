import type { Category, CreateCategory } from '@type/category.type';
import type { FC } from 'react';

import { Form, Input } from '@ant-design/react-native';
import ButtonPrimary from '@commonComponent/button-primary';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';

import { alertError } from '@helper/error-handler';
import categoryService from '@service/category.service';

const CreateCategoryForm: FC<{ onSuccess: (category: Category) => void }> = ({ onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  async function onFinish(value: CreateCategory) {
    setLoading(true);

    const [category, err] = await categoryService.create(value);

    if (err) {
      alertError(err);
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
            <Input placeholder="Название категории" />
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

export default CreateCategoryForm;
