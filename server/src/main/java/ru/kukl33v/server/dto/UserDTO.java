package ru.kukl33v.server.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import ru.kukl33v.server.enumerator.Role;

import java.util.UUID;

public record UserDTO(@JsonProperty("firstName")
                      String firstName,
                      @JsonProperty("lastName")
                      String lastName,
                      @JsonProperty("email")
                      String email,
                      @JsonProperty("role")
                      Role role,
                      @JsonProperty(value = "id", access = JsonProperty.Access.READ_ONLY)
                      UUID id) {
}
