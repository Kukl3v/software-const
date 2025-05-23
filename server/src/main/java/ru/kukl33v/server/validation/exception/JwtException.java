package ru.kukl33v.server.validation.exception;

public class JwtException extends RuntimeException {
    public JwtException(Throwable throwable) {
        super(throwable);
    }

    public JwtException(String message) {
        super(message);
    }
}
