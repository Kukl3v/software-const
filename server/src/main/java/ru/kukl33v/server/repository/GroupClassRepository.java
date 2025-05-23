package ru.kukl33v.server.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.kukl33v.server.domain.GroupClass;

import java.util.List;
import java.util.UUID;

public interface GroupClassRepository extends JpaRepository<GroupClass, UUID> {
    List<GroupClass> findAllByClub_Id(UUID clubId);
    List<GroupClass> findAllByClients_Id(UUID clientId);
    List<GroupClass> findAllByTrainer_Id(UUID trainerId);
}
