import type { Specialty } from '@type/specialty.type';

import { create } from 'zustand';

type SpecialtyState = {
  specialties: Specialty[];
};

type SpecialtyActions = {
  setCategories: (specialties: Specialty[]) => void;
  pushCategories: (specialties: Specialty[]) => void;
  editSpecialty: (specialty: Specialty) => void;
  deleteSpecialty: (specialty: Specialty) => void;
};

const useSpecialtyStore = create<SpecialtyState & SpecialtyActions>(set => ({
  specialties: [],

  setCategories: specialties => set(() => ({ specialties })),

  pushCategories: newCategories =>
    set(state => ({ specialties: [...state.specialties, ...newCategories] })),

  editSpecialty: editedSpecialty =>
    set(state => {
      return {
        specialties: state.specialties.map(specialty =>
          specialty.id === editedSpecialty.id ? editedSpecialty : specialty,
        ),
      };
    }),

  deleteSpecialty: deletedSpecialty =>
    set(state => {
      return {
        specialties: state.specialties.filter(specialty => specialty.id !== deletedSpecialty.id),
      };
    }),
}));

export default useSpecialtyStore;
