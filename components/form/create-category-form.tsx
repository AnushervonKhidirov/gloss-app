import type { Category, CreateCategory } from '@type/category.type';
import type { FC } from 'react';

import { Button, Form, Input } from '@ant-design/react-native';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CategoryService } from '@services/category.service';

const categoryService = new CategoryService();

const CreateCategoryForm: FC<{ onSuccess: (category: Category) => void }> = ({ onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  async function onFinish(value: CreateCategory) {
    setLoading(true);

    const [category, err] = await categoryService.create(value);

    if (err) {
      console.log(err);
    } else {
      onSuccess(category);
    }

    setLoading(false);
  }

  return (
    <SafeAreaView>
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
    </SafeAreaView>
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
