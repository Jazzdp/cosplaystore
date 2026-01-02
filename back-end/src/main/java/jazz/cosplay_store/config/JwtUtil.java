package jazz.cosplay_store.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.function.Function;
import java.util.stream.Collectors;

@Component
public class JwtUtil {

    private final SecretKey secretKey = Keys.hmacShaKeyFor("3cfa76ef14937c1c0ea519f8fc057a80fcd04a7420f8e8bcd0a7567c272e007b".getBytes());
    private final long expiration = 1000 * 60 * 60; 

    // Extract username from token
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    // Extract role from token
    public String extractRole(String token) {
        return extractClaim(token, claims -> claims.get("role", String.class));
    }

    // Generic claim extractor
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        try {
            Claims claims = Jwts.parser()
                    .verifyWith(secretKey)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
            return claimsResolver.apply(claims);
        } catch (Exception e) {
            // Malformed/expired/invalid token — return null to let caller handle absence
            return null;
        }
    }

    // Generate token with role
    public String generateToken(UserDetails userDetails) {
        // Extract role from authorities (assumes single role)
        String role = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.joining(","));
         
        return Jwts.builder()
                .subject(userDetails.getUsername())
                .claim("role", role) // ADD ROLE HERE
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(secretKey)
                .compact();
    }

    // Validate with UserDetails
    public boolean validateToken(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        if (username == null) return false;
        return (username.equals(userDetails.getUsername())) && !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) {
        Date expiration = extractExpiration(token);
        if (expiration == null) return true;  // Treat null (invalid token) as expired
        return expiration.before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }
}