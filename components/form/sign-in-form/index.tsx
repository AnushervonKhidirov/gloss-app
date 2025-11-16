import { Button, Form, Input } from '@ant-design/react-native';
import InputPassword from '@components/input/input-password';
import { AuthService } from '@services/auth.service';
import { SignIn } from '@type/auth.type';
import { useState } from 'react';

const authService = new AuthService();

const SignInForm = () => {
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
  );
};

export default SignInForm;
