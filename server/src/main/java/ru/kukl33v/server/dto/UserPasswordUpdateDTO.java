package ru.kukl33v.server.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record UserPasswordUpdateDTO (
        @JsonProperty(value = "currentPassword")
        @NotBlank(message = "Поле текущего пароля обязательно к заполнению")
        String currentPassword,
        @JsonProperty(value = "password")
        @NotBlank(message = "Поле нового пароля обязательно к заполнению")
        @Size(min = 8, max = 20, message = "Пароль должен быть от 8 до 20 символов")
        @Pattern(
                regexp = "^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#\\$%\\^&\\*]).*$",
                message = "Пароль должен содержать как минимум одну цифру, одну букву, и один символ"
        )
        String password,
        @JsonProperty(value = "passwordConfirm")
        @NotBlank(message = "Поле подтверждения нового пароля обязательно к заполнению")
        @Size(min = 8, max = 20, message = "Пароль должен быть от 8 до 20 символов")
        @Pattern(
                regexp = "^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#\\$%\\^&\\*]).*$",
                message = "Пароль должен содержать как минимум одну цифру, одну букву, и один символ"
        )
        String passwordConfirm){

}
