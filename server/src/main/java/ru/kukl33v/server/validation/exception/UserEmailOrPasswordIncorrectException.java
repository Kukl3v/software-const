package ru.kukl33v.server.validation.exception;

public class UserEmailOrPasswordIncorrectException extends RuntimeException {
    public UserEmailOrPasswordIncorrectException() {
        super("Неверная почта или пароль");
    }
}
