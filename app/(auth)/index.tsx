import type { SignIn } from '@type/auth.type';

import { Form, Input } from '@ant-design/react-native';
import Button from '@commonComponent/button';
import InputPassword from '@commonComponent/input/input-password';
import WingBlank from '@commonComponent/wing-blank';
import { Link, useRouter } from 'expo-router';
import { useLayoutEffect, useState } from 'react';
import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { authScreenStyles, formStyles } from '@constant/styles';
import { alertError } from '@helper/error-handler';
import authService from '@service/auth.service';
import TokenService from '@service/token.service';

const SignInScreen = () => {
  const [form] = Form.useForm();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [checkingToken, setCheckingToken] = useState(true);

  async function checkUserToken() {
    setCheckingToken(true);
    const token = await TokenService.getToken();
    setCheckingToken(false);
    if (token) router.replace('/(main)');
  }

  async function onFinish(value: SignIn) {
    setLoading(true);

    const [token, err] = await authService.signIn(value);

    if (err) {
      alertError(err);
      setLoading(false);
      return;
    }

    await TokenService.setToken(token);

    setLoading(false);

    router.replace('/(main)');
  }

  useLayoutEffect(() => {
    checkUserToken();
  }, []);

  return (
    !checkingToken && (
      <SafeAreaView style={authScreenStyles.screen}>
        <WingBlank style={authScreenStyles.form_wrapper}>
          <Form form={form} onFinish={onFinish} styles={formStyles(true)}>
            <Form.Item name="username" rules={[{ required: true, message: 'Введите логин' }]}>
              <Input placeholder="Логин"></Input>
            </Form.Item>

            <Form.Item name="password" rules={[{ required: true, message: 'Введите пароль' }]}>
              <InputPassword />
            </Form.Item>

            <Form.Item>
              <Button title="Войти" onPress={form.submit} loading={loading} />
            </Form.Item>
          </Form>

          <WingBlank>
            <Text>
              Нет аккаунта?{' '}
              <Link replace href="/(auth)/sign-up" style={authScreenStyles.link}>
                Зарегистрироваться
              </Link>
            </Text>
          </WingBlank>
        </WingBlank>
      </SafeAreaView>
    )
  );
};

export default SignInScreen;
