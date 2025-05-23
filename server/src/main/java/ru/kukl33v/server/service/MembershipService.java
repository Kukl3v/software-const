package ru.kukl33v.server.service;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.kukl33v.server.domain.Membership;
import ru.kukl33v.server.domain.User;
import ru.kukl33v.server.domain.UserMembership;
import ru.kukl33v.server.dto.MembershipDTO;
import ru.kukl33v.server.dto.ServiceDTO;
import ru.kukl33v.server.dto.UserMembershipDTO;
import ru.kukl33v.server.mapper.MembershipMapper;
import ru.kukl33v.server.mapper.ServiceMapper;
import ru.kukl33v.server.repository.MembershipRepository;
import ru.kukl33v.server.repository.ServiceRepository;
import ru.kukl33v.server.repository.UserMembershipRepository;
import ru.kukl33v.server.repository.UserRepository;
import ru.kukl33v.server.validation.ValidatorUtil;
import ru.kukl33v.server.validation.exception.ClubNotFoundException;
import ru.kukl33v.server.validation.exception.MembershipNotFoundException;
import ru.kukl33v.server.validation.exception.ServiceNotFoundException;
import ru.kukl33v.server.validation.exception.UserNotFoundException;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class MembershipService {
    MembershipRepository membershipRepository;
    ServiceRepository serviceRepository;
    UserMembershipRepository userMembershipRepository;
    UserRepository userRepository;
    MembershipMapper membershipMapper;
    ServiceMapper serviceMapper;
    ValidatorUtil validatorUtil;

    public List<MembershipDTO> getMembershipList(Pageable pageable){
        Page<Membership> memberships = membershipRepository.findAll(pageable);
        return memberships.stream().map(membershipMapper::toDTO).toList();
    }

    public MembershipDTO findMembership(UUID id) {
        return membershipRepository.findById(id)
                .map(membershipMapper::toDTO)
                .orElseThrow(() -> new MembershipNotFoundException(id));
    }

    public List<UserMembershipDTO> findMembershipsByUserId(UUID userId) {
        List<UserMembership> userMemberships = userMembershipRepository.findAllByUserId(userId);
        return userMemberships.stream()
                .map(um -> new UserMembershipDTO(
                        um.getId(),
                        um.getUser().getId(),
                        um.getMembership().getId(),
                        um.getMembership().getName(),
                        um.getStartDate(),
                        um.getExpirationDate()
                ))
                .toList();
    }

    @Transactional
    public void createMembership(MembershipDTO membershipDTO){
        Membership membership = membershipMapper.toMembership(membershipDTO);
        validatorUtil.validate(membership);
        membershipRepository.save(membership);
    }

    @Transactional
    public MembershipDTO updateMembership(MembershipDTO membershipDTO, UUID id) {
        Membership membership = membershipRepository.findById(id)
                .orElseThrow(() -> new ClubNotFoundException(id));
        membershipMapper.updateMembershipFromDTO(membershipDTO, membership);
        return membershipMapper.toDTO(membershipRepository.save(membership));
    }

    @Transactional
    public void deleteMembership(UUID id){
        Membership membership = membershipRepository.findById(id)
                .orElseThrow(() -> new MembershipNotFoundException(id));
        membershipRepository.delete(membership);
    }

    @Transactional
    public UserMembershipDTO subscribeUserToMembership(UUID userId,
                                                       UUID membershipId,
                                                       LocalDate startDate) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));
        Membership membership = membershipRepository.findById(membershipId)
                .orElseThrow(() -> new MembershipNotFoundException(membershipId));
        UserMembership um = new UserMembership();
        um.setUser(user);
        um.setMembership(membership);
        um.setStartDate(startDate);
        um.setExpirationDate(startDate.plusDays(membership.getDurationDays()));
        UserMembership saved = userMembershipRepository.save(um);
        return new UserMembershipDTO(saved.getId(), saved.getUser().getId(),saved.getMembership().getId(),saved.getMembership().getName(),saved.getStartDate() , saved.getExpirationDate());
    }

    @Transactional
    public void cancelUserMembership(UUID userMembershipId) {
        UserMembership um = userMembershipRepository.findById(userMembershipId)
                .orElseThrow(() -> new MembershipNotFoundException(userMembershipId));
        um.setExpirationDate(LocalDate.now());
        userMembershipRepository.save(um);
    }

    @Transactional(readOnly = true)
    public List<ServiceDTO> getServicesByMembership(UUID membershipId) {
        List<ru.kukl33v.server.domain.Service> services = serviceRepository.findAllByMembership_Id(membershipId);
        return services.stream()
                .map(serviceMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public MembershipDTO addServicesToMembership(UUID membershipId, List<UUID> serviceIds) {
        Membership membership = membershipRepository.findById(membershipId)
                .orElseThrow(() -> new MembershipNotFoundException(membershipId));
        List<ru.kukl33v.server.domain.Service> services = serviceRepository.findAllById(serviceIds);
        services.forEach(svc -> svc.setMembership(membership));
        serviceRepository.saveAll(services);
        return membershipMapper.toDTO(membership);
    }

    @Transactional
    public MembershipDTO removeServiceFromMembership(UUID membershipId, UUID serviceId) {
        Membership membership = membershipRepository.findById(membershipId)
                .orElseThrow(() -> new MembershipNotFoundException(membershipId));
        ru.kukl33v.server.domain.Service svc = serviceRepository.findById(serviceId)
                .orElseThrow(() -> new ServiceNotFoundException(serviceId));
        if (!membership.equals(svc.getMembership())) {
            throw new IllegalArgumentException(
                    String.format("Service %s is not attached to membership %s", serviceId, membershipId)
            );
        }
        svc.setMembership(null);
        serviceRepository.save(svc);
        return membershipMapper.toDTO(membership);
    }
}
