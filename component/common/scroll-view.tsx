import type { FC, PropsWithChildren } from 'react';

import { useState } from 'react';
import { ScrollView as NativeScrollView, RefreshControl } from 'react-native';

type ScrollViewProps = PropsWithChildren<{
  onRefresh: () => Promise<void>;
}>;

const ScrollView: FC<ScrollViewProps> = ({ onRefresh, children }) => {
  const [refreshing, setRefreshing] = useState(false);

  async function refresh() {
    setRefreshing(true);
    await onRefresh();
    setRefreshing(false);
  }

  return (
    <NativeScrollView
      style={{ flex: 1, paddingRight: 10, marginRight: -10 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}
    >
      {children}
    </NativeScrollView>
  );
};

export default ScrollView;
