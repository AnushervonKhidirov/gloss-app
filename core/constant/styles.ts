import { ListStyle } from '@ant-design/react-native/lib/list/style';
import { StyleSheet } from 'react-native';
import { blue, grey } from './theme';

export const authScreenStyles = StyleSheet.create({
  screen: {
    flex: 1,
  },

  form_wrapper: {
    flex: 1,
    justifyContent: 'center',
    gap: 20,
  },

  link: {
    color: blue[5],
  },
});

export const formStyles = (asCard?: boolean) => {
  const styles: Partial<ListStyle> = {
    Body: {
      borderTopWidth: 0,
      borderBottomWidth: 0,
    },
    BodyBottomLine: {
      opacity: 0,
    },
    Footer: {
      borderBottomWidth: 0,
      borderTopWidth: 0,
    },
  };

  if (asCard) {
    styles.List = {
      paddingBlock: 20,
      backgroundColor: '#fff',
      borderWidth: 1,
      borderColor: grey[2],
      borderRadius: 5,
    };
  }

  return styles;
};
