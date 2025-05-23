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
import ru.kukl33v.server.dto.*;
import ru.kukl33v.server.service.ClubService;

import java.util.List;
import java.util.UUID;

import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

@RestController
@RequestMapping(ClubController.URL_CLUB)
@Tag(name = "фитнес-клубы", description = "запросы для работы с фелиалами фитнес-клубов")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@AllArgsConstructor
public class ClubController {
    public static final String URL_CLUB = "/api/club";

    ClubService clubService;

    @GetMapping
    @PreAuthorize("permitAll()")
    @Operation(summary = "получить все фитнес-клубы")
    public List<ClubDTO> findAllClub(Pageable pageable) {
        return clubService.getClubList(pageable);
    }

    @GetMapping(path = "/{id}", produces = APPLICATION_JSON_VALUE)
    @PreAuthorize("permitAll()")
    @Operation(summary = "найти фитнес-клуб по id")
    public ClubDTO findClub(@PathVariable UUID id) {
        return clubService.findClub(id);
    }

    @PostMapping(consumes = APPLICATION_JSON_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "создать фитнес-клуб")
    @SecurityRequirement(name = "bearerAuth")
    public void createClub(@Valid @RequestBody ClubDTO clubDTO) {
        clubService.createClub(clubDTO);
    }

    @PutMapping(path = "/{id}", produces = APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "изменить фитнес-клуб по id")
    @SecurityRequirement(name = "bearerAuth")
    public ClubDTO updateClub(@PathVariable UUID id, @Valid @RequestBody ClubDTO clubDTO) {
        return clubService.updateClub(clubDTO, id);
    }

    @DeleteMapping(path = "/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "удалить фитнес-клуб по id")
    @SecurityRequirement(name = "bearerAuth")
    public void deleteClub(@PathVariable UUID id) {
        clubService.deleteClub(id);
    }

}
