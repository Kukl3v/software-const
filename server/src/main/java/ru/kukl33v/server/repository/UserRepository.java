package ru.kukl33v.server.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.kukl33v.server.domain.User;
import ru.kukl33v.server.enumerator.Role;

import java.util.List;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {
    User findOneByEmailIgnoreCase(String username);
    List<User> findAllByEmailContainingIgnoreCase(String emailPart);
    List<User> findAllByRole(Role role);
}
