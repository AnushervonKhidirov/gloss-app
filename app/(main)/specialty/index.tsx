import type { Specialty } from '@type/specialty.type';

import specialtyService from '@service/specialty.service';
import useSpecialtyStore from '@store/specialty.store';
import useUserStore from '@store/user.store';
import { Role } from '@type/user.type';
import { useLayoutEffect, useState } from 'react';

import Button from '@commonComponent/button';
import LoadingView from '@commonComponent/loading-view';
import Modal from '@commonComponent/modal';
import CreateSpecialtyForm from '@component/specialty/form/create-specialty-form';
import EditSpecialtyForm from '@component/specialty/form/edit-specialty-form';
import SpecialtyList from '@component/specialty/specialty-list';

import { alertError } from '@helper/error-handler';

const SpecialtyScreen = () => {
  const isAdmin = useUserStore(state => state.user?.role === Role.ADMIN);
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
        onEdit={openEditServiceModal}
        onRemove={remove}
      >
        {isAdmin && (
          <Button
            title="Создать специальность"
            onPress={() => setCreateSpecialtyModalVisible(true)}
          />
        )}
      </SpecialtyList>

      <Modal
        title="Создание специальности"
        isOpen={createSpecialtyModalVisible}
        close={() => setCreateSpecialtyModalVisible(false)}
      >
        <CreateSpecialtyForm onSuccess={push} />
      </Modal>

      <Modal
        title="Редактирование специальности"
        isOpen={editSpecialtyModalVisible}
        close={() => setEditSpecialtyModalVisible(false)}
      >
        <EditSpecialtyForm specialtyToEdit={toEdit} onSuccess={edit} />
      </Modal>
    </LoadingView>
  );
};

export default SpecialtyScreen;
