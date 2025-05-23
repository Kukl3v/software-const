package ru.kukl33v.server.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record UserFullDTO(@JsonProperty("firstName")
                      String firstName,
                      @JsonProperty("lastName")
                      String lastName,
                      @JsonProperty("email")
                      String email,
                      @JsonProperty("password")
                      String password) {
}
