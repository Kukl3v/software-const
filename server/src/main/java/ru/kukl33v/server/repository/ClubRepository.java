package ru.kukl33v.server.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.kukl33v.server.domain.Club;

import java.util.UUID;

public interface ClubRepository extends JpaRepository<Club, UUID> {
}
