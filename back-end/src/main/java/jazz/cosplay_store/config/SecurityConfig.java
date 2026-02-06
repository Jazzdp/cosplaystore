package jazz.cosplay_store.config;

import jazz.cosplay_store.config.JwtAuthenticationFilter;
import jazz.cosplay_store.service.CustomUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.http.HttpMethod;


@Configuration
public class SecurityConfig {

    @Autowired
    private CustomUserDetailsService customUserDetailsService;

    @Autowired
    private JwtAuthenticationFilter jwtFilter;

    @Autowired
    private CorsConfigurationSource corsConfigurationSource;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public DaoAuthenticationProvider authProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(customUserDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http.csrf(csrf -> csrf.disable())
        .cors(cors -> cors.configurationSource(corsConfigurationSource))
        .authorizeHttpRequests(auth -> auth
            // Public endpoints
            .requestMatchers("/api/auth/**").permitAll()
            .requestMatchers("/products/**").permitAll()
            .requestMatchers("/api/products/**").permitAll()
            .requestMatchers("/api/categories/**").permitAll()
            .requestMatchers("/", "/status", "/index.html").permitAll()
            // Static assets (frontend build files) - simplified to avoid complex patterns
            // Permit common static resource paths; avoid PathPattern double-wildcard issues
            .requestMatchers("/static/**", "/public/**", "/webjars/**").permitAll()
            .requestMatchers(HttpMethod.POST, "/api/orders").permitAll()
            // Authenticated endpoints - allow both users and admins
            .requestMatchers("/api/wishlist/**").authenticated()
            .requestMatchers(HttpMethod.GET, "/api/orders/me").authenticated()
            
            
            // Admin-only endpoints for managing all orders
            .requestMatchers(HttpMethod.GET, "/api/orders").hasRole("ADMIN")
            .requestMatchers(HttpMethod.GET, "/api/users", "/api/users/**").hasRole("ADMIN")
            .requestMatchers(HttpMethod.DELETE, "/api/orders/{id}").hasRole("ADMIN")
            .requestMatchers("/admin/**").hasRole("ADMIN")
            
            // Everything else requires authentication
            .anyRequest().authenticated()
        );

    http.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

    return http.build();
}
        
}
