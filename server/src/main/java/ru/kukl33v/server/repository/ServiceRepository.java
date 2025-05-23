package ru.kukl33v.server.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.kukl33v.server.domain.Service;

import java.util.List;
import java.util.UUID;

public interface ServiceRepository extends JpaRepository<Service, UUID> {
    List<Service> findAllByMembership_Id(UUID membershipId);
}
