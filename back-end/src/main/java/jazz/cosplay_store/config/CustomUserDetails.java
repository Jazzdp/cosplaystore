package jazz.cosplay_store.config;
import jazz.cosplay_store.model.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;

public class CustomUserDetails implements UserDetails {

    private final User user;

    public CustomUserDetails(User user) {
        this.user = user;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // Assuming your User entity has a field "role"
        return Collections.singletonList(new SimpleGrantedAuthority(user.getRole()));
    }

    @Override
    public String getPassword() {
        return user.getPassword();
    }

    @Override
    public String getUsername() {
        return user.getUsername();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true; // You can customize this
    }

    @Override
    public boolean isAccountNonLocked() {
        return true; // You can customize this
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true; // You can customize this
    }

    @Override
    public boolean isEnabled() {
        return true; // You can customize this
    }

    // Optionally expose your User entity for extra info
    public String getEmail() {
        return user.getEmail();
    }

    public String getFullName() {
        return user.getFullName();
    }
}


