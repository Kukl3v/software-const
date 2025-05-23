package ru.kukl33v.server.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import ru.kukl33v.server.configuration.MapperConfiguration;
import ru.kukl33v.server.domain.Club;
import ru.kukl33v.server.dto.ClubDTO;

@Mapper(config = MapperConfiguration.class)
public interface ClubMapper {

    ClubDTO toDTO(Club club);

    Club toClub(ClubDTO DTO);

    @Mapping(target = "id", ignore = true)
    void updateClubFromDTO(ClubDTO DTO, @MappingTarget Club club);
}
