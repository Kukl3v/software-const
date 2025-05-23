package ru.kukl33v.server.validation.exception;

import java.util.UUID;

public class GroupClassNotFoundException extends RuntimeException {
    public GroupClassNotFoundException(UUID id) {
        super(String.format("Группа с id [%s] не найдена", id));
    }

    public GroupClassNotFoundException(UUID groupId, UUID clubId) {
        super(String.format("Группа с id [%s] не найдена в клубе с id [%s]", groupId, clubId));
    }
}
