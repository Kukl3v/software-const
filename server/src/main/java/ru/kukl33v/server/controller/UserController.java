package ru.kukl33v.server.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import ru.kukl33v.server.dto.UserDTO;
import ru.kukl33v.server.dto.UserFullDTO;
import ru.kukl33v.server.dto.UserPasswordUpdateDTO;
import ru.kukl33v.server.dto.UserSignUpDTO;
import ru.kukl33v.server.enumerator.Role;
import ru.kukl33v.server.service.UserService;

import java.util.List;
import java.util.UUID;

import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

@RestController
@RequestMapping(UserController.URL_USER)
@Tag(name = "пользователи", description = "запросы для работы с пользователями")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@AllArgsConstructor
public class UserController {
    public static final String URL_USER = "/api/user";

    UserService userService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "получить всех пользователей")
    @SecurityRequirement(name = "bearerAuth")
    public List<UserDTO> findAllUser(Pageable pageable) {
        return userService.getUserList(pageable);
    }

    @GetMapping(path = "/role/{role}", produces = APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('EMPLOYEE')")
    @Operation(summary = "получить пользователей по роли")
    @SecurityRequirement(name = "bearerAuth")
    public List<UserDTO> findUsersByRole(@PathVariable Role role) {
        return userService.findUsersByRole(role);
    }

    @GetMapping(path = "/search", produces = APPLICATION_JSON_VALUE)
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "получить всех пользователей по email")
    @SecurityRequirement(name = "bearerAuth")
    public List<UserDTO> findAllUserByEmail(@RequestParam("email") String email) {
        return userService.searchUsersByEmail(email);
    }

    @GetMapping(path = "/{id}", produces = APPLICATION_JSON_VALUE)
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "получить пользователя по id")
    @SecurityRequirement(name = "bearerAuth")
    public UserDTO findUser(@PathVariable UUID id) {
        return userService.findUser(id);
    }

    @PostMapping(consumes = APPLICATION_JSON_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("permitAll()")
    @Operation(summary = "зарегистрировать пользователя")
    public void createUser(@Valid @RequestBody UserSignUpDTO userDTO) {
        userService.createUser(userDTO);
    }

    @PostMapping(path = "/employee", consumes = APPLICATION_JSON_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "зарегистрировать работника")
    @SecurityRequirement(name = "bearerAuth")
    public void createEmployee(@Valid @RequestBody UserFullDTO userDTO) {
        userService.createEmployee(userDTO);
    }

    @PutMapping(path = "/{id}", produces = APPLICATION_JSON_VALUE)
    @PreAuthorize("#id == principal.id or hasRole('ADMIN')")
    @Operation(summary = "изменить пользователя")
    @SecurityRequirement(name = "bearerAuth")
    public UserDTO updateUser(@PathVariable UUID id, @Valid @RequestBody UserDTO userDTO) {
        return userService.updateUser(userDTO, id);
    }

    @PutMapping(path = "/{id}/password", produces = APPLICATION_JSON_VALUE)
    @PreAuthorize("#id == principal.id")
    @Operation(summary = "обновить пароль пользователю")
    @SecurityRequirement(name = "bearerAuth")
    public void updateUserPassword(@PathVariable UUID id, @Valid @RequestBody UserPasswordUpdateDTO userDTO) {
        userService.updateUserPassword(userDTO, id);
    }

    @DeleteMapping(path = "/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("#id == principal.id or hasRole('ADMIN')")
    @Operation(summary = "удалить пользователя")
    @SecurityRequirement(name = "bearerAuth")
    public void deleteUser(@PathVariable UUID id) {
        userService.deleteUser(id);
    }
}
