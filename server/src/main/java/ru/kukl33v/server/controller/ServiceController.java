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
import ru.kukl33v.server.dto.ServiceDTO;
import ru.kukl33v.server.service.ServiceService;

import java.util.List;
import java.util.UUID;

import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

@RestController
@RequestMapping(ServiceController.URL_SERVICE)
@Tag(name = "услуги", description = "запросы для работы с услугами")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@AllArgsConstructor
public class ServiceController {
    public static final String URL_SERVICE = "/api/service";

    ServiceService serviceService;

    @GetMapping
    @PreAuthorize("permitAll()")
    @Operation(summary = "получить все услуги")
    public List<ServiceDTO> findAllService(Pageable pageable) {
        return serviceService.getServiceList(pageable);
    }

    @GetMapping(path = "/{id}", produces = APPLICATION_JSON_VALUE)
    @PreAuthorize("permitAll()")
    @Operation(summary = "получить услугу по id")
    public ServiceDTO findService(@PathVariable UUID id) {
        return serviceService.findService(id);
    }

    @PostMapping(consumes = APPLICATION_JSON_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Создать услугу")
    @SecurityRequirement(name = "bearerAuth")
    public void createService(@Valid @RequestBody ServiceDTO serviceDTO) {
        serviceService.createService(serviceDTO);
    }

    @PutMapping(path = "/{id}", produces = APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "изменить услугу по id")
    @SecurityRequirement(name = "bearerAuth")
    public ServiceDTO updateService(@PathVariable UUID id, @Valid @RequestBody ServiceDTO serviceDTO) {
        return serviceService.updateService(serviceDTO, id);
    }

    @DeleteMapping(path = "/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "удалить услугу")
    @SecurityRequirement(name = "bearerAuth")
    public void deleteService(@PathVariable UUID id) {
        serviceService.deleteService(id);
    }

}