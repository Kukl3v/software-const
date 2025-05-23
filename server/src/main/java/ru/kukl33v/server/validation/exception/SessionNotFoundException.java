package ru.kukl33v.server.validation.exception;

import java.util.UUID;

public class SessionNotFoundException extends RuntimeException {
    public SessionNotFoundException(UUID id) {
        super(String.format("Расписание с id [%s] не найдено", id));
    }
}
