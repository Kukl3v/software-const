package ru.kukl33v.server.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;

import java.math.BigDecimal;
import java.util.UUID;

public record MembershipDTO(@JsonProperty("name")
                            @NotBlank(message = "Поле адреса обязательно к заполнению")
                            String name,
                            @JsonProperty("description")
                            @NotBlank(message = "Поле города обязательно к заполнению")
                            String description,
                            @JsonProperty("price")
                            BigDecimal price,
                            @JsonProperty("durationDays")
                            Integer durationDays,
                            @JsonProperty(value = "id", access = JsonProperty.Access.READ_ONLY)
                            UUID id) {
}
