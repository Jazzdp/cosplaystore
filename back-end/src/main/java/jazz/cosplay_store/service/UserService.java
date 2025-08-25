package jazz.cosplay_store.service;

import jazz.cosplay_store.model.User;
import jazz.cosplay_store.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.core.userdetails.User.UserBuilder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
@Service
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        return org.springframework.security.core.userdetails.User
                .withUsername(user.getUsername())
                .password(user.getPassword()) // already encoded
                .roles(user.getRole().replace("ROLE_", "")) // converts "ROLE_ADMIN" → "ADMIN"
                .build();
    }

    @PostConstruct
    public void init() {
        if (userRepository.findByUsername("JAZZ").isEmpty()) {
            User admin = new User();
            admin.setUsername("JAZZ");
            admin.setPassword(passwordEncoder.encode("1234")); 
            admin.setRole("ROLE_ADMIN");
            userRepository.save(admin);
        }
    }
}

