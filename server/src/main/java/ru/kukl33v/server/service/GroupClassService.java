package ru.kukl33v.server.service;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.kukl33v.server.domain.Club;
import ru.kukl33v.server.domain.GroupClass;
import ru.kukl33v.server.domain.User;
import ru.kukl33v.server.dto.GroupClassDTO;
import ru.kukl33v.server.mapper.GroupClassMapper;
import ru.kukl33v.server.repository.ClubRepository;
import ru.kukl33v.server.repository.GroupClassRepository;
import ru.kukl33v.server.repository.UserRepository;
import ru.kukl33v.server.validation.ValidatorUtil;
import ru.kukl33v.server.validation.exception.ClubNotFoundException;
import ru.kukl33v.server.validation.exception.GroupClassNotFoundException;
import ru.kukl33v.server.validation.exception.UserNotFoundException;

import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class GroupClassService {
    GroupClassRepository groupClassRepository;
    UserRepository userRepository;
    ClubRepository clubRepository;
    GroupClassMapper groupClassMapper;
    ValidatorUtil validatorUtil;

    public List<GroupClassDTO> findAllClassesByTrainer(UUID trainerId) {
        if (!userRepository.existsById(trainerId)) {
            throw new UserNotFoundException(trainerId);
        }
        List<GroupClass> classes = groupClassRepository.findAllByTrainer_Id(trainerId);
        return classes.stream()
                .map(groupClassMapper::toDTO)
                .collect(Collectors.toList());
    }

    public List<GroupClassDTO> findAllClassesByUser(UUID userId) {
        if (!userRepository.existsById(userId)) {
            throw new UserNotFoundException(userId);
        }
        List<GroupClass> classes = groupClassRepository.findAllByClients_Id(userId);
        return classes.stream()
                .map(groupClassMapper::toDTO)
                .collect(Collectors.toList());
    }

    public List<GroupClassDTO> findAllClassByClub(UUID clubId) {
        if (!clubRepository.existsById(clubId)) {
            throw new ClubNotFoundException(clubId);
        }
        List<GroupClass> classes = groupClassRepository.findAllByClub_Id(clubId);
        return classes.stream()
                .map(groupClassMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public void createGroupAndAddToClub(UUID clubId, GroupClassDTO dto) {
        Club club = clubRepository.findById(clubId)
                .orElseThrow(() -> new ClubNotFoundException(clubId));
        GroupClass group = groupClassMapper.toGroup(dto);
        group.setClub(club);
        validatorUtil.validate(group);
        GroupClass savedGroup = groupClassRepository.save(group);
        groupClassMapper.toDTO(savedGroup);
    }

    @Transactional
    public void removeGroupClassFromClub(UUID clubId, UUID groupClassId) {
        Club club = clubRepository.findById(clubId)
                .orElseThrow(() -> new ClubNotFoundException(clubId));
        GroupClass group = groupClassRepository.findById(groupClassId)
                .orElseThrow(() -> new GroupClassNotFoundException(groupClassId));
        if (!group.getClub().equals(club)) {
            throw new GroupClassNotFoundException(groupClassId, clubId);
        }
        group.getClients().clear();
        groupClassRepository.delete(group);
    }

    @Transactional
    public void addClientsToGroup(UUID groupClassId, Set<UUID> clientIds) {
        GroupClass groupClass = groupClassRepository.findById(groupClassId)
                .orElseThrow(() -> new GroupClassNotFoundException(groupClassId));
        List<User> clients = userRepository.findAllById(clientIds);
        groupClass.getClients().addAll(clients);
        groupClassRepository.save(groupClass);
    }

    @Transactional
    public void removeClientFromGroup(UUID groupClassId, UUID clientId) {
        GroupClass groupClass = groupClassRepository.findById(groupClassId)
                .orElseThrow(() -> new GroupClassNotFoundException(groupClassId));
        User client = userRepository.findById(clientId)
                .orElseThrow(() -> new UserNotFoundException(clientId));
        groupClass.getClients().remove(client);
        groupClassRepository.save(groupClass);
    }

}
