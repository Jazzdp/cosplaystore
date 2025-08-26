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

    

     /*@PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );
        final UserDetails userDetails = userDetailsService.loadUserByUsername(request.getUsername());
        final String jwt = jwtUtil.generateToken(userDetails);
        return ResponseEntity.ok(new AuthResponse(jwt));
        
    } */
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
        return ResponseEntity.ok(new AuthResponse(jwt));
        
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
