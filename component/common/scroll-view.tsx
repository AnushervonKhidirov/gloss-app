import type { PropsWithChildren, ReactElement, ReactNode } from 'react';
import type { ViewStyle } from 'react-native';

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
        <Input
          styles={{ container: styles.inputContainer, input: styles.input as ViewStyle }}
          onChangeText={filtering}
          placeholder="Поиск"
        />
      )}

      <NativeScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        style={{ flex: 1, paddingRight: 10, marginRight: -10 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}
      >
        {items.length === 0 ? (
          <Text style={styles.emptyText}>{emptyMessage}</Text>
        ) : (
          <View style={{ gap: 10, flex: 1 }}>{filteredItems.map(item => renderItem(item))}</View>
        )}
      </NativeScrollView>

      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    borderWidth: StyleSheet.hairlineWidth,
    paddingBlock: 5,
    paddingInline: 20,
    backgroundColor: '#fff',
    borderColor: gray[0],
    borderRadius: 100,
    overflow: 'hidden',
  },

  input: {
    fontSize: 16,
    color: gray.primary,
  },
  emptyText: {
    textAlign: 'center',
    color: gray[3],
    fontSize: 20,
    fontWeight: 700,
  },
});

export default ScrollView;
