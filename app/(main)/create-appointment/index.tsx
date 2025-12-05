import useCreateAppointmentStore from '@store/create-appointment.store';

import { Button } from '@ant-design/react-native';
import { useFocusEffect } from 'expo-router';
import { View } from 'react-native';

import BookAppointmentSection from '@component/create-appointment/section/book-appointment.section';
import SelectServiceSection from '@component/create-appointment/section/select-service-section';
import SelectWorkerSection from '@component/create-appointment/section/select-worker-section';

const CreateAppointmentScreen = () => {
  const { step, selectedService, selectedTime, selectedWorker, prevStep, nextStep, reset } =
    useCreateAppointmentStore(state => state);

  function prev() {
    if (isPossibleToPrevStep()) prevStep();
  }

  function next() {
    if (isPossibleToNextStep()) nextStep();
  }

  function isPossibleToNextStep() {
    if (step === 0 && selectedService) return true;
    if (step === 1 && selectedWorker && selectedTime) return true;
    return false;
  }

  function isPossibleToPrevStep() {
    return step > 0;
  }

  useFocusEffect(() => {
    reset();

    return () => {
      reset();
    };
  });

  return (
    <View style={{ gap: 16, flex: 1 }}>
      <View style={{ flex: 1 }}>
        {step === 0 && <SelectServiceSection />}
        {step === 1 && <SelectWorkerSection />}
        {step === 2 && <BookAppointmentSection />}
      </View>

      <View style={{ flexDirection: 'row', gap: 10 }}>
        <Button
          type="primary"
          style={{ flex: 1 }}
          onPress={prev}
          disabled={!isPossibleToPrevStep()}
        >
          Назад
        </Button>
        <Button
          type="primary"
          style={{ flex: 1 }}
          onPress={next}
          disabled={!isPossibleToNextStep()}
        >
          Вперед
        </Button>
      </View>
    </View>
  );
};

export default CreateAppointmentScreen;
