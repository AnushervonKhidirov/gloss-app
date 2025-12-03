import type { ComponentProps, FC } from 'react';

import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Modal, Pressable, StyleSheet, Text } from 'react-native';

import { grey } from '@constant/theme';

type ActionButtonsModalProps = {
  actions: ActionButtonData[];
  visible: boolean;
  setVisible: (visible: boolean) => void;
};

export type ActionButtonData = {
  iconName: ComponentProps<typeof MaterialCommunityIcons>['name'];
  text: string;
  action: () => void;
};

const ActionButtonsModal: FC<ActionButtonsModalProps> = ({
  actions,
  visible = false,
  setVisible,
}) => {
  return (
    <>
      <Pressable onPress={() => setVisible(true)}>
        <MaterialCommunityIcons name="dots-vertical-circle" size={24} color={grey[9]} />
      </Pressable>

      <Modal
        transparent
        visible={visible}
        animationType="slide"
        onRequestClose={() => setVisible(false)}
      >
        <Pressable style={styles.wrapper} onPress={() => setVisible(false)}>
          <Pressable style={styles.content}>
            {actions.map(({ iconName, text, action }) => (
              <ActionButton key={iconName + text} iconName={iconName} text={text} action={action} />
            ))}
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
};

const ActionButton: FC<ActionButtonData> = ({ iconName, text, action }) => {
  return (
    <Pressable style={styles.button} onPress={action}>
      <MaterialCommunityIcons name={iconName} size={22} color={grey[9]} />
      <Text style={styles.buttonText}>{text}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flex: 1,
    justifyContent: 'flex-end',
  },

  content: {
    backgroundColor: grey[1],
    paddingInline: 20,
    paddingBlock: 30,
    borderRadius: 20,
    margin: 20,
    gap: 10,
  },

  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    paddingBlock: 5,
  },

  buttonText: {
    color: grey[9],
    fontSize: 18,
  },
});

export default ActionButtonsModal;
