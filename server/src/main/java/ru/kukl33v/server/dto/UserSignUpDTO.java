package ru.kukl33v.server.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record UserSignUpDTO (@JsonProperty("firstName")
                             @NotBlank(message = "Поле имени обязательно к заполнению")
                             String firstName,
                             @JsonProperty("lastName")
                             @NotBlank(message = "Поле фамилии пользователя обязательно к заполнению")
                             String lastName,
                             @JsonProperty("email")
                             @NotBlank(message = "Поле почты обязательно к заполнению")
                             @Email(message = "Формат почты должен быть верным")
                             String email,
                             @JsonProperty(value = "password")
                             @NotBlank(message = "Поле пароля обязательно к заполнению")
                             @Size(min = 8, max = 20, message = "Пароль должен быть от 8 до 20 символов")
                             @Pattern(
                                     regexp = "^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#\\$%\\^&\\*]).*$",
                                     message = "Пароль должен содержать как минимум одну цифру, одну букву, и один символ"
                             )
                             String password,
                             @JsonProperty(value = "passwordConfirm")
                             @NotBlank(message = "Поле подтверждения пароля обязательно к заполнению")
                             @Size(min = 8, max = 20, message = "Пароль должен быть от 8 до 20 символов")
                             @Pattern(
                                     regexp = "^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#\\$%\\^&\\*]).*$",
                                     message = "Пароль должен содержать как минимум одну цифру, одну букву, и один символ"
                             )
                             String passwordConfirm){

}
