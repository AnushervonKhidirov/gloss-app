import type { CreateUser } from '@type/user.type';

import { Button, Form, Input } from '@ant-design/react-native';
import InputPassword from '@components/input/input-password';
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AuthService } from '@services/auth.service';

const authService = new AuthService();

const SignUpScreen = () => {
  const [form] = Form.useForm();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onFinish(value: CreateUser) {
    setLoading(true);

    const [token, err] = await authService.signUp(value);
    if (err) {
      console.log('err', err);
    } else {
      await AuthService.setToken(token);
      router.replace('/(tabs)');
    }

    setLoading(false);
  }

  return (
    <SafeAreaView style={styles.screen}>
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

          <Form.Item name="password" rules={[{ required: true, message: 'Введите пароль' }]}>
            <InputPassword />
          </Form.Item>

          <Form.Item>
            <Button type="primary" onPress={form.submit} loading={loading}>
              Зарегистрироваться
            </Button>
          </Form.Item>
        </Form>

        <View style={styles.footer}>
          <Text>
            Уже есть аккаунт?{' '}
            <Link replace href="/sign-in" style={styles.link}>
              Войти
            </Link>
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },

  form_wrapper: {
    flex: 1,
    justifyContent: 'center',
  },

  footer: {
    padding: 20,
  },

  link: {
    color: '#108ee9',
  },
});

export default SignUpScreen;
