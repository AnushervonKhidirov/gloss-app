import type { SignIn } from '@type/auth.type';

import { Button, Form, Input } from '@ant-design/react-native';
import InputPassword from '@commonComponent/input/input-password';
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import authService from '@service/auth.service';
import TokenService from '@service/token.service';
import userService from '@service/user.service';
import useUserStore from '@store/user.store';

const SignInScreen = () => {
  const [form] = Form.useForm();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const setUser = useUserStore(state => state.setUser);

  async function onFinish(value: SignIn) {
    setLoading(true);

    const [token, err] = await authService.signIn(value);

    if (err) {
      Alert.alert(err.error, err.message);
      setLoading(false);
      return;
    }

    await TokenService.setToken(token);

    const [user, userErr] = await userService.findMe();

    if (userErr) {
      Alert.alert(userErr.error, userErr.message);
      setLoading(false);
      return;
    }

    setUser(user);
    setLoading(false);

    router.replace('/private');
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
