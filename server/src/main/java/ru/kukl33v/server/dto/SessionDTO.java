package ru.kukl33v.server.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import ru.kukl33v.server.enumerator.SessionType;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.UUID;

public record SessionDTO(@JsonProperty(value = "id", access = JsonProperty.Access.READ_ONLY)
                         UUID id,
                         @JsonProperty("startTime")
                         @JsonFormat(pattern = "HH:mm")
                         LocalTime startTime,
                         @JsonProperty("endTime")
                         @JsonFormat(pattern = "HH:mm")
                         LocalTime endTime,
                         @JsonProperty("type")
                         SessionType type,
                         @JsonProperty("dayOfWeek")
                         DayOfWeek dayOfWeek,
                         @JsonProperty("clientFullName")
                         String clientFullName,
                         @JsonProperty("trainerFullName")
                         String trainerFullName,
                         @JsonProperty("groupId")
                         UUID groupId,
                         @JsonProperty("clubAddress")
                         String clubAddress) {
}
