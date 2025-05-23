package ru.kukl33v.server.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.Set;
import java.util.UUID;

public record GroupClassDTO(@JsonProperty("trainerId")
                            UUID trainerId,
                            @JsonProperty("clientsId")
                            Set<UUID> clientIds,
                            @JsonProperty("clubId")
                            UUID clubId,
                            @JsonProperty("id")
                            UUID id) {
}
