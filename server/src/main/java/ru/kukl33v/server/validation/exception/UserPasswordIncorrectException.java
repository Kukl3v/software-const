package ru.kukl33v.server.validation.exception;

public class UserPasswordIncorrectException extends RuntimeException {
    public UserPasswordIncorrectException() {
        super("Неверный пароль");
    }
}
