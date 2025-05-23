package ru.kukl33v.server.validation.exception;

import java.util.UUID;

public class MembershipNotFoundException extends RuntimeException {
    public MembershipNotFoundException(UUID id) {
        super(String.format("Абонемент с id [%s] не найден", id));
    }
}