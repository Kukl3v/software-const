package ru.kukl33v.server.configuration;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import ru.kukl33v.server.controller.*;
import ru.kukl33v.server.enumerator.Role;
import ru.kukl33v.server.jwt.JwtFilter;
import ru.kukl33v.server.service.UserService;

import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(
        prePostEnabled = true
)
public class SecurityConfiguration  {
    private final Logger log = LoggerFactory.getLogger(SecurityConfiguration.class);
    public static final String SPA_URL_MASK = "/{path:[^\\.]*}";
    private final UserService userService;
    private final JwtFilter jwtFilter;

    public SecurityConfiguration(UserService userService) {
        this.userService = userService;
        this.jwtFilter = new JwtFilter(userService);
        createAdminOnStartup();
    }

    private void createAdminOnStartup() {
        final String admin = "kukl33v@yandex.ru";
        final String password = "t4rD6kMSRvvbUZp";
        if (userService.findByEmail(admin) == null) {
            log.info("Admin user successfully created");
            userService.createUser(admin, admin, admin, password, Role.ADMIN);
        }
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(Customizer.withDefaults())
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(sm -> sm
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers("/", SPA_URL_MASK).permitAll()
                        .requestMatchers(HttpMethod.POST, AuthController.URL_AUTH + "/login").permitAll()
                        .requestMatchers(HttpMethod.GET, ClubController.URL_CLUB, ClubController.URL_CLUB + "/*").permitAll()
                        .requestMatchers(HttpMethod.GET, MembershipController.URL_MEMBERSHIP, MembershipController.URL_MEMBERSHIP + "/*").permitAll()
                        .requestMatchers(HttpMethod.GET, ServiceController.URL_SERVICE, ServiceController.URL_SERVICE + "/*").permitAll()
                        .requestMatchers(HttpMethod.POST, UserController.URL_USER).permitAll()
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(List.of("*"));
        configuration.setAllowedMethods(List.of("*"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public WebSecurityCustomizer webSecurityCustomizer() {
        return web -> web.ignoring()
                .requestMatchers("/*.js", "/*.html", "/*.css", "/*.png", "/*.jpg", "/favicon.svg")
                .requestMatchers("/swagger-ui/**", "/webjars/**", "/swagger-resources/**", "/v3/api-docs/**");
    }
}
