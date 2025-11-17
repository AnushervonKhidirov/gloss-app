import type { FC, PropsWithChildren } from 'react';

import AntDesign from '@expo/vector-icons/AntDesign';
import { Modal as NativeModal, Pressable, StyleSheet, Text, View } from 'react-native';

type ModalProps = PropsWithChildren<{
  title: string;
  isOpen: boolean;
  close: () => void;
}>;

const Modal: FC<ModalProps> = ({ title, isOpen, close, children }) => {
  return (
    <NativeModal visible={isOpen} animationType="slide">
      <View style={style.header}>
        <Text style={style.title}>{title}</Text>

        <Pressable style={style.closeIcon} onPress={close}>
          <AntDesign name="close" size={24} color="black" />
        </Pressable>
      </View>

      <View style={style.content}>{children}</View>
    </NativeModal>
  );
};

const style = StyleSheet.create({
  header: {
    marginBlock: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },

  title: {
    flex: 1,
    paddingLeft: 20,
    fontSize: 20,
    fontWeight: 700,
  },

  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },

  closeIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 5,
    marginRight: 15,
  },
});

export default Modal;
