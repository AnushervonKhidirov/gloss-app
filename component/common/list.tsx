import { grey } from '@constant/theme';
import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

import { StyleSheet, View } from 'react-native';

type ListProps<T> = {
  items: T[];
  renderItem: (item: T) => ReactNode;
  keyExtractor?: (item: T) => string;
  style?: StyleProp<ViewStyle>;
  styles?: {
    list?: StyleProp<ViewStyle>;
    listItem?: StyleProp<ViewStyle>;
    listItemBorder?: StyleProp<ViewStyle>;
  };
};

const List = <T extends {}>({
  items,
  renderItem,
  keyExtractor,
  style = {},
  styles = {
    list: {},
    listItemBorder: {},
  },
}: ListProps<T>) => {
  return (
    <View style={{ ...listStyle.list, ...(style as {}), ...(styles.list as {}) }}>
      {items.map((item, index) => {
        const key = keyExtractor ? keyExtractor(item) : Math.random().toString();
        return (
          <>
            {index !== 0 && (
              <View
                key={'border' + key}
                style={{
                  ...listStyle.listItemBorder,
                  ...(styles.listItemBorder as {}),
                }}
              />
            )}

            <View
              style={{
                ...listStyle.listItem,
                ...(styles.listItem as {}),
              }}
              key={key}
            >
              {renderItem(item)}
            </View>
          </>
        );
      })}
    </View>
  );
};

const listStyle = StyleSheet.create({
  list: {
    backgroundColor: '#fff',
  },

  listItem: {
    padding: 12,
  },

  listItemBorder: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: grey[2],
    marginInline: 20,
  },
});

export default List;
