package ru.kukl33v.server.service;

import jakarta.validation.ValidationException;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.kukl33v.server.domain.User;
import ru.kukl33v.server.dto.*;
import ru.kukl33v.server.enumerator.Role;
import ru.kukl33v.server.jwt.JwtProvider;
import ru.kukl33v.server.mapper.UserMapper;
import ru.kukl33v.server.repository.UserRepository;
import ru.kukl33v.server.security.CustomUserDetails;
import ru.kukl33v.server.validation.ValidatorUtil;
import ru.kukl33v.server.validation.exception.JwtException;
import ru.kukl33v.server.validation.exception.UserExistsException;
import ru.kukl33v.server.validation.exception.UserNotFoundException;
import ru.kukl33v.server.validation.exception.UserPasswordIncorrectException;

import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Service
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserService implements UserDetailsService {
    PasswordEncoder passwordEncoder;
    UserMapper userMapper;
    UserRepository userRepository;
    ValidatorUtil validatorUtil;
    JwtProvider jwtProvider;

    public User findByEmail(String email) {
        return userRepository.findOneByEmailIgnoreCase(email);
    }

    public List<UserDTO> searchUsersByEmail(String emailPart) {
        List<User> users = userRepository.findAllByEmailContainingIgnoreCase(emailPart);
        return users.stream().map(userMapper::toDTO).toList();
    }

    public List<UserDTO> findUsersByRole(Role role) {
        List<User> users = userRepository.findAllByRole(role);
        return users.stream()
                .map(userMapper::toDTO)
                .toList();
    }

    public List<UserDTO> getUserList(Pageable pageable){
        Page<User> users = userRepository.findAll(pageable);
        return users.stream().map(userMapper::toDTO).toList();
    }

    public UserDTO findUser(UUID id) {
        return userRepository.findById(id)
                .map(userMapper::toDTO)
                .orElseThrow(() -> new UserNotFoundException(id));
    }

    @Transactional
    public void createUser(UserSignUpDTO userSignUpDTO){
        if (userRepository.findOneByEmailIgnoreCase(userSignUpDTO.email()) != null) {
            throw new UserExistsException(userSignUpDTO.email());
        }
        if (!Objects.equals(userSignUpDTO.password(), userSignUpDTO.passwordConfirm())) {
            throw new ValidationException("Пароли не совпадают");
        }
        User user = userMapper.toUser(userSignUpDTO);
        user.setPassword(passwordEncoder.encode(userSignUpDTO.password()));
        user.setRole(Role.USER);
        validatorUtil.validate(user);
        userRepository.save(user);
    }

    @Transactional
    public void createUser(String firstName, String lastName, String email, String password, Role role){
        if (userRepository.findOneByEmailIgnoreCase(email) != null) {
            throw new UserExistsException(email);
        }
        User user = new User();
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole(role);
        userRepository.save(user);
    }

    @Transactional
    public void createEmployee(UserFullDTO dto){
        if (userRepository.findOneByEmailIgnoreCase(dto.email()) != null) {
            throw new UserExistsException(dto.email());
        }
        User user = new User();
        user.setFirstName(dto.firstName());
        user.setLastName(dto.lastName());
        user.setEmail(dto.email());
        user.setPassword(passwordEncoder.encode(dto.password()));
        user.setRole(Role.EMPLOYEE);
        validatorUtil.validate(user);
        userRepository.save(user);
    }

    @Transactional
    public UserDTO updateUser(UserDTO userDTO, UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException(id));
        userMapper.updateUserFromDTO(userDTO, user);
        return userMapper.toDTO(userRepository.save(user));
    }

    @Transactional
    public void updateUserPassword(UserPasswordUpdateDTO dto, UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException(id));
        if (!passwordEncoder.matches(dto.currentPassword(), user.getPassword())) {
            throw new UserPasswordIncorrectException();
        }
        if (!Objects.equals(dto.password(), dto.passwordConfirm())) {
            throw new ValidationException("Пароль и подтверждение пароля не совпадают");
        }
        userMapper.updateUserPasswordFromDTO(dto, user);
        userMapper.toDTO(userRepository.save(user));
    }

    @Transactional
    public void deleteUser(UUID id){
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException(id));
        userRepository.delete(user);
    }

    public String loginAndGetToken(UserSignInDTO dto) {
        User user = userRepository.findOneByEmailIgnoreCase(dto.email());
        if (user == null) {
            throw new IllegalArgumentException("Пользователь не найден!");
        }
        if (!passwordEncoder.matches(dto.password(), user.getPassword())) {
            throw new IllegalArgumentException("Пользователь не найден!");
        }
        return jwtProvider.generateToken(user.getEmail());
    }

    public UserDetails loadUserByToken(String token) throws UsernameNotFoundException {
        if (!jwtProvider.isTokenValid(token)) {
            throw new JwtException("Bad token");
        }
        final String userLogin = jwtProvider.getEmailFromToken(token)
                .orElseThrow(() -> new JwtException("Token не содержит email"));
        return loadUserByUsername(userLogin);
    }

    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findOneByEmailIgnoreCase(email);
        return new CustomUserDetails(user);
    }
}
