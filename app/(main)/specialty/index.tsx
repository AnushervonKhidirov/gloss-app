import type { Specialty } from '@type/specialty.type';

import specialtyService from '@service/specialty.service';
import useSpecialtyStore from '@store/specialty.store';
import useUserStore from '@store/user.store';
import { Role } from '@type/user.type';
import { useLayoutEffect, useState } from 'react';

import { Button } from '@ant-design/react-native';
import LoadingView from '@commonComponent/loading-view';
import Modal from '@commonComponent/modal';
import CreateSpecialtyForm from '@component/specialty/form/create-specialty-form';
import EditSpecialtyForm from '@component/specialty/form/edit-specialty-form';
import SpecialtyList from '@component/specialty/specialty-list';
import { Alert } from 'react-native';

import { alertError } from '@helper/error-handler';

const SpecialtyScreen = () => {
  const user = useUserStore(state => state.user);
  const { specialties, pushCategories, editSpecialty, deleteSpecialty, setCategories } =
    useSpecialtyStore(state => state);

  const [loading, setLoading] = useState(false);

  const [toEdit, setToEdit] = useState<Specialty | null>(null);
  const [createSpecialtyModalVisible, setCreateSpecialtyModalVisible] = useState(false);
  const [editSpecialtyModalVisible, setEditSpecialtyModalVisible] = useState(false);

  function push(specialty: Specialty) {
    pushCategories([specialty]);
    setCreateSpecialtyModalVisible(false);
  }

  function edit(specialty: Specialty) {
    editSpecialty(specialty);
    setEditSpecialtyModalVisible(false);
  }

  function openEditServiceModal(specialty: Specialty) {
    setToEdit(specialty);
    setEditSpecialtyModalVisible(true);
  }

  function removeConfirm(specialty: Specialty) {
    Alert.alert('Удаление', `Удалить ${specialty.name}?\n\nПосле удаления нельзя восстановить!`, [
      {
        text: 'Да',
        onPress: () => remove(specialty),
      },
      {
        text: 'Нет',
      },
    ]);
  }

  async function remove(specialty: Specialty) {
    const [removedService, err] = await specialtyService.delete(specialty.id);

    if (err) {
      alertError(err);
    } else {
      deleteSpecialty(removedService);
    }
  }

  async function fetchOnLoad() {
    setLoading(true);
    await fetch();
    setLoading(false);
  }

  async function fetch() {
    const [specialties, err] = await specialtyService.findMany();

    if (err) {
      alertError(err);
    } else {
      setCategories(specialties);
    }
  }

  useLayoutEffect(() => {
    fetchOnLoad();
  }, []);

  return (
    <LoadingView loading={loading}>
      <SpecialtyList
        specialties={specialties}
        refresh={fetch}
        onEdit={user?.role === Role.ADMIN ? openEditServiceModal : undefined}
        onRemove={user?.role === Role.ADMIN ? removeConfirm : undefined}
      >
        {user?.role === Role.ADMIN && (
          <Button type="primary" onPress={() => setCreateSpecialtyModalVisible(true)}>
            Создать специальность
          </Button>
        )}
      </SpecialtyList>

      <Modal
        title="Создание категории"
        isOpen={createSpecialtyModalVisible}
        close={() => setCreateSpecialtyModalVisible(false)}
      >
        <CreateSpecialtyForm onSuccess={push} />
      </Modal>

      <Modal
        title="Редактирование категории"
        isOpen={editSpecialtyModalVisible}
        close={() => setEditSpecialtyModalVisible(false)}
      >
        <EditSpecialtyForm specialtyToEdit={toEdit} onSuccess={edit} />
      </Modal>
    </LoadingView>
  );
};

export default SpecialtyScreen;
