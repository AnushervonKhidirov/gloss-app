import type { FC, PropsWithChildren } from 'react';

import AntDesign from '@expo/vector-icons/AntDesign';
import { Modal as NativeModal, Pressable, StyleSheet, Text, View } from 'react-native';
import { Provider } from 'react-native-paper';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

type ModalProps = PropsWithChildren<{
  title: string;
  isOpen: boolean;
  close: () => void;
}>;

const Modal: FC<ModalProps> = ({ title, isOpen, close, children }) => {
  return (
    <NativeModal visible={isOpen} animationType="slide">
      <Provider>
        <SafeAreaProvider>
          <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.container}>
              <View style={styles.header}>
                <Text style={styles.title}>{title}</Text>

                <Pressable style={styles.closeIcon} onPress={close}>
                  <AntDesign name="close" size={24} color="black" />
                </Pressable>
              </View>

              <View style={styles.content}>{children}</View>
            </View>
          </SafeAreaView>
        </SafeAreaProvider>
      </Provider>
    </NativeModal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingInline: 20,
  },

  header: {
    marginBlock: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },

  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: 700,
  },

  content: {
    flex: 1,
    justifyContent: 'center',
  },

  closeIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 5,
    marginRight: -5,
  },
});

export default Modal;
