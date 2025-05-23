package ru.kukl33v.server.validation.exception;

public class UserExistsException extends RuntimeException {
    public UserExistsException(String username) {
        super(String.format("Пользователь [%s] уже существует", username));
    }
}
