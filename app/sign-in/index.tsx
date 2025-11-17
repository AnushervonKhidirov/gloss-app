import { Link } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Button, Form, Input } from '@ant-design/react-native';
import InputPassword from '@components/input/input-password';
import { AuthService } from '@services/auth.service';
import { SignIn } from '@type/auth.type';
import { useState } from 'react';

const authService = new AuthService();

const SignInScreen = () => {
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);

  async function onFinish(value: SignIn) {
    console.log(value);

    setLoading(true);

    const [token, err] = await authService.signIn(value);
    if (err) {
      console.log('err', err);
    } else {
      console.log('sign in', token);
      await AuthService.setToken(token);
    }

    setLoading(false);
  }

  return (
    <View style={styles.form_wrapper}>
      <Form form={form} onFinish={onFinish}>
        <Form.Item name="username" rules={[{ required: true, message: 'Введите логин' }]}>
          <Input placeholder="Логин"></Input>
        </Form.Item>

        <InputPassword />

        <Form.Item>
          <Button type="primary" onPress={form.submit} loading={loading}>
            Войти
          </Button>
        </Form.Item>
      </Form>

      <Link href="/sign-up">Sign up</Link>
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

export default SignInScreen;
