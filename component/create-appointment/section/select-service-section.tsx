import useCreateAppointmentStore from '@store/create-appointment.store';
import useServiceStore from '@store/service.store';
import { useEffect, useState } from 'react';

import LoadingView from '@commonComponent/loading-view';
import ScrollView from '@commonComponent/scroll-view';
import ServiceCard from '@component/service/service-card';

import { alertError } from '@helper/error-handler';
import serviceService from '@service/service.service';

const SelectServiceSection = () => {
  const { services, setServices } = useServiceStore(state => state);
  const { selectedService, setSelectedService } = useCreateAppointmentStore(state => state);

  const [loading, setLoading] = useState(false);

  async function fetchOnLoad() {
    setLoading(true);
    await fetchServices();
    setLoading(false);
  }

  async function fetchServices() {
    setSelectedService(undefined);
    const [services, err] = await serviceService.findMany();

    if (err) {
      alertError(err);
    } else {
      setServices({ services: services });
    }
  }

  useEffect(() => {
    if (services.length === 0) fetchOnLoad();
  }, []);

  return (
    <LoadingView loading={loading}>
      <ScrollView
        searchable
        onRefresh={fetchServices}
        items={services}
        renderItem={service => (
          <ServiceCard
            key={'create-appointment-service' + service.id}
            service={service}
            selected={selectedService}
            onSelect={setSelectedService}
          />
        )}
      />
    </LoadingView>
  );
};

export default SelectServiceSection;
