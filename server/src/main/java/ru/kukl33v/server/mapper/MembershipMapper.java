package ru.kukl33v.server.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import ru.kukl33v.server.configuration.MapperConfiguration;
import ru.kukl33v.server.domain.GroupClass;
import ru.kukl33v.server.domain.Membership;
import ru.kukl33v.server.dto.GroupClassDTO;
import ru.kukl33v.server.dto.MembershipDTO;

@Mapper(config = MapperConfiguration.class)
public interface MembershipMapper {

    MembershipDTO toDTO(Membership membership);

    Membership toMembership(MembershipDTO DTO);

    @Mapping(target = "id", ignore = true)
    void updateMembershipFromDTO(MembershipDTO DTO, @MappingTarget Membership membership);
}