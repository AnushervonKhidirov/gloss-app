import type { User } from '@type/user.type';

import { create } from 'zustand';

type UsersState = {
  users: User[];
  setUsers: (users: User[]) => void;
  updateUser: (user: User) => void;
  removeUser: (user: User) => void;
};

const useUsersStore = create<UsersState>(set => ({
  users: [],
  setUsers: users => set(() => ({ users })),
  updateUser: updatedUser =>
    set(state => {
      const newUserList = state.users.map(user =>
        user.id === updatedUser.id ? updatedUser : user,
      );
      return { users: newUserList };
    }),

  removeUser: userToRemove =>
    set(state => {
      const newUserList = state.users.filter(user => user.id !== userToRemove.id);
      return { users: newUserList };
    }),
}));

export default useUsersStore;
