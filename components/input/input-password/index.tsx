import { Form, Input } from '@ant-design/react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useState } from 'react';

const InputPassword = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);

  function passwordVisibilityHandler() {
    setPasswordVisible(!passwordVisible);
  }

  return (
    <Form.Item
      name="password"
      rules={[{ required: true, message: 'Введите пароль' }]}
      extra={
        <AntDesign
          style={{ justifyContent: 'center' }}
          name={passwordVisible ? 'eye-invisible' : 'eye'}
          size={24}
          color="#ccc"
          onPress={passwordVisibilityHandler}
        />
      }
    >
      <Input type={passwordVisible ? 'text' : 'password'} placeholder="Пароль"></Input>
    </Form.Item>
  );
};

export default InputPassword;
