package ru.kukl33v.server.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.kukl33v.server.domain.Session;

import java.util.List;
import java.util.UUID;

public interface SessionRepository extends JpaRepository<Session, UUID> {
    List<Session> findAllByTrainer_IdOrderByDayOfWeekAscStartTimeAsc(UUID trainerId);
    List<Session> findAllByClient_IdOrderByDayOfWeekAscStartTimeAsc(UUID clientId);
}
