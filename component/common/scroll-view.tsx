import type { ComponentProps, PropsWithChildren, ReactElement, ReactNode } from 'react';

import { useEffect, useState } from 'react';
import {
  ScrollView as NativeScrollView,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import InputSearch from './input/input-search';

import { grey } from '@constant/theme';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { search } from '@helper/search';

type ScrollViewProps<T> = PropsWithChildren<{
  items: T[];
  renderItem: (item: T) => ReactNode;
  onRefresh: () => Promise<void>;
  searchable?: boolean;
  searchIconName?: ComponentProps<typeof MaterialCommunityIcons>['name'];
  emptyMessage?: string;
}>;

const ScrollView = <T extends {}>({
  items,
  renderItem,
  onRefresh,
  searchable,
  searchIconName,
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
        <InputSearch searchIconName={searchIconName} onChangeText={filtering} />
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
    borderColor: grey[4],
    borderRadius: 100,
    overflow: 'hidden',
  },

  input: {
    fontSize: 16,
  },
  emptyText: {
    textAlign: 'center',
    color: grey[6],
    fontSize: 20,
    fontWeight: 700,
  },
});

export default ScrollView;
