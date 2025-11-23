import type { CreateUser } from '@type/user.type';

import { Button, Form, Input } from '@ant-design/react-native';
import InputPassword from '@commonComponent/input/input-password';
import { Link } from 'expo-router';
import { isValidPhoneNumber } from 'libphonenumber-js';
import { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AuthService } from '@services/auth.service';

const authService = new AuthService();

const SignUpScreen = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  async function onFinish(value: CreateUser) {
    setLoading(true);

    const [_, err] = await authService.signUp(value);

    if (err) {
      if (err.statusCode === 409) {
        Alert.alert('Пользователь уже существует');
      } else if (err.statusCode >= 500) {
        Alert.alert('Ошибка сервера', 'Что-то пошло не так, попробуйте позже');
      } else {
        Alert.alert('Ошибка', 'Причина не известна');
      }
    } else {
      Alert.alert('Вы успешно зарегистрировались', 'Дождитесь подтверждения');
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

          <Form.Item
            name="phone"
            rules={[
              {
                required: true,
                message: 'Введите номер телефона',
              },
              {
                validator(_, value) {
                  if (
                    typeof value === 'string' &&
                    value.trim() !== '' &&
                    !isValidPhoneNumber(value, 'TJ')
                  ) {
                    console.log('invalid');

                    return Promise.reject(new Error('Неправильный формат номера'));
                  }

                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input placeholder="Номер телефона"></Input>
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
