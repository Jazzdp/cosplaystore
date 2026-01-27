package jazz.cosplay_store.controller;

import jazz.cosplay_store.dto.UserRequestDTO;
import jazz.cosplay_store.dto.UserResponseDTO;
import jazz.cosplay_store.model.User;
import jazz.cosplay_store.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import jazz.cosplay_store.exception.GlobalExceptionHandler.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"}, allowCredentials = "true")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // GET all users
    @GetMapping
    public List<UserResponseDTO> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(user -> new UserResponseDTO(
                        user.getId(),
                        user.getUsername(),
                        user.getRole(),
                        user.getEmail(),
                        user.getFullName(),
                        user.getPhone()
                        
                ))
                .collect(Collectors.toList());
    }

    // GET user by ID
    @GetMapping("/{id}")
    public ResponseEntity<UserResponseDTO> getUserById(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(user -> ResponseEntity.ok(
                        new UserResponseDTO(
                                user.getId(),
                                user.getUsername(),
                                user.getRole(),
                                user.getEmail(),
                                user.getFullName(),
                                user.getPhone()
                        )
                ))
                .orElse(ResponseEntity.notFound().build());
    }

    // CREATE user
    @PostMapping
    public ResponseEntity<?> createUser(@RequestBody UserRequestDTO userDTO) {
        // Validate required fields for creation
        if (userDTO.getUsername() == null || userDTO.getUsername().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Username is required");
        }
        if (userDTO.getPassword() == null || userDTO.getPassword().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Password is required");
        }
        if (userDTO.getPassword().length() < 6) {
            return ResponseEntity.badRequest().body("Password must be at least 6 characters long");
        }
        if (userDTO.getRole() == null || userDTO.getRole().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Role is required");
        }
        if (userDTO.getEmail() == null || userDTO.getEmail().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Email is required");
        }
        if (userDTO.getFullName() == null || userDTO.getFullName().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Full name is required");
        }

        User user = new User();
        user.setUsername(userDTO.getUsername());
        user.setPassword(userDTO.getPassword()); // later: hash it 🔒
        user.setRole(userDTO.getRole());
        user.setEmail(userDTO.getEmail());
        user.setFullName(userDTO.getFullName());
        if (userDTO.getPhone() != null) {
            user.setPhone(userDTO.getPhone());
        }

        User saved = userRepository.save(user);

        return ResponseEntity.ok(new UserResponseDTO(
                saved.getId(),
                saved.getUsername(),
                saved.getRole(),
                saved.getEmail(),
                saved.getFullName(),
                saved.getPhone()
        ));
    }

    // UPDATE user
    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(
            @PathVariable Long id,
            @RequestBody UserRequestDTO userDTO) {

        return userRepository.findById(id)
                .map(existing -> {
                    if (userDTO.getUsername() != null && !userDTO.getUsername().trim().isEmpty()) {
                        existing.setUsername(userDTO.getUsername());
                    }
                    if (userDTO.getPassword() != null && !userDTO.getPassword().trim().isEmpty()) {
                        if (userDTO.getPassword().length() < 6) {
                            return ResponseEntity.badRequest().body("Password must be at least 6 characters long");
                        }
                        existing.setPassword(userDTO.getPassword());
                    }
                    if (userDTO.getRole() != null && !userDTO.getRole().trim().isEmpty()) {
                        existing.setRole(userDTO.getRole());
                    }
                    if (userDTO.getEmail() != null && !userDTO.getEmail().trim().isEmpty()) {
                        existing.setEmail(userDTO.getEmail());
                    }
                    if (userDTO.getFullName() != null && !userDTO.getFullName().trim().isEmpty()) {
                        existing.setFullName(userDTO.getFullName());
                    }
                    if (userDTO.getPhone() != null) {
                        existing.setPhone(userDTO.getPhone());
                    }

                    User updated = userRepository.save(existing);

                    return ResponseEntity.ok(new UserResponseDTO(
                            updated.getId(),
                            updated.getUsername(),
                            updated.getRole(),
                            updated.getEmail(),
                            updated.getFullName(),
                            updated.getPhone()
                    ));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // DELETE user
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(user -> {
                    userRepository.delete(user);
                    return ResponseEntity.noContent().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
