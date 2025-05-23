package ru.kukl33v.server.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import ru.kukl33v.server.domain.User;
import ru.kukl33v.server.dto.UserSignInDTO;
import ru.kukl33v.server.service.UserService;

@RestController
@RequestMapping(AuthController.URL_AUTH)
@Tag(name = "авторизация", description = "запросы для работы с авторизацией")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@AllArgsConstructor
public class AuthController {
    public static final String URL_AUTH = "/api/auth";

    UserService userService;

    @PostMapping(path = "/login")
    @PreAuthorize("permitAll()")
    @Operation(summary = "войти в систему")
    public String login(@RequestBody @Valid UserSignInDTO dto) {
        return userService.loginAndGetToken(dto);
    }

    @GetMapping(path = "/role")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "получить текущую роль")
    @SecurityRequirement(name = "bearerAuth")
    public String getRole(@RequestParam("token") String token) {
        UserDetails userDetails = userService.loadUserByToken(token);
        User user = userService.findByEmail(userDetails.getUsername());
        return user.getRole().toString();
    }
}
