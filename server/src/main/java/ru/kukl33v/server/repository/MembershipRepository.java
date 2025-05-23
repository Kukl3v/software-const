package ru.kukl33v.server.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.kukl33v.server.domain.Membership;

import java.util.UUID;

public interface MembershipRepository extends JpaRepository<Membership, UUID> {
}
