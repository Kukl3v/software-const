package ru.kukl33v.server.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;

import java.util.UUID;

public record ClubDTO(@JsonProperty("address")
                      @NotBlank(message = "Поле адреса обязательно к заполнению")
                      String address,
                      @JsonProperty("city")
                      @NotBlank(message = "Поле города обязательно к заполнению")
                      String city,
                      @JsonProperty(value = "id", access = JsonProperty.Access.READ_ONLY)
                      UUID id) {
}
