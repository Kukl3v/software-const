package ru.kukl33v.server.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Email;

public record UserSignInDTO(@JsonProperty("email")
                            @Email(message = "Формат почты должен быть верным")
                            String email,
                            @JsonProperty(value = "password", access = JsonProperty.Access.WRITE_ONLY)
                            String password){

}
