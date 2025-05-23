package ru.kukl33v.server.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import ru.kukl33v.server.configuration.MapperConfiguration;
import ru.kukl33v.server.domain.User;
import ru.kukl33v.server.dto.UserDTO;
import ru.kukl33v.server.dto.UserPasswordUpdateDTO;
import ru.kukl33v.server.dto.UserSignUpDTO;

@Mapper(config = MapperConfiguration.class)
public interface UserMapper {

    UserDTO toDTO(User user);

    User toUser(UserDTO dto);

    User toUser(UserSignUpDTO dto);

    @Mapping(target = "id", ignore = true)
    void updateUserFromDTO(UserDTO DTO, @MappingTarget User user);

    void updateUserPasswordFromDTO(UserPasswordUpdateDTO DTO, @MappingTarget User user);
}
