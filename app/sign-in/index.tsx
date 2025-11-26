import type { SignIn } from '@type/auth.type';

import { Button, Form, Input } from '@ant-design/react-native';
import InputPassword from '@commonComponent/input/input-password';
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import authService from '@services/auth.service';

const SignInScreen = () => {
  const [form] = Form.useForm();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onFinish(value: SignIn) {
    setLoading(true);

    const [token, err] = await authService.signIn(value);

    if (err) {
      if (err.statusCode === 404) {
        Alert.alert('Пользователь не найден');
      } else if (err.statusCode === 403) {
        Alert.alert('Аккаунт не подтвержден', 'Дождитесь пока вас подтвердят');
      } else if (err.statusCode >= 500) {
        Alert.alert('Ошибка сервера', 'Что-то пошло не так, попробуйте позже');
      } else {
        Alert.alert('Ошибка', 'Причина не известна');
      }
    } else {
      await authService.setToken(token);
      router.replace('/(tabs)');
    }

    setLoading(false);
  }

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.form_wrapper}>
        <Form form={form} onFinish={onFinish}>
          <Form.Item name="username" rules={[{ required: true, message: 'Введите логин' }]}>
            <Input placeholder="Логин"></Input>
          </Form.Item>

          <Form.Item name="password" rules={[{ required: true, message: 'Введите пароль' }]}>
            <InputPassword />
          </Form.Item>

          <Form.Item>
            <Button type="primary" onPress={form.submit} loading={loading}>
              Войти
            </Button>
          </Form.Item>
        </Form>

        <View style={styles.footer}>
          <Text>
            Нет аккаунта?{' '}
            <Link replace href="/sign-up" style={styles.link}>
              Зарегистрироваться
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

export default SignInScreen;
