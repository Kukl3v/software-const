package ru.kukl33v.server.validation.exception;

import java.util.UUID;

public class UserNotFoundException extends RuntimeException {
    public UserNotFoundException(UUID id) {
        super(String.format("Пользователь с id [%s] не найден", id));
    }

    public UserNotFoundException(String email) {
        super(String.format("Пользователь с почтой [%s] не найден", email));
    }
}
