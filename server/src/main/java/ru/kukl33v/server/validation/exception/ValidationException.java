package ru.kukl33v.server.validation.exception;

import java.util.Set;

public class ValidationException extends RuntimeException {
    public ValidationException(Set<String> errors) {
        super(String.join("\n", errors));
    }
}
