import type { User } from '@type/user.type';

import { create } from 'zustand';

type UserState = {
  user: User | null;
  setUser: (user: User) => void;
  removeUser: () => void;
};

const useUserStore = create<UserState>(set => ({
  user: null,
  setUser: user => set(() => ({ user })),
  removeUser: () => set(() => ({ user: null })),
}));

export default useUserStore;
