import type { FC } from 'react';

import { Form, Input, List } from '@ant-design/react-native';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Keyboard, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Portal } from 'react-native-paper';

type AutoSelectProps = {
  items: AutoSelectItem[];
  placeholder?: string;
  name: string;
  getBy?: 'id' | 'value';
  defaultSelected?: AutoSelectItem;
  onSelect?: (item: AutoSelectItem | null) => void;
};

type Coordinates = {
  x: number;
  y: number;
  width: number;
  height: number;
  pageX: number;
  pageY: number;
};

type AutoSelectItem = { id: number; value: string };

const AutoSelect: FC<AutoSelectProps> = ({
  items,
  placeholder,
  name,
  getBy = 'id',
  defaultSelected = null,
  onSelect,
}) => {
  const wrapperRef = useRef<View>(null);
  const scrollerRef = useRef<View>(null);

  const [show, setShow] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);
  const [listFocused, setListFocused] = useState(false);
  const listFocusTimeout = useRef<number>(null);

  const [inputValue, setInputValue] = useState('');

  const [selected, setSelected] = useState<AutoSelectItem | null>(defaultSelected);
  const [filteredList, setFilteredList] = useState<AutoSelectItem[]>(items);

  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [scrollCoordinates, setScrollCoordinates] = useState<Coordinates | null>(null);

  const form = Form.useFormInstance();

  function select(item: AutoSelectItem | null) {
    setSelected(item);

    if (item) {
      const value = getBy === 'id' ? item.id : item.value;
      form.setFieldValue(name, value);
      setInputValue(item.value);
    } else {
      form.setFieldValue(name, undefined);
    }

    if (onSelect) onSelect(item);

    setShow(false);
  }

  function find(value: string) {
    const filtered = items.filter(item =>
      item.value.toLocaleLowerCase().includes(value.toLocaleLowerCase()),
    );
    setFilteredList(filtered);
  }

  function getCoordinates() {
    wrapperRef.current?.measure((x, y, width, height, pageX, pageY) => {
      setCoordinates({ x, y, width, height, pageX, pageY });
    });

    scrollerRef.current?.measure((x, y, width, height, pageX, pageY) => {
      setScrollCoordinates({ x, y, width, height, pageX, pageY });
    });
  }

  function inputValueHandler(e: any) {
    const value = e.target.value;
    setInputValue(value);
    find(value);

    if (value === '') setSelected(null);
  }

  useLayoutEffect(() => {
    getCoordinates();

    const showSubscriber = Keyboard.addListener('keyboardDidShow', getCoordinates);
    const hideSubscriber = Keyboard.addListener('keyboardDidHide', getCoordinates);

    return () => {
      showSubscriber.remove();
      hideSubscriber.remove();
    };
  }, []);

  useEffect(() => {
    setTimeout(getCoordinates, 0);
  }, [filteredList]);

  useEffect(() => {
    const shouldShowList = inputFocused || listFocused;

    setShow(shouldShowList);

    if (selected) setInputValue(selected.value);
  }, [inputFocused, listFocused]);

  return (
    <View style={styles.wrapper} ref={wrapperRef}>
      <Input
        value={inputValue}
        placeholder={placeholder}
        onFocus={() => setInputFocused(true)}
        onBlur={() => setInputFocused(false)}
        onChange={inputValueHandler}
      />

      {show && (
        <Portal>
          <View
            ref={scrollerRef}
            style={{
              ...styles.list,
              top:
                coordinates && scrollCoordinates ? coordinates.pageY - scrollCoordinates.height : 0,
            }}
          >
            <ScrollView
              onScroll={() => {
                if (listFocusTimeout.current) clearTimeout(listFocusTimeout.current);
                listFocusTimeout.current = setTimeout(() => setListFocused(false), 1500);
              }}
            >
              <List
                onTouchStart={() => {
                  setListFocused(true);
                  if (listFocusTimeout.current) clearTimeout(listFocusTimeout.current);
                  listFocusTimeout.current = setTimeout(() => setListFocused(false), 1000);
                }}
              >
                {filteredList.map(item => (
                  <List.Item key={item.id + item.value}>
                    <Pressable onPress={() => select(item)}>{item.value}</Pressable>
                  </List.Item>
                ))}
              </List>
            </ScrollView>
          </View>
        </Portal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
  },
  list: {
    maxHeight: 100,
    backgroundColor: '#fff',
    boxShadow: '0 0 5px #ccc',
    borderRadius: 10,
  },
});

export default AutoSelect;
