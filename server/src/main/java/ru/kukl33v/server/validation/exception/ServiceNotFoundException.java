package ru.kukl33v.server.validation.exception;

import java.util.UUID;

public class ServiceNotFoundException extends RuntimeException {
    public ServiceNotFoundException(UUID id) {
        super(String.format("Услуга с id [%s] не найдена", id));
    }
}