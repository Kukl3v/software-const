package ru.kukl33v.server.enumerator;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;

@Getter
@RequiredArgsConstructor
@JsonFormat(shape = JsonFormat.Shape.STRING)
public enum Role implements GrantedAuthority {
    ADMIN,
    EMPLOYEE,
    USER;

    private static final String PREFIX = "ROLE_";

    @Override
    public String getAuthority() {
        return PREFIX + this.name();
    }

    public static final class AsString {
        public static final String ADMIN = PREFIX + "ADMIN";
        public static final String EMPLOYEE = PREFIX + "EMPLOYEE";
        public static final String USER = PREFIX + "USER";
    }
}
