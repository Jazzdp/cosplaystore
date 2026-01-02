package jazz.cosplay_store.controller;

import jazz.cosplay_store.dto.ProductDTO;
import jazz.cosplay_store.model.Product;
import jazz.cosplay_store.model.User;
import jazz.cosplay_store.model.Wishlist;
import jazz.cosplay_store.repository.ProductRepository;
import jazz.cosplay_store.repository.UserRepository;
import jazz.cosplay_store.repository.WishlistRepository;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/wishlist")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"}, allowCredentials = "true")
public class WishlistController {

    private static final Logger logger = LoggerFactory.getLogger(WishlistController.class);

    private final WishlistRepository wishlistRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    public WishlistController(WishlistRepository wishlistRepository, UserRepository userRepository, ProductRepository productRepository) {
        this.wishlistRepository = wishlistRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
    }

    // Get authenticated user's wishlist
    @GetMapping("/me")
    public org.springframework.http.ResponseEntity<List<ProductDTO>> getMyWishlist(Authentication authentication) {
        try {
            if (authentication == null || !authentication.isAuthenticated()) {
                logger.warn("Unauthorized access to wishlist/me");
                return org.springframework.http.ResponseEntity.status(401).body(List.of());
            }
            String username = authentication.getName();
            var user = userRepository.findByUsername(username);
            if (user.isEmpty()) {
                logger.warn("User not found: {}", username);
                return org.springframework.http.ResponseEntity.status(404).body(List.of());
            }
            
            List<ProductDTO> products = wishlistRepository.findByUserId(user.get().getId())
                    .stream()
                    .map(w -> {
                        Product p = w.getProduct();
                        return new ProductDTO(p.getId(), p.getName(), p.getDescription(), p.getPrice(),
                                p.getCategory(), p.getSize(), p.getImageUrl(), p.getStockQuantity());
                    })
                    .collect(Collectors.toList());
            logger.info("Loaded {} wishlist items for user {}", products.size(), username);
            return org.springframework.http.ResponseEntity.ok(products);
        } catch (Exception e) {
            logger.error("Error loading wishlist", e);
            return org.springframework.http.ResponseEntity.status(500).body(List.of());
        }
    }

    // Check if a product is in user's wishlist
    @GetMapping("/check/{productId}")
    public boolean isInWishlist(@PathVariable Long productId, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return false;
        }
        String username = authentication.getName();
        var user = userRepository.findByUsername(username);
        if (user.isEmpty()) return false;
        
        return wishlistRepository.findByUserIdAndProductId(user.get().getId(), productId).isPresent();
    }

    // Add product to wishlist
    @PostMapping("/add/{productId}")
    public Wishlist addToWishlist(@PathVariable Long productId, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("User not authenticated");
        }
        String username = authentication.getName();
        var user = userRepository.findByUsername(username);
        if (user.isEmpty()) throw new RuntimeException("User not found");
        
        var product = productRepository.findById(productId);
        if (product.isEmpty()) throw new RuntimeException("Product not found");
        
        // Check if already in wishlist
        var existing = wishlistRepository.findByUserIdAndProductId(user.get().getId(), productId);
        if (existing.isPresent()) {
            return existing.get(); // Already exists
        }
        
        Wishlist wishlist = new Wishlist(user.get(), product.get());
        return wishlistRepository.save(wishlist);
    }

    // Remove product from wishlist
    @DeleteMapping("/remove/{productId}")
    @Transactional
    public org.springframework.http.ResponseEntity<?> removeFromWishlist(@PathVariable Long productId, Authentication authentication) {
        logger.info("REMOVE called for productId={} authentication={} securityContextAuth={}", productId,
                authentication, org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication());

        if (authentication == null || !authentication.isAuthenticated()) {
            logger.warn("Unauthorized remove attempt for productId={}", productId);
            return org.springframework.http.ResponseEntity.status(401).body(java.util.Map.of("error", "User not authenticated"));
        }
        String username = authentication.getName();
        var user = userRepository.findByUsername(username);
        if (user.isEmpty()) {
            logger.warn("User not found for username={} when removing wishlist item {}", username, productId);
            return org.springframework.http.ResponseEntity.status(404).body(java.util.Map.of("error","User not found"));
        }

        wishlistRepository.deleteByUserIdAndProductId(user.get().getId(), productId);
        logger.info("Removed wishlist item productId={} for userId={}", productId, user.get().getId());
        return org.springframework.http.ResponseEntity.ok(java.util.Map.of("status","removed"));
    }

    // Toggle wishlist (POST) - handy for clients that have issues with DELETE or CORS preflight
    @PostMapping("/toggle/{productId}")
    @Transactional
    public org.springframework.http.ResponseEntity<?> toggleWishlist(@PathVariable Long productId, Authentication authentication) {
        logger.info("TOGGLE called for productId={} authentication={}", productId, authentication);
        if (authentication == null || !authentication.isAuthenticated()) {
            logger.warn("Unauthorized toggle attempt for productId={}", productId);
            return org.springframework.http.ResponseEntity.status(401).body(java.util.Map.of("error", "User not authenticated"));
        }
        String username = authentication.getName();
        var user = userRepository.findByUsername(username);
        if (user.isEmpty()) {
            logger.warn("User not found for username={} when toggling wishlist item {}", username, productId);
            return org.springframework.http.ResponseEntity.status(404).body(java.util.Map.of("error","User not found"));
        }

        var existing = wishlistRepository.findByUserIdAndProductId(user.get().getId(), productId);
        if (existing.isPresent()) {
            wishlistRepository.deleteByUserIdAndProductId(user.get().getId(), productId);
            logger.info("Toggled -> removed wishlist item productId={} for userId={}", productId, user.get().getId());
            return org.springframework.http.ResponseEntity.ok(java.util.Map.of("status","removed"));
        } else {
            var product = productRepository.findById(productId);
            if (product.isEmpty()) return org.springframework.http.ResponseEntity.status(404).body(java.util.Map.of("error","Product not found"));
            Wishlist wishlist = new Wishlist(user.get(), product.get());
            wishlistRepository.save(wishlist);
            logger.info("Toggled -> added wishlist item productId={} for userId={}", productId, user.get().getId());
            return org.springframework.http.ResponseEntity.ok(java.util.Map.of("status","added"));
        }
    }
}
