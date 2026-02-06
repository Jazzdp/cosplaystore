package jazz.cosplay_store.controller;

import jazz.cosplay_store.config.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import java.util.HashMap;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import jazz.cosplay_store.dto.AuthRequest;
import jazz.cosplay_store.dto.AuthResponse;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import jazz.cosplay_store.service.UserService.*;
import jazz.cosplay_store.model.User;
import jazz.cosplay_store.repository.UserRepository;
import jazz.cosplay_store.config.CorsConfig;
import java.util.Map;


@RestController
@RequestMapping("/api/auth")

public class AuthController {
private final UserRepository userRepository;
private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final JwtUtil jwtUtil;

    public AuthController(AuthenticationManager authenticationManager,
                          UserDetailsService userDetailsService,
                          JwtUtil jwtUtil , UserRepository userRepository,      
                      PasswordEncoder passwordEncoder) {
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
        this.jwtUtil = jwtUtil;
         this.userRepository = userRepository;           
    this.passwordEncoder = passwordEncoder; 
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(401).body(Map.of("error", "Missing or invalid Authorization header"));
            }
            String token = authHeader.substring(7);
            String username = jwtUtil.extractUsername(token);
            if (username == null) {
                return ResponseEntity.status(401).body(Map.of("error", "Invalid token"));
            }
            java.util.Optional<User> found = userRepository.findByUsername(username);
            if (found.isEmpty()) {
                return ResponseEntity.status(404).body(Map.of("error", "User not found"));
            }
                User u = found.get();
                return ResponseEntity.ok(Map.of(
                    "id", u.getId(),
                    "username", u.getUsername(),
                    "role", u.getRole(),
                    "email", u.getEmail(),
                    "phone", u.getPhone(),
                    "fullName", u.getFullName()
                ));
        } catch (Exception e) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid token or session", "message", e.getMessage()));
        }
    }

    @PutMapping("/me")
    public ResponseEntity<?> updateMe(@RequestHeader(value = "Authorization", required = false) String authHeader,
                                      @RequestBody Map<String, Object> payload) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(401).body(Map.of("error", "Missing or invalid Authorization header"));
            }
            String token = authHeader.substring(7);
            String username = jwtUtil.extractUsername(token);
            if (username == null) {
                return ResponseEntity.status(401).body(Map.of("error", "Invalid token"));
            }
            java.util.Optional<User> found = userRepository.findByUsername(username);
            if (found.isEmpty()) {
                return ResponseEntity.status(404).body(Map.of("error", "User not found"));
            }

            User u = found.get();
            // Only allow updating limited fields
            if (payload.containsKey("email")) u.setEmail(String.valueOf(payload.get("email")));
            if (payload.containsKey("fullName")) u.setFullName(String.valueOf(payload.get("fullName")));
            if (payload.containsKey("phone")) {
                try {
                    u.setPhone(Integer.parseInt(String.valueOf(payload.get("phone"))));
                } catch (NumberFormatException nfe) {
                    return ResponseEntity.badRequest().body(Map.of("error", "Invalid phone number format"));
                }
            }
            if (payload.containsKey("password")) {
                String raw = String.valueOf(payload.get("password"));
                if (raw != null && !raw.isBlank()) {
                    u.setPassword(passwordEncoder.encode(raw));
                }
            }

            User saved = userRepository.save(u);
            return ResponseEntity.ok(Map.of(
                    "id", saved.getId(),
                    "username", saved.getUsername(),
                    "role", saved.getRole(),
                    "email", saved.getEmail(),
                    "fullName", saved.getFullName(),
                    "phone", saved.getPhone()
            ));

        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to update profile", "message", e.getMessage()));
        }
    }

    

   
   @PostMapping("/login")
public ResponseEntity<?> login(@RequestBody AuthRequest request) {
    try {
        // Load user first to check what's in the database
        final UserDetails userDetails = userDetailsService.loadUserByUsername(request.getUsername());
        
        // Create debug info
        Map<String, Object> debugInfo = new HashMap<>();
        debugInfo.put("inputUsername", request.getUsername());
        debugInfo.put("inputPasswordLength", request.getPassword().length());
        debugInfo.put("dbPasswordHash", userDetails.getPassword());
        debugInfo.put("hashStartsWith", userDetails.getPassword().substring(0, 10));
        
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );
        
        final String jwt = jwtUtil.generateToken(userDetails);
        // include id/username/role in login response for client convenience
        try {
            java.util.Optional<User> found = userRepository.findByUsername(request.getUsername());
            if (found.isPresent()) {
                User u = found.get();
                return ResponseEntity.ok(Map.of(
                    "token", jwt,
                    "id", u.getId(),
                    "username", u.getUsername(),
                    "role", u.getRole(),
                    "email", u.getEmail(),
                    "phone", u.getPhone(),
                    "fullName", u.getFullName()
                ));
            }
        } catch (Exception ex) {
            // fall back to token-only
        }
        return ResponseEntity.ok(Map.of("token", jwt));
        
    } catch (AuthenticationException e) {
        return ResponseEntity.status(401).body(Map.of(
            "error", "Authentication failed",
            "message", e.getMessage(),
            "inputUsername", request.getUsername(),
            "inputPasswordLength", request.getPassword() != null ? request.getPassword().length() : 0
        ));
    } catch (Exception e) {
        return ResponseEntity.status(500).body(Map.of(
            "error", "User not found or other error",
            "message", e.getMessage()
        ));
    }
}
  @PostMapping("/register")
public ResponseEntity<?> register(@RequestBody User user) {
    try {
        // Check if username already exists
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Username already exists"));
        }

        // Basic validation
        if (user.getUsername() == null || user.getUsername().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Username is required"));
        }
        
        if (user.getPassword() == null || user.getPassword().length() < 4) {
            return ResponseEntity.badRequest().body(Map.of("error", "Password must be at least 4 characters"));
        }

        // Hash the password and set role
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole("ROLE_USER");

        // Save user
        User savedUser = userRepository.save(user);

        // Return success (don't include password hash)
        return ResponseEntity.ok(Map.of(
            "message", "Registration successful",
            "username", savedUser.getUsername(),
            "id", savedUser.getId()
        ));

    } catch (Exception e) {
        return ResponseEntity.badRequest().body(Map.of("error", "Registration failed: " + e.getMessage()));
    }
}

}
