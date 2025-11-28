import type { User } from '@type/user.type';
import { useState, type ComponentProps, type FC, type PropsWithChildren } from 'react';

import { Button, Card } from '@ant-design/react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import useUserStore from '@store/user.store';
import { Role } from '@type/user.type';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';

import { gray, green, orange, red } from '@ant-design/colors';
import { scrollerTabMarginBottom } from '@constant/scroller';

type WorkerListProps = PropsWithChildren<{
  workers: User[];
  emptyMessage?: string;
  onRefresh: () => Promise<void>;
  approve: (user: User) => Promise<void>;
  archive: (user: User) => Promise<void>;
  unarchive: (user: User) => Promise<void>;
}>;

type WorkerItemProps = {
  worker: User;
  approve: (user: User) => Promise<void>;
  archive: (user: User) => Promise<void>;
  unarchive: (user: User) => Promise<void>;
};

type WorkerItemHeaderTextProps = {
  name: string;
  role: Role;
};

type WorkerActionButtonsProps = {
  worker: User;
  approve: (user: User) => Promise<void>;
  archive: (user: User) => Promise<void>;
  unarchive: (user: User) => Promise<void>;
};

const WorkerList: FC<WorkerListProps> = ({
  workers,
  emptyMessage,
  onRefresh,
  approve,
  archive,
  unarchive,
  children,
}) => {
  const message = emptyMessage ?? 'У вас пока нет работников';

  const [refreshing, setRefreshing] = useState(false);

  async function refresh() {
    setRefreshing(true);
    await onRefresh();
    setRefreshing(false);
  }

  return (
    <View style={styles.container}>
      {children}

      <ScrollView
        style={{ marginBottom: scrollerTabMarginBottom }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refresh} />
        }
      >
        <View style={styles.list}>
          {workers.length > 0 ? (
            workers.map(worker => (
              <WorkerItem
                key={worker.id}
                worker={worker}
                approve={approve}
                archive={archive}
                unarchive={unarchive}
              />
            ))
          ) : (
            <Text>{message}</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const WorkerItem: FC<WorkerItemProps> = ({ worker, approve, archive, unarchive }) => {
  const icons: {
    [key in 'verified' | 'notVerified' | 'archived']: {
      name: ComponentProps<typeof MaterialCommunityIcons>['name'];
      color: string;
    };
  } = {
    verified: { name: 'account-check', color: green.primary! },
    notVerified: { name: 'account-clock', color: orange[3] },
    archived: { name: 'account-cancel', color: red.primary! },
  };

  let icon = icons.notVerified;
  if (worker.verified) icon = icons.verified;
  if (worker.archived) icon = icons.archived;

  return (
    <Card>
      <Card.Header
        title={<WorkerItemHeaderText name={worker.firstName} role={worker.role} />}
        extra={
          <View style={{ alignSelf: 'flex-end' }}>
            <MaterialCommunityIcons name={icon.name} size={25} color={icon.color} />
          </View>
        }
      />
      <Card.Footer
        content={
          <WorkerActionButtons
            worker={worker}
            approve={approve}
            archive={archive}
            unarchive={unarchive}
          />
        }
      />
    </Card>
  );
};

const WorkerItemHeaderText: FC<WorkerItemHeaderTextProps> = ({ name, role }) => {
  return (
    <View>
      <Text style={{ fontSize: 17 }}>{name}</Text>
      <Text style={{ color: gray[2] }}>{role}</Text>
    </View>
  );
};

const WorkerActionButtons: FC<WorkerActionButtonsProps> = ({
  worker,
  approve,
  archive,
  unarchive,
}) => {
  const user = useUserStore(state => state.user);

  return user?.role === Role.ADMIN && worker.role === Role.WORKER ? (
    <View style={styles.actionButtonsWrapper}>
      {worker.archived ? (
        <Button type="primary" size="small" onPress={() => unarchive(worker)}>
          Восстановить
        </Button>
      ) : (
        <Button type="warning" size="small" onPress={() => archive(worker)}>
          Уволить нахуй!
        </Button>
      )}

      {!worker.verified && (
        <Button
          type="primary"
          style={{ backgroundColor: green.primary, borderColor: green.primary }}
          size="small"
          onPress={() => approve(worker)}
        >
          Подтвертидь
        </Button>
      )}
    </View>
  ) : (
    <View />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 20,
    flexDirection: 'column',
    boxSizing: 'border-box',
  },
  list: {
    gap: 10,
    flex: 1,
  },
  actionButtonsWrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
});

export default WorkerList;
