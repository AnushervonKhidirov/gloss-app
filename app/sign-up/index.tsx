import { Link } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import type { CreateUser } from '@type/user.type';

import { Button, Form, Input } from '@ant-design/react-native';
import InputPassword from '@components/input/input-password';
import { useState } from 'react';

import { AuthService } from '@services/auth.service';

const authService = new AuthService();

const SignUpScreen = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  async function onFinish(value: CreateUser) {
    setLoading(true);

    const [token, err] = await authService.signUp(value);
    if (err) {
      console.log('err', err);
    } else {
      await AuthService.setToken(token);
    }

    setLoading(false);
  }

  return (
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
            Зарегистрироваться
          </Button>
        </Form.Item>
      </Form>

      <Link href="/sign-in">Sign in</Link>
    </View>
  );
};

const styles = StyleSheet.create({
  form_wrapper: {
    display: 'flex',
    height: '100%',
    justifyContent: 'center',
  },
});

export default SignUpScreen;
