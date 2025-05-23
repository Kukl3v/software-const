package ru.kukl33v.server.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import ru.kukl33v.server.configuration.MapperConfiguration;
import ru.kukl33v.server.domain.Session;
import ru.kukl33v.server.dto.SessionDTO;

@Mapper(config = MapperConfiguration.class)
public interface SessionMapper {

    SessionDTO toDTO(Session session);

    Session toSession(SessionDTO DTO);

    @Mapping(target = "id", ignore = true)
    void updateSessionFromDTO(SessionDTO DTO, @MappingTarget Session session);
}
