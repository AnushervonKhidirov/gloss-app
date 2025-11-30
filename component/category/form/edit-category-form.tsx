import type { Category, UpdateCategory } from '@type/category.type';
import type { FC } from 'react';

import { Button, Form, Input } from '@ant-design/react-native';
import categoryService from '@service/category.service';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';

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
      Alert.alert(err.error, Array.isArray(err.message) ? err.message.join(';') : err.message);
    } else {
      onSuccess(category);
    }

    setLoading(false);
  }

  return (
    categoryToEdit && (
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.form_wrapper}>
          <Form form={form} onFinish={onFinish}>
            <Form.Item
              initialValue={categoryToEdit.value}
              name="value"
              rules={[{ required: true, message: 'Введите название категории' }]}
            >
              <Input placeholder="Название категории" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" onPress={form.submit} loading={loading}>
                Сохранить
              </Button>
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

export default EditCategoryForm;
