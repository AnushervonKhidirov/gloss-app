import type { FC } from 'react';

import { useEffect, useState } from 'react';

import { Form, Input, List } from '@ant-design/react-native';
import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import InputSearch from './input-search';

import { grey } from '@constant/theme';

type AutocompleteProps = {
  items: AutocompleteItem[];
  placeholder?: string;
  name: string;
  getBy?: 'id' | 'value';
  defaultSelected?: AutocompleteItem;
  onSelect?: (item?: AutocompleteItem) => void;
};

type AutocompleteItem = { id: number; value: string };

const Autocomplete: FC<AutocompleteProps> = ({
  items,
  placeholder,
  name,
  getBy = 'id',
  defaultSelected,
  onSelect,
}) => {
  const form = Form.useFormInstance();
  const [opened, setOpened] = useState(false);

  const [originalInputValue, setOriginalInputValue] = useState('');
  const [inputValue, setInputValue] = useState('');

  const [selected, setSelected] = useState<AutocompleteItem | undefined>(defaultSelected);
  const [filteredList, setFilteredList] = useState<AutocompleteItem[]>(items);

  function inputHandler(value: string) {
    const filtered = find(value);

    setInputValue(value);
    setFilteredList(filtered);
    if (filtered.length > 1 || filtered.length === 0) clearSelected();
  }

  function select(item?: AutocompleteItem) {
    if (item) setInputValue(item.value);
    setSelected(item);
    setOpened(false);
  }

  function clearSelected() {
    setSelected(undefined);
  }

  function find(value: string) {
    return items.filter(item =>
      item.value.trim().toLocaleLowerCase().includes(value.trim().toLocaleLowerCase()),
    );
  }

  useEffect(() => {
    const value = getBy === 'id' ? selected?.id : selected?.value;
    setOriginalInputValue(selected?.value ?? '');
    form.setFieldValue(name, value);

    if (onSelect) onSelect(selected);
  }, [selected]);

  return (
    <>
      <Pressable onPress={() => setOpened(true)}>
        <Input value={originalInputValue} placeholder={placeholder} disabled />
      </Pressable>

      <Modal
        visible={opened}
        transparent
        onRequestClose={() => setOpened(false)}
        animationType="fade"
      >
        <View style={styles.wrapper}>
          <View style={styles.content}>
            <InputSearch value={inputValue} placeholder={placeholder} onChangeText={inputHandler} />

            <ScrollView style={styles.scroller}>
              <List>
                {filteredList.map(item => (
                  <Pressable key={item.id + item.value} onPress={() => select(item)}>
                    <List.Item>{item.value}</List.Item>
                  </Pressable>
                ))}
              </List>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flex: 1,
    justifyContent: 'flex-end',
  },
  content: {
    backgroundColor: '#fff',
    paddingInline: 20,
    paddingBlock: 30,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    gap: 20,
  },
  scroller: {
    overflow: 'hidden',
    minHeight: 45,
    maxHeight: 180,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: grey[4],
    borderRadius: 10,
  },
});

export default Autocomplete;
