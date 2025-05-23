package ru.kukl33v.server.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDate;
import java.util.UUID;

public record UserMembershipDTO(
        @JsonProperty(value = "id", access = JsonProperty.Access.READ_ONLY)
        UUID id,
        @JsonProperty("userId")
        UUID userId,
        @JsonProperty("membershipId")
        UUID membershipId,
        @JsonProperty("membershipName")
        String membershipName,
        @JsonProperty("startDate")
        LocalDate startDate,
        @JsonProperty("expirationDate")
        LocalDate expirationDate
) {}
