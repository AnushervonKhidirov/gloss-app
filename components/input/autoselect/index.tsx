import type { FC } from 'react';

import { useLayoutEffect, useRef, useState } from 'react';

import { Input, List } from '@ant-design/react-native';
import { Keyboard, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Portal } from 'react-native-paper';

type AutoSelectProps = {
  items: AutoSelectItem[];
  placeholder?: string;
  defaultSelected?: AutoSelectItem;
  onSelect?: (item: AutoSelectItem) => void;
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
  defaultSelected = null,
  onSelect,
}) => {
  const wrapperRef = useRef<View>(null);
  const scrollerRef = useRef<View>(null);

  const [show, setShow] = useState(false);
  const [selected, setSelected] = useState<AutoSelectItem | null>(defaultSelected);
  const [filteredList, setFilteredList] = useState<AutoSelectItem[]>(items);

  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [scrollCoordinates, setScrollCoordinates] = useState<Coordinates | null>(null);

  function select(item: AutoSelectItem) {
    setSelected(item);
    if (onSelect) onSelect(item);
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

  useLayoutEffect(() => {
    getCoordinates();

    const showSubscriber = Keyboard.addListener('keyboardDidShow', getCoordinates);
    const hideSubscriber = Keyboard.addListener('keyboardDidHide', getCoordinates);

    return () => {
      showSubscriber.remove();
      hideSubscriber.remove();
    };
  }, []);

  return (
    <View style={styles.wrapper} ref={wrapperRef}>
      <Input
        value={selected?.value}
        placeholder={placeholder}
        onChangeText={find}
        onFocus={() => setShow(true)}
        onBlur={() => setShow(false)}
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
            <ScrollView>
              <List>
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
