package ru.kukl33v.server.service;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.kukl33v.server.domain.Session;
import ru.kukl33v.server.domain.User;
import ru.kukl33v.server.dto.SessionDTO;
import ru.kukl33v.server.enumerator.Role;
import ru.kukl33v.server.mapper.SessionMapper;
import ru.kukl33v.server.repository.SessionRepository;
import ru.kukl33v.server.repository.UserRepository;
import ru.kukl33v.server.validation.exception.SessionNotFoundException;
import ru.kukl33v.server.validation.exception.UserNotFoundException;

import java.time.DayOfWeek;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class SessionService {
    SessionRepository sessionRepository;
    SessionMapper sessionMapper;
    UserRepository userRepository;

    public Map<DayOfWeek, List<SessionDTO>> getUserSchedule(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));
        List<Session> sessions;
        if (Role.EMPLOYEE.equals(user.getRole())) {
            sessions = sessionRepository.findAllByTrainer_IdOrderByDayOfWeekAscStartTimeAsc(userId);
        }
        else if (Role.USER.equals(user.getRole())) {
            sessions = sessionRepository.findAllByClient_IdOrderByDayOfWeekAscStartTimeAsc(userId);
        } else {
            throw new IllegalArgumentException("Неизвестная роль");
        }
        return sessions.stream()
                .map(sessionMapper::toDTO)
                .collect(Collectors.groupingBy(SessionDTO::dayOfWeek, LinkedHashMap::new, Collectors.toList()));
    }

    public SessionDTO getSession(UUID sessionId) {
        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new SessionNotFoundException(sessionId));
        return sessionMapper.toDTO(session);
    }
}
