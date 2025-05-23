package ru.kukl33v.server.service;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.kukl33v.server.dto.ServiceDTO;
import ru.kukl33v.server.mapper.ServiceMapper;
import ru.kukl33v.server.repository.ServiceRepository;
import ru.kukl33v.server.validation.ValidatorUtil;
import ru.kukl33v.server.validation.exception.ServiceNotFoundException;

import java.util.List;
import java.util.UUID;

@Service
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ServiceService {
    ServiceRepository serviceRepository;
    ServiceMapper serviceMapper;
    ValidatorUtil validatorUtil;

    public List<ServiceDTO> getServiceList(Pageable pageable){
        Page<ru.kukl33v.server.domain.Service> services = serviceRepository.findAll(pageable);
        return services.stream().map(serviceMapper::toDTO).toList();
    }

    public ServiceDTO findService(UUID id) {
        return serviceRepository.findById(id)
                .map(serviceMapper::toDTO)
                .orElseThrow(() -> new ServiceNotFoundException(id));
    }

    @Transactional
    public void createService(ServiceDTO serviceDTO){
        ru.kukl33v.server.domain.Service service = serviceMapper.toService(serviceDTO);
        validatorUtil.validate(service);
        serviceRepository.save(service);
    }

    @Transactional
    public ServiceDTO updateService(ServiceDTO serviceDTO, UUID id) {
        ru.kukl33v.server.domain.Service service = serviceRepository.findById(id)
                .orElseThrow(() -> new ServiceNotFoundException(id));
        serviceMapper.updateServiceFromDTO(serviceDTO, service);
        return serviceMapper.toDTO(serviceRepository.save(service));
    }

    @Transactional
    public void deleteService(UUID id){
        ru.kukl33v.server.domain.Service service = serviceRepository.findById(id)
                .orElseThrow(() -> new ServiceNotFoundException(id));
        serviceRepository.delete(service);
    }
}
