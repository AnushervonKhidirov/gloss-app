import { Form, Input } from '@ant-design/react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useState } from 'react';
import { View } from 'react-native';

import { grey } from '@constant/theme';

const InputPassword = () => {
  const [visible, setVisible] = useState(false);

  const form = Form.useFormInstance();
  const passwordValue = Form.useWatch('password', form);

  const handleChange = (text: string) => {
    form.setFieldValue('password', text);
  };

  return (
    <View style={{ flexDirection: 'row' }}>
      <Input
        type={visible ? 'text' : 'password'}
        style={{ flex: 1 }}
        placeholder="Пароль"
        value={passwordValue}
        onChangeText={handleChange}
      />

      <MaterialCommunityIcons
        style={{ alignSelf: 'center' }}
        name={visible ? 'eye-off-outline' : 'eye-outline'}
        size={24}
        color={grey[4]}
        onPress={() => setVisible(!visible)}
      />
    </View>
  );
};

export default InputPassword;
