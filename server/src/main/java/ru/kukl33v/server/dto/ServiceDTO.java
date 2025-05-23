package ru.kukl33v.server.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;

import java.util.UUID;

public record ServiceDTO (@JsonProperty("name")
                          @NotBlank(message = "Поле названия услуги обязательно к заполнению")
                          String name,
                          @JsonProperty("description")
                          String description,
                          @JsonProperty(value = "id", access = JsonProperty.Access.READ_ONLY)
                          UUID id) {
}
