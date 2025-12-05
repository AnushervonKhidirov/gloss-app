import { Role } from '@type/user.type';
import type { FC } from 'react';

import useUserStore from '@store/user.store';
import { useRouter } from 'expo-router';
import { useState } from 'react';

import { Button } from '@component/common';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';

import authService from '@service/auth.service';
import TokenService from '@service/token.service';
import userService from '@service/user.service';

import { grey } from '@constant/theme';
import { alertError } from '@helper/error-handler';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

function getRole(role: Role) {
  if (role === Role.ADMIN) return 'Администратор';
  if (role === Role.WORKER) return 'Сотрудник';
}

const ProfileScreen = () => {
  const router = useRouter();

  const { user, removeUser, setUser } = useUserStore(state => state);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);

  async function signOut() {
    setLoading(true);
    const token = await TokenService.getToken();
    if (token) await authService.signOut(token);

    await TokenService.removeToken();
    removeUser();
    setLoading(false);
    router.navigate('/(auth)');
  }

  async function refresh() {
    setRefreshing(true);

    const [user, err] = await userService.findMe();

    if (err) {
      alertError(err);
    } else {
      setUser(user);
    }

    setRefreshing(false);
  }

  return (
    user && (
      <View style={styles.profileWrap}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          style={{ flex: 1 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}
        >
          <View style={styles.profileContent}>
            <ListItem field="Имя" value={user.firstName} />
            <ListItem field="Фамилия" value={user.lastName} />
            <ListItem
              field="Телефон"
              value={parsePhoneNumberFromString(user.phone, 'TJ')?.formatNational()}
            />
            <ListItem field="Логин" value={user.username} />
            <ListItem field="Роль" value={getRole(user.role)} />
            <ListItem field="Специальность" value={user.specialty?.name} inRow />
          </View>
        </ScrollView>

        <View style={styles.actionButtonWrap}>
          <Button title="Сменить пароль" loading={loading} style={styles.actionButton} />
          <Button title="Редактировать" loading={loading} style={styles.actionButton} />
        </View>

        <Button title="Выйти" loading={loading} onPress={signOut} />
      </View>
    )
  );
};

const ListItem: FC<{ field: string; value?: string | null; inRow?: boolean }> = ({
  field,
  value,
  inRow,
}) => {
  return (
    <View style={{ flexDirection: inRow ? 'column' : 'row' }}>
      <Text style={{ flex: inRow ? 0 : 1, fontSize: 20 }}>
        {field}
        {!inRow && ':'}
      </Text>
      <Text style={{ fontSize: inRow ? 17 : 20, color: inRow ? grey[6] : undefined }}>
        {value ?? '—'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  profileWrap: {
    flex: 1,
    gap: 16,
  },

  profileContent: {
    flex: 1,
    gap: 10,
  },

  actionButtonWrap: {
    flexDirection: 'row',
    gap: 16,
  },

  actionButton: {
    flexGrow: 1,
  },

  listItem: {
    flexDirection: 'row',
  },
});

export default ProfileScreen;
