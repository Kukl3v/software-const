package ru.kukl33v.server.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import ru.kukl33v.server.configuration.MapperConfiguration;
import ru.kukl33v.server.domain.Club;
import ru.kukl33v.server.domain.Service;
import ru.kukl33v.server.dto.ClubDTO;
import ru.kukl33v.server.dto.ServiceDTO;

@Mapper(config = MapperConfiguration.class)
public interface ServiceMapper {

    ServiceDTO toDTO(Service service);

    Service toService(ServiceDTO DTO);

    @Mapping(target = "id", ignore = true)
    void updateServiceFromDTO(ServiceDTO DTO, @MappingTarget Service service);
}
