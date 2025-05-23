package ru.kukl33v.server.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import ru.kukl33v.server.dto.GroupClassDTO;
import ru.kukl33v.server.service.GroupClassService;

import java.util.List;
import java.util.Set;
import java.util.UUID;

import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

@RestController
@RequestMapping(GroupClassController.URL_GROUP)
@Tag(name = "группы", description = "запросы для с группами клиентов")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@AllArgsConstructor
public class GroupClassController {
    public static final String URL_GROUP = "/api/group";

    GroupClassService groupClassService;

    @GetMapping(path = "/user/{userId}", produces = APPLICATION_JSON_VALUE)
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "найти все группы по id пользователя")
    @SecurityRequirement(name = "bearerAuth")
    public List<GroupClassDTO> findAllClassByUser(@PathVariable UUID userId) {
        return groupClassService.findAllClassesByUser(userId);
    }

    @GetMapping(path = "/trainer/{trainerId}", produces = APPLICATION_JSON_VALUE)
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "найти все группы по id тренера")
    @SecurityRequirement(name = "bearerAuth")
    public List<GroupClassDTO> findAllClassByTrainer(@PathVariable UUID trainerId) {
        return groupClassService.findAllClassesByTrainer(trainerId);
    }

    @GetMapping(path = "/club/{clubId}", produces = APPLICATION_JSON_VALUE)
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "найти все группы по id клуба")
    @SecurityRequirement(name = "bearerAuth")
    public List<GroupClassDTO> findAllClassByClub(@PathVariable UUID clubId) {
        return groupClassService.findAllClassByClub(clubId);
    }

    @PostMapping(path = "/club/{clubId}", consumes = APPLICATION_JSON_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAnyRole('ADMIN','EMPLOYEE')")
    @Operation(summary = "создать группу в клубе")
    @SecurityRequirement(name = "bearerAuth")
    public void createGroupAndAddToClub(@PathVariable UUID clubId, @Valid @RequestBody GroupClassDTO dto) {
        groupClassService.createGroupAndAddToClub(clubId, dto);
    }

    @DeleteMapping(path = "/{groupClassId}/club/{clubId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasAnyRole('ADMIN','EMPLOYEE')")
    @Operation(summary = "удалить группу из клуба по id")
    @SecurityRequirement(name = "bearerAuth")
    public void removeGroupClassFromClub(@PathVariable UUID clubId, @PathVariable UUID groupClassId) {
        groupClassService.removeGroupClassFromClub(clubId, groupClassId);
    }

    @PostMapping(path = "/{groupId}/clients")
    @PreAuthorize("hasAnyRole('ADMIN','EMPLOYEE')")
    @Operation(summary = "добавить клиентов в группу")
    @SecurityRequirement(name = "bearerAuth")
    public void addClientsToGroup(@PathVariable UUID groupId, @RequestBody Set<UUID> clientIds) {
        groupClassService.addClientsToGroup(groupId, clientIds);
    }

    @DeleteMapping(path = "/{groupId}/clients/{clientId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasAnyRole('ADMIN','EMPLOYEE')")
    @Operation(summary = "удалить клиента из группы")
    @SecurityRequirement(name = "bearerAuth")
    public void removeClientFromGroup(@PathVariable UUID groupId, @PathVariable UUID clientId) {
        groupClassService.removeClientFromGroup(groupId, clientId);
    }
}
