import { Form, Input } from '@ant-design/react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

const InputPassword = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);

  const form = Form.useFormInstance();
  const passwordValue = Form.useWatch('password', form);

  const handleChange = (text: string) => {
    form.setFieldValue('password', text);
  };

  function passwordVisibilityHandler() {
    setPasswordVisible(!passwordVisible);
  }

  return (
    <View style={style.container}>
      <Input
        type={passwordVisible ? 'text' : 'password'}
        style={style.input}
        placeholder="Пароль"
        value={passwordValue}
        onChangeText={handleChange}
      ></Input>
      <AntDesign
        style={style.icon}
        name={passwordVisible ? 'eye-invisible' : 'eye'}
        size={24}
        color="#ccc"
        onPress={passwordVisibilityHandler}
      />
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },

  input: {
    flex: 1,
  },

  icon: {
    alignSelf: 'center',
  },
});

export default InputPassword;
