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
                        user.getFullName()
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
                                user.getFullName()
                        )
                ))
                .orElse(ResponseEntity.notFound().build());
    }

    // CREATE user
    @PostMapping
    public ResponseEntity<UserResponseDTO> createUser(@Valid @RequestBody UserRequestDTO userDTO) {
        User user = new User();
        user.setUsername(userDTO.getUsername());
        user.setPassword(userDTO.getPassword()); // later: hash it 🔒
        user.setRole(userDTO.getRole());
        user.setEmail(userDTO.getEmail());
        user.setFullName(userDTO.getFullName());

        User saved = userRepository.save(user);

        return ResponseEntity.ok(new UserResponseDTO(
                saved.getId(),
                saved.getUsername(),
                saved.getRole(),
                saved.getEmail(),
                saved.getFullName()
        ));
    }

    // UPDATE user
    @PutMapping("/{id}")
    public ResponseEntity<UserResponseDTO> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody UserRequestDTO userDTO) {

        return userRepository.findById(id)
                .map(existing -> {
                    existing.setUsername(userDTO.getUsername());
                    existing.setPassword(userDTO.getPassword());
                    existing.setRole(userDTO.getRole());
                    existing.setEmail(userDTO.getEmail());
                    existing.setFullName(userDTO.getFullName());

                    User updated = userRepository.save(existing);

                    return ResponseEntity.ok(new UserResponseDTO(
                            updated.getId(),
                            updated.getUsername(),
                            updated.getRole(),
                            updated.getEmail(),
                            updated.getFullName()
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
