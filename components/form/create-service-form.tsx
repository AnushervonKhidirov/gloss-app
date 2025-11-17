import { Link } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import type { CreateUser } from '@type/user.type';

import { Button, Form, Input } from '@ant-design/react-native';
import InputPassword from '@components/input/input-password';
import { useState } from 'react';

import { SafeAreaView } from 'react-native-safe-area-context';

const CreateServiceForm = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  async function onFinish(value: CreateUser) {
    setLoading(true);

    

    setLoading(false);
  }

  return (
    <SafeAreaView>
      <View style={styles.form_wrapper}>
        <Form form={form} onFinish={onFinish}>
          <Form.Item name="firstName" rules={[{ required: true, message: 'Введите имя' }]}>
            <Input placeholder="Имя"></Input>
          </Form.Item>

          <Form.Item name="lastName">
            <Input placeholder="Фамилия"></Input>
          </Form.Item>

          <Form.Item name="username" rules={[{ required: true, message: 'Введите логин' }]}>
            <Input placeholder="Логин"></Input>
          </Form.Item>

          <InputPassword />

          <Form.Item>
            <Button type="primary" onPress={form.submit} loading={loading}>
              Создать
            </Button>
          </Form.Item>
        </Form>

        <Link replace href="/sign-in">
          Sign in
        </Link>
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

export default CreateServiceForm;
