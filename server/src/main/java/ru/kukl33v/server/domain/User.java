package ru.kukl33v.server.domain;

import jakarta.persistence.*;
import lombok.*;
import ru.kukl33v.server.enumerator.Role;

import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "user_table")
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String firstName;
    @Column(nullable = false)
    private String lastName;
    @Column(nullable = false, unique = true)
    private String email;
    @Column(nullable = false)
    private String password;
    @Enumerated(EnumType.STRING)
    private Role role;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<UserMembership> memberships;

    @ManyToMany(mappedBy = "clients")
    private Set<GroupClass> groups;

    @OneToMany(mappedBy = "trainer")
    private Set<Session> sessions;

    @OneToMany(mappedBy = "trainer")
    private Set<GroupClass> managedGroups;
}
