package ru.kukl33v.server.validation.exception;

import java.util.UUID;

public class ClubNotFoundException extends RuntimeException {
    public ClubNotFoundException(UUID id) {
        super(String.format("Фитнес-клуб с id [%s] не найден", id));
    }

    public ClubNotFoundException(String address) {
        super(String.format("Фитнес-клуб по адресу [%s] не найден", address));
    }
}
