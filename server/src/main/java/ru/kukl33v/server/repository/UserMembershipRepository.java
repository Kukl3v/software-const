package ru.kukl33v.server.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import ru.kukl33v.server.domain.UserMembership;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface UserMembershipRepository extends JpaRepository<UserMembership, UUID> {
    @Query("SELECT FUNCTION('date_trunc','month', um.startDate), COUNT(um.id), SUM(m.price) FROM UserMembership um JOIN um.membership m WHERE um.startDate BETWEEN :startDate AND :endDate GROUP BY FUNCTION('date_trunc','month', um.startDate) ORDER BY FUNCTION('date_trunc','month', um.startDate)")
    List<Object[]> salesByPeriod(@Param("startDate") LocalDate start, @Param("endDate") LocalDate end);
    List<UserMembership> findAllByUserId(UUID userId);
}
