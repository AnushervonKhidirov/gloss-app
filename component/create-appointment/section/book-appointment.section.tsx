import useCreateAppointmentStore from '@store/create-appointment.store';

import { View } from 'react-native';
import BookAppointmentForm from '../book-appointment-form';
import CreatedAppointmentCard from '../created-appointment-card';

const BookAppointmentSection = () => {
  const { selectedWorker, selectedService, selectedTime } = useCreateAppointmentStore(
    state => state,
  );

  return (
    selectedWorker &&
    selectedService &&
    selectedTime && (
      <View style={{ flex: 1, gap: 16 }}>
        <CreatedAppointmentCard
          service={selectedService}
          worker={selectedWorker}
          time={selectedTime}
        />

        <BookAppointmentForm />
      </View>
    )
  );
};

export default BookAppointmentSection;
