package jazz.cosplay_store.service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import jazz.cosplay_store.repository.UserRepository;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import jazz.cosplay_store.model.User;
import jazz.cosplay_store.repository.UserRepository.*;

import jazz.cosplay_store.repository.UserRepository;
public class UserService {
   /*  private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder; */

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User registerUser(User user) {
        // encode raw password before saving
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    
    public User findByUsername(String username) {
    return userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));
}
@Autowired
private PasswordEncoder passwordEncoder;

@Autowired
private UserRepository userRepository;

@PostConstruct
public void init() {
    if (userRepository.findByUsername("JAZZ").isEmpty()) {
        User admin = new User();
        admin.setUsername("JAZZ");
        admin.setPassword(passwordEncoder.encode("1234")); // hashes with YOUR app’s encoder
        admin.setRole("ROLE_ADMIN");
        userRepository.save(admin);
    }
}

}
