package jazz.cosplay_store.repository;

import jazz.cosplay_store.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;


public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
     Optional<User> findByEmail(String email);
    
    
}