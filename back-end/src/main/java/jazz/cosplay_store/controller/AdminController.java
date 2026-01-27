package jazz.cosplay_store.controller;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import java.util.Map;

   
@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')") // This protects the entire controller
public class AdminController {
    
    @GetMapping("/verify")
    public ResponseEntity<?> verifyAdmin(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body(Map.of("authorized", false));
        }
        return ResponseEntity.ok(Map.of(
            "authorized", true,
            "username", authentication.getName()
        ));
    }
}

