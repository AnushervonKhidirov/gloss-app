import type { FC, PropsWithChildren } from 'react';

import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Modal as NativeModal, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { grey } from '@constant/theme';

type ModalProps = PropsWithChildren<{
  title: string;
  isOpen: boolean;
  close: () => void;
}>;

const Modal: FC<ModalProps> = ({ title, isOpen, close, children }) => {
  return (
    <NativeModal visible={isOpen} animationType="slide" onRequestClose={close}>
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.container}>
            <View style={styles.header}>
              <Text style={styles.title}>{title}</Text>

              <Pressable style={styles.closeIcon} onPress={close}>
                <MaterialCommunityIcons name="window-close" size={30} color={grey[9]} />
              </Pressable>
            </View>

            <View style={styles.content}>{children}</View>
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    </NativeModal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingInline: 20,
    paddingBottom: 16,
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
