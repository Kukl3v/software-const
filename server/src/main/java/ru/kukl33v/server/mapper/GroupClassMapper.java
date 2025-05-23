package ru.kukl33v.server.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import ru.kukl33v.server.configuration.MapperConfiguration;
import ru.kukl33v.server.domain.GroupClass;
import ru.kukl33v.server.dto.GroupClassDTO;

@Mapper(config = MapperConfiguration.class)
public interface GroupClassMapper {

    GroupClassDTO toDTO(GroupClass groupClass);

    GroupClass toGroup(GroupClassDTO DTO);

    @Mapping(target = "id", ignore = true)
    void updateGroupFromDTO(GroupClassDTO DTO, @MappingTarget GroupClass groupClass);
}
