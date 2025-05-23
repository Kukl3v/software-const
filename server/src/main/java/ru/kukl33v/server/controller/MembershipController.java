package ru.kukl33v.server.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import ru.kukl33v.server.dto.MembershipDTO;
import ru.kukl33v.server.dto.ServiceDTO;
import ru.kukl33v.server.dto.UserMembershipDTO;
import ru.kukl33v.server.service.MembershipService;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

@RestController
@RequestMapping(MembershipController.URL_MEMBERSHIP)
@Tag(name = "абонементы", description = "запросы для работы с абонементами")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@AllArgsConstructor
public class MembershipController {
    public static final String URL_MEMBERSHIP = "/api/membership";

    MembershipService membershipService;

    @GetMapping(produces = APPLICATION_JSON_VALUE)
    @PreAuthorize("permitAll()")
    @Operation(summary = "получить список абонементов")
    public List<MembershipDTO> findMembershipList(Pageable pageable) {
        return membershipService.getMembershipList(pageable);
    }

    @GetMapping(path = "/{id}", produces = APPLICATION_JSON_VALUE)
    @PreAuthorize("permitAll()")
    @Operation(summary = "найти абонемент по id")
    public MembershipDTO findMembership(@PathVariable UUID id) {
        return membershipService.findMembership(id);
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("#userId == principal.id or hasRole('ADMIN')")
    @Operation(summary = "Получить абонементы пользователя по ID")
    @SecurityRequirement(name = "bearerAuth")
    public List<UserMembershipDTO> findUserMemberships(@PathVariable UUID userId) {
        return membershipService.findMembershipsByUserId(userId);
    }

    @GetMapping("/{userId}/services")
    @PreAuthorize("permitAll()")
    @Operation(summary = "Получить абонементы пользователя по ID")
    @SecurityRequirement(name = "bearerAuth")
    public List<ServiceDTO> findServicesByMembership(@PathVariable UUID userId) {
        return membershipService.getServicesByMembership(userId);
    }

    @PostMapping(consumes = APPLICATION_JSON_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "создать абонемент")
    @SecurityRequirement(name = "bearerAuth")
    public void createMembership(@Valid @RequestBody MembershipDTO dto) {
        membershipService.createMembership(dto);
    }

    @PutMapping(path = "/{id}", consumes = APPLICATION_JSON_VALUE, produces = APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "изменить абонемент по id")
    @SecurityRequirement(name = "bearerAuth")
    public MembershipDTO updateMembership(@Valid @RequestBody MembershipDTO dto, @PathVariable UUID id) {
        return membershipService.updateMembership(dto, id);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "удалить абонемент по id")
    @SecurityRequirement(name = "bearerAuth")
    public void deleteMembership(@PathVariable UUID id) {
        membershipService.deleteMembership(id);
    }

    @PostMapping(path = "/user/{userId}/subscribe", produces = APPLICATION_JSON_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("#userId == principal.id or hasRole('ADMIN')")
    @Operation(summary = "подписать пользователя на абонемент")
    @SecurityRequirement(name = "bearerAuth")
    public UserMembershipDTO subscribeUserToMembership(
            @PathVariable UUID userId,
            @RequestParam UUID membershipId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate) {
        return membershipService.subscribeUserToMembership(userId, membershipId, startDate);
    }

    @DeleteMapping("/subscription/{userMembershipId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "отменить абонемент у пользователя")
    @SecurityRequirement(name = "bearerAuth")
    public void cancelUserMembership(
            @PathVariable UUID userMembershipId) {
        membershipService.cancelUserMembership(userMembershipId);
    }

    @PostMapping(path = "/{id}/services", consumes = APPLICATION_JSON_VALUE, produces = APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "добавить услуги к абонементу")
    @SecurityRequirement(name = "bearerAuth")
    public MembershipDTO addServicesToMembership(
            @PathVariable UUID id,
            @RequestBody List<UUID> serviceIds) {
        return membershipService.addServicesToMembership(id, serviceIds);
    }

    @DeleteMapping(path = "/{membershipId}/service/{serviceId}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "удалить услугу из абонемента")
    @SecurityRequirement(name = "bearerAuth")
    public MembershipDTO removeServiceFromMembership(
            @PathVariable UUID membershipId,
            @PathVariable UUID serviceId) {
        return membershipService.removeServiceFromMembership(membershipId, serviceId);
    }
}
