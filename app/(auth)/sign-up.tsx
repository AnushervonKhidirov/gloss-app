import type { CreateUser } from '@type/user.type';

import { Button, Form, Input } from '@ant-design/react-native';
import InputPassword from '@commonComponent/input/input-password';
import { Link, router } from 'expo-router';
import { isValidPhoneNumber } from 'libphonenumber-js';
import { useLayoutEffect, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { blue } from '@constant/theme';
import { alertError } from '@helper/error-handler';
import authService from '@service/auth.service';
import TokenService from '@service/token.service';

const SignUpScreen = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [checkingToken, setCheckingToken] = useState(true);

  async function checkUserToken() {
    setCheckingToken(true);
    const token = await TokenService.getToken();
    setCheckingToken(false);
    if (token) router.replace('/(main)');
  }

  async function onFinish(value: CreateUser) {
    setLoading(true);

    const [_, err] = await authService.signUp(value);

    if (err) {
      alertError(err);
    } else {
      Alert.alert('Вы успешно зарегистрировались', 'Дождитесь подтверждения');
    }

    setLoading(false);
  }

  useLayoutEffect(() => {
    checkUserToken();
  }, []);

  return (
    !checkingToken && (
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
              <Link replace href="/(auth)" style={styles.link}>
                Войти
              </Link>
            </Text>
          </View>
        </View>
      </SafeAreaView>
    )
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
    color: blue[5],
  },
});

export default SignUpScreen;
