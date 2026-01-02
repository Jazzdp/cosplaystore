package jazz.cosplay_store.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final UserDetailsService userDetailsService;
    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    public JwtAuthenticationFilter(JwtUtil jwtUtil, UserDetailsService userDetailsService) {
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");
        String path = request.getRequestURI();
        logger.info("Incoming request {} {}", request.getMethod(), path);
        if (authHeader == null) {
            logger.info("No Authorization header present for {}", path);
        } else {
            logger.info("Authorization header present (length={}) for {}", authHeader.length(), path);
        }
        String username = null;
        String token = null;

        // Example header: Authorization: Bearer eyJhbGciOiJIUzI1...
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7); // ✅ get actual JWT string
            try {
                username = jwtUtil.extractUsername(token);
                logger.info("Extracted username from token: {}", username);
            } catch (Exception e) {
                logger.warn("Failed to extract username from token: {}", e.getMessage());
                // Invalid token, continue without authentication
                filterChain.doFilter(request, response);
                return;
            }
        }

        // Authenticate if username is valid and no auth is set
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            try {
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);

                boolean valid = jwtUtil.validateToken(token, userDetails);
                logger.info("Token validation result for {}: {}", username, valid);
                logger.info("User {} has authorities: {}", username, userDetails.getAuthorities());
                if (valid) {
                    UsernamePasswordAuthenticationToken authToken =
                            new UsernamePasswordAuthenticationToken(
                                    userDetails, null, userDetails.getAuthorities());
                    authToken.setDetails(
                            new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                    logger.info("SecurityContext set for user {} with authorities: {}", username, authToken.getAuthorities());
                }
            } catch (Exception e) {
                logger.warn("Failed to authenticate user: {}", e.getMessage());
                // Failed to authenticate, continue without authentication
            }
        }

        filterChain.doFilter(request, response);
    }
    @Override
protected boolean shouldNotFilter(HttpServletRequest request) {
    String path = request.getRequestURI();
    // skip JWT check for auth and products
    return path.startsWith("/api/auth") || path.startsWith("/products") || path.equals("/") || path.equals("/status");
}
}
