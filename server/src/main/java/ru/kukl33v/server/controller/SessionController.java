package ru.kukl33v.server.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.kukl33v.server.dto.ClubDTO;
import ru.kukl33v.server.dto.SessionDTO;
import ru.kukl33v.server.service.SessionService;

import java.time.DayOfWeek;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

@RestController
@RequestMapping(SessionController.URL_SESSION)
@Tag(name = "расписание", description = "запросы для работы с расписанием")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@AllArgsConstructor
public class SessionController {
    public static final String URL_SESSION = "/api/session";

    SessionService sessionService;

    @GetMapping(path = "/user/{userId}/schedule", produces = APPLICATION_JSON_VALUE)
    @PreAuthorize("#userId == principal.id")
    @Operation(summary = "получить все расписание пользователя")
    @SecurityRequirement(name = "bearerAuth")
    public Map<DayOfWeek, List<SessionDTO>> getUserSchedule(@PathVariable UUID userId) {
        return sessionService.getUserSchedule(userId);
    }

    @GetMapping(path = "/user/{userId}", produces = APPLICATION_JSON_VALUE)
    @PreAuthorize("#userId == principal.id")
    @Operation(summary = "получить информацию о занятии")
    @SecurityRequirement(name = "bearerAuth")
    public SessionDTO getSession(@PathVariable UUID userId) {
        return sessionService.getSession(userId);
    }
}
