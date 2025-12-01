import type { PropsWithChildren, ReactElement, ReactNode } from 'react';

import { gray } from '@ant-design/colors';
import { Input } from '@ant-design/react-native';

import { useEffect, useState } from 'react';
import {
  ScrollView as NativeScrollView,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { search } from '@helper/search';

type ScrollViewProps<T> = PropsWithChildren<{
  items: T[];
  renderItem: (item: T) => ReactNode;
  onRefresh: () => Promise<void>;
  searchable?: boolean;
  emptyMessage?: string;
}>;

const ScrollView = <T extends {}>({
  items,
  renderItem,
  onRefresh,
  searchable,
  emptyMessage = 'Пусто',
  children,
}: ScrollViewProps<T>): ReactElement => {
  const [refreshing, setRefreshing] = useState(false);
  const [filteredItems, setFilteredItems] = useState<T[]>(items);

  function filtering(inputValue: string) {
    if (inputValue.trim() === '') return setFilteredItems(items);

    const filteredItems = items.filter(item => search(item, inputValue));

    setFilteredItems(filteredItems);
  }

  async function refresh() {
    setRefreshing(true);
    await onRefresh();
    setRefreshing(false);
  }

  useEffect(() => {
    setFilteredItems(items);
  }, [items]);

  return (
    <View style={{ flex: 1, gap: 16 }}>
      {searchable && items.length > 0 && (
        <Input styles={{ input: styles.input }} onChangeText={filtering} placeholder="Поиск" />
      )}

      <NativeScrollView
        style={{ flex: 1, paddingRight: 10, marginRight: -10 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}
      >
        {items.length === 0 ? (
          <View style={styles.emptyTextWrap}>
            <Text style={styles.emptyText}>{emptyMessage}</Text>
          </View>
        ) : (
          <View style={{ gap: 10, flex: 1 }}>{filteredItems.map(item => renderItem(item))}</View>
        )}
      </NativeScrollView>

      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: StyleSheet.hairlineWidth,
    paddingBlock: 7,
    backgroundColor: '#fff',
    borderColor: gray[0],
    borderRadius: 4,
    fontSize: 14,
    color: gray.primary,
  },
  emptyTextWrap: {
  },
  emptyText: {
    textAlign: 'center',
  },
});

export default ScrollView;
