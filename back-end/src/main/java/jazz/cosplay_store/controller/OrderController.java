package jazz.cosplay_store.controller;
import jazz.cosplay_store.dto.OrderDTO;
import jazz.cosplay_store.dto.ProductDTO;
import jazz.cosplay_store.dto.UserResponseDTO;
import jazz.cosplay_store.model.Order;
import jazz.cosplay_store.model.Product;
import jazz.cosplay_store.repository.OrderRepository;
import jazz.cosplay_store.repository.UserRepository;
import jazz.cosplay_store.model.User;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"}, allowCredentials = "true")
public class OrderController {

    private static final Logger logger = LoggerFactory.getLogger(OrderController.class);
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;

    public OrderController(OrderRepository orderRepository, UserRepository userRepository) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public List<OrderDTO> getAllOrders() {
        try {
            List<Object[]> rawOrders = orderRepository.findAllOrdersRaw();
            logger.info("Found {} total orders (raw)", rawOrders.size());
            
            return rawOrders
                    .stream()
                    .map(row -> {
                        try {
                            Long orderId = ((Number) row[0]).longValue();
                            // Load the full order by ID with error handling for missing products
                            try {
                                Order order = orderRepository.findById(orderId).orElse(null);
                                if (order == null) {
                                    logger.warn("Order {} not found", orderId);
                                    return null;
                                }
                                User user = order.getUser();
                                UserResponseDTO userDTO = user != null ? 
                                    new UserResponseDTO(user.getId(), user.getUsername(), user.getRole(), user.getEmail(), user.getFullName()) :
                                    null;
                                    
                                Product p = order.getProduct();
                                if (p != null) {
                                    ProductDTO productDTO = new ProductDTO(p.getId(), p.getName(), p.getDescription(), p.getPrice(),
                                            p.getCategory(), p.getSize(), p.getImageUrl(), p.getStockQuantity());
                                    return new OrderDTO(order.getId(), userDTO, productDTO, order.getQuantity(), order.getStatus(), order.getCreatedAt());
                                }
                            } catch (Exception e) {
                                logger.warn("Skipping order {} due to error loading product: {}", orderId, e.getMessage());
                            }
                            return null;
                        } catch (Exception e) {
                            logger.error("Error processing raw order row: {}", e.getMessage());
                            return null;
                        }
                    })
                    .filter(dto -> dto != null)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            logger.error("Error fetching all orders: {}", e.getMessage(), e);
            return List.of();
        }
    }

    // Endpoint for authenticated users to fetch their own orders
    @GetMapping("/me")
    public List<OrderDTO> getMyOrders(Authentication authentication) {
        try {
            if (authentication == null || !authentication.isAuthenticated()) {
                return List.of();
            }
            String username = authentication.getName();
            java.util.Optional<User> found = userRepository.findByUsername(username);
            if (found.isEmpty()) return List.of();
            User u = found.get();
            
            List<Order> orders = orderRepository.findByUserId(u.getId());
            logger.info("Found {} orders for userId={}", orders.size(), u.getId());
            
            UserResponseDTO userDTO = new UserResponseDTO(u.getId(), u.getUsername(), u.getRole(), u.getEmail(), u.getFullName());
            
            return orders
                    .stream()
                    .map(order -> {
                        try {
                            Product p = order.getProduct();
                            if (p != null) {
                                ProductDTO productDTO = new ProductDTO(p.getId(), p.getName(), p.getDescription(), p.getPrice(),
                                        p.getCategory(), p.getSize(), p.getImageUrl(), p.getStockQuantity());
                                return new OrderDTO(order.getId(), userDTO, productDTO, order.getQuantity(), order.getStatus(), order.getCreatedAt());
                            }
                        } catch (Exception e) {
                            logger.warn("Skipping order {} due to missing product: {}", order.getId(), e.getMessage());
                        }
                        return null;
                    })
                    .filter(dto -> dto != null)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            logger.error("Error fetching user orders: {}", e.getMessage(), e);
            return List.of();
        }
    }

    @GetMapping("/{id}")
    public Order getOrderById(@PathVariable Long id) {
        return orderRepository.findById(id).orElse(null);
    }

    @PostMapping
    public Order createOrder(@RequestBody Order order) {
        return orderRepository.save(order);
    }

    @DeleteMapping("/{id}")
    public void deleteOrder(@PathVariable Long id) {
        orderRepository.deleteById(id);
    }
}
