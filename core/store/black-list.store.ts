import type { BlackList } from '@type/client.type';
import { create } from 'zustand';

type BlackListState = {
  blackList: BlackList[];
};

type BlackListActions = {
  setBlackList: (blackList: BlackList[]) => void;
  pushBlackList: (blackList: BlackList[]) => void;
  deleteBlackList: (blackList: BlackList) => void;
};

const useBlackListStore = create<BlackListState & BlackListActions>(set => ({
  blackList: [],

  setBlackList: blackList => set(() => ({ blackList })),

  pushBlackList: newBlackList =>
    set(state => ({ blackList: [...state.blackList, ...newBlackList] })),


  deleteBlackList: deletedBlackList =>
    set(state => {
      return {
        blackList: state.blackList.filter(blackList => blackList.id !== deletedBlackList.id),
      };
    }),
}));

export default useBlackListStore;
