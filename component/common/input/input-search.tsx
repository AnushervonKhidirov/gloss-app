import type { FC } from 'react';

import { Input } from '@ant-design/react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { StyleSheet, View, ViewStyle } from 'react-native';

import { grey } from '@constant/theme';

type InputSearchProps = {
  onChangeText: (value: string) => void;
  value?: string;
  placeholder?: string;
};

const InputSearch: FC<InputSearchProps> = ({ value, placeholder = 'Поиск', onChangeText }) => {
  return (
    <View style={styles.inputWrap}>
      <Input
        value={value}
        styles={{ container: styles.inputContainer, input: styles.input as ViewStyle }}
        onChangeText={onChangeText}
        placeholder={placeholder}
      />

      <MaterialCommunityIcons
        style={{ alignSelf: 'center' }}
        name="text-search-variant"
        size={24}
        color={grey[4]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputWrap: {
    borderWidth: 1,
    backgroundColor: '#fff',
    paddingRight: 10,
    borderColor: grey[2],
    borderRadius: 100,
    flexDirection: 'row',
    overflow: 'hidden',
  },

  inputContainer: {
    paddingBlock: 5,
    paddingInline: 10,
    flex: 1,
  },

  input: {
    fontSize: 16,
  },
});

export default InputSearch;
