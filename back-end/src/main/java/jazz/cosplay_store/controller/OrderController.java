package jazz.cosplay_store.controller;

import jazz.cosplay_store.dto.OrderDTO;
import jazz.cosplay_store.dto.ProductDTO;
import jazz.cosplay_store.dto.SizeDTO;
import jazz.cosplay_store.dto.UserResponseDTO;
import jazz.cosplay_store.model.Order;
import jazz.cosplay_store.model.Product;
import jazz.cosplay_store.model.Size;
import jazz.cosplay_store.model.User;
import jazz.cosplay_store.repository.OrderRepository;
import jazz.cosplay_store.repository.ProductRepository;
import jazz.cosplay_store.repository.SizeRepository;
import jazz.cosplay_store.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import jazz.cosplay_store.config.CorsConfig;
@RestController
@RequestMapping("/api/orders")

public class OrderController {

    private static final Logger logger = LoggerFactory.getLogger(OrderController.class);
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final SizeRepository sizeRepository;

    public OrderController(OrderRepository orderRepository, UserRepository userRepository, ProductRepository productRepository, SizeRepository sizeRepository) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.sizeRepository = sizeRepository;
    }

    // Helper method to convert Product to ProductDTO with sizes
    private ProductDTO convertToProductDTO(Product p) {
        java.util.List<SizeDTO> sizeDTOs = p.getSizes()
                .stream()
                .map(s -> new SizeDTO(s.getId(), s.getSizeValue(), s.getStock(), s.getColor()))
                .collect(Collectors.toList());
        return new ProductDTO(p.getId(), p.getName(), p.getDescription(), p.getPrice(),
                p.getCategory(), p.getImageUrl(), sizeDTOs);
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
                            try {
                                Order order = orderRepository.findById(orderId).orElse(null);
                                if (order == null) {
                                    logger.warn("Order {} not found", orderId);
                                    return null;
                                }
                                User user = order.getUser();
                                UserResponseDTO userDTO = user != null ?  //use ternary to handle null user
                                    new UserResponseDTO(user.getId(), user.getUsername(), user.getRole(), user.getEmail(), user.getFullName(), user.getPhone()) :
                                    null;
                                    
                                Product p = order.getProduct();
                                if (p != null) {
                                    ProductDTO productDTO = convertToProductDTO(p);
                                    SizeDTO sizeDTO = null;
                                    if (order.getSize() != null) {
                                        Size s = order.getSize();
                                        sizeDTO = new SizeDTO(s.getId(), s.getSizeValue(), s.getStock(), s.getColor());
                                    }
                                    return new OrderDTO(order.getId(), userDTO, productDTO, sizeDTO, order.getQuantity(), order.getPhone(), order.getAddress(), order.getFullName(), order.getStatus(), order.getCreatedAt());
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
            
            UserResponseDTO userDTO = new UserResponseDTO(u.getId(), u.getUsername(), u.getRole(), u.getEmail(), u.getFullName(), u.getPhone());
            
            return orders
                    .stream()
                    .map(order -> {
                        try {
                            Product p = order.getProduct();
                            if (p != null) {
                                ProductDTO productDTO = convertToProductDTO(p);
                                SizeDTO sizeDTO = null;
                                if (order.getSize() != null) {
                                    Size s = order.getSize();
                                    sizeDTO = new SizeDTO(s.getId(), s.getSizeValue(), s.getStock(), s.getColor());
                                }
                                return new OrderDTO(order.getId(), userDTO, productDTO, sizeDTO, order.getQuantity(), order.getPhone(), order.getAddress(), order.getFullName(), order.getStatus(), order.getCreatedAt());
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
    public ResponseEntity<?> createOrder(@RequestBody OrderDTO orderDTO) {
        try {
            logger.info("Creating order from DTO: user={}, product={}, quantity={}", 
                orderDTO.getUser(), orderDTO.getProduct(), orderDTO.getQuantity());
            
            Order order = new Order();
            
            // User is OPTIONAL - can be null for guest orders
            if (orderDTO.getUser() != null && orderDTO.getUser().getId() != null) {
                User user = userRepository.findById(orderDTO.getUser().getId())
                    .orElseThrow(() -> new RuntimeException("User not found"));
                order.setUser(user);
                logger.info("Order linked to user: {}", user.getUsername());
            } else {
                logger.info("Creating guest order (no user)");
            }
            
            // Product is REQUIRED
            if (orderDTO.getProduct() == null || orderDTO.getProduct().getId() == null) {
                throw new RuntimeException("Product is required");
            }
            Product product = productRepository.findById(orderDTO.getProduct().getId())
                .orElseThrow(() -> new RuntimeException("Product not found"));
            order.setProduct(product);
            
            // Size is OPTIONAL
            if (orderDTO.getSize() != null && orderDTO.getSize().getId() != null) {
                Size size = sizeRepository.findById(orderDTO.getSize().getId())
                    .orElseThrow(() -> new RuntimeException("Size not found"));
                order.setSize(size);
                
                // Decrement stock when order is created
                int currentStock = size.getStock();
                if (currentStock < orderDTO.getQuantity()) {
                    throw new RuntimeException("Insufficient stock for size " + size.getSizeValue());
                }
                size.setStock(currentStock - orderDTO.getQuantity());
                sizeRepository.save(size);
                logger.info("Stock decremented for size: {} by quantity: {}", size.getSizeValue(), orderDTO.getQuantity());
            } else {
                logger.info("Creating order without specific size");
            }
            
            order.setQuantity(orderDTO.getQuantity());
            order.setFullName(orderDTO.getFullName());
            order.setAddress(orderDTO.getAddress());
            order.setPhone(orderDTO.getPhone());
            order.setStatus(orderDTO.getStatus() != null ? orderDTO.getStatus() : "Pending");
            order.setCreatedAt(LocalDateTime.now());
            
            Order saved = orderRepository.save(order);
            logger.info("Order created successfully with id: {}", saved.getId());
            
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            logger.error("Error creating order: ", e);
            return ResponseEntity.status(500).body("Failed to create order: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateOrder(@PathVariable Long id, @RequestBody OrderDTO orderDTO) {
        try {
            Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
            
            logger.info("Updating order {}, incoming size: {}", id, orderDTO.getSize() != null ? orderDTO.getSize().getId() : "null");
            
            // Handle size change with stock adjustment
            Size oldSize = order.getSize();
            Size newSize = null;
            
            if (orderDTO.getSize() != null && orderDTO.getSize().getId() != null) {
                newSize = sizeRepository.findById(orderDTO.getSize().getId())
                    .orElseThrow(() -> new RuntimeException("Size not found with ID: " + orderDTO.getSize().getId()));
                logger.info("Found new size: {} with stock: {}", newSize.getSizeValue(), newSize.getStock());
            }
            
            // Check if size is actually changing
            Long oldSizeId = oldSize != null ? oldSize.getId() : null;
            Long newSizeId = newSize != null ? newSize.getId() : null;
            int oldQuantity = order.getQuantity();
            int newQuantity = orderDTO.getQuantity() > 0 ? orderDTO.getQuantity() : oldQuantity;
            
            if (oldSizeId == null && newSizeId != null) {
                // Adding a size to order that had no size
                logger.info("Adding size to order - decrementing stock for size {}", newSize.getSizeValue());
                int newStock = newSize.getStock();
                if (newStock < newQuantity) {
                    throw new RuntimeException("Insufficient stock for size " + newSize.getSizeValue() + ". Need: " + newQuantity + ", Have: " + newStock);
                }
                newSize.setStock(newStock - newQuantity);
                sizeRepository.save(newSize);
                logger.info("Stock decremented for new size: {} by quantity: {}", newSize.getSizeValue(), newQuantity);
            } else if (oldSizeId != null && newSizeId == null) {
                // Removing size from order
                logger.info("Removing size from order - restoring stock for size {}", oldSize.getSizeValue());
                int oldStock = oldSize.getStock();
                oldSize.setStock(oldStock + oldQuantity);
                sizeRepository.save(oldSize);
                logger.info("Stock restored for removed size: {} by quantity: {}", oldSize.getSizeValue(), oldQuantity);
            } else if (oldSizeId != null && newSizeId != null && !oldSizeId.equals(newSizeId)) {
                // Changing from one size to another
                logger.info("Changing size from {} to {}", oldSize.getSizeValue(), newSize.getSizeValue());
                
                // Restore stock for old size
                int oldStock = oldSize.getStock();
                oldSize.setStock(oldStock + oldQuantity);
                sizeRepository.save(oldSize);
                logger.info("Stock restored for old size: {} by quantity: {}", oldSize.getSizeValue(), oldQuantity);
                
                // Decrement stock for new size
                int newStock = newSize.getStock();
                if (newStock < newQuantity) {
                    throw new RuntimeException("Insufficient stock for size " + newSize.getSizeValue() + ". Need: " + newQuantity + ", Have: " + newStock);
                }
                newSize.setStock(newStock - newQuantity);
                sizeRepository.save(newSize);
                logger.info("Stock decremented for new size: {} by quantity: {}", newSize.getSizeValue(), newQuantity);
            } else if (oldSizeId != null && newSizeId != null && oldSizeId.equals(newSizeId) && oldQuantity != newQuantity) {
                // Same size but quantity changed - adjust stock accordingly
                logger.info("Quantity changed for same size from {} to {}", oldQuantity, newQuantity);
                int currentStock = oldSize.getStock();
                int quantityDifference = newQuantity - oldQuantity;  // positive if increasing, negative if decreasing
                
                if (quantityDifference > 0) {
                    // Quantity increased - need to decrement more stock
                    if (currentStock < quantityDifference) {
                        throw new RuntimeException("Insufficient stock for size " + oldSize.getSizeValue() + ". Need: " + quantityDifference + " more, Have: " + currentStock);
                    }
                    oldSize.setStock(currentStock - quantityDifference);
                    logger.info("Stock decremented for size {} by quantity difference: {}", oldSize.getSizeValue(), quantityDifference);
                } else {
                    // Quantity decreased - restore stock
                    oldSize.setStock(currentStock - quantityDifference);  // subtracting a negative = adding
                    logger.info("Stock restored for size {} by quantity difference: {}", oldSize.getSizeValue(), -quantityDifference);
                }
                sizeRepository.save(oldSize);
            }
            
            order.setSize(newSize);
            
            if (newQuantity > 0) {
                order.setQuantity(newQuantity);
            }
            if (orderDTO.getStatus() != null) {
                order.setStatus(orderDTO.getStatus());
            }
            if (orderDTO.getFullName() != null && !orderDTO.getFullName().isEmpty()) {
                order.setFullName(orderDTO.getFullName());
            }
            if (orderDTO.getPhone() > 0) {
                order.setPhone(orderDTO.getPhone());
            }
            if (orderDTO.getAddress() != null && !orderDTO.getAddress().isEmpty()) {
                order.setAddress(orderDTO.getAddress());
            }
            
            Order updated = orderRepository.save(order);
            logger.info("Order {} updated successfully with size: {}", id, updated.getSize() != null ? updated.getSize().getSizeValue() : "null");
            
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            logger.error("Error updating order {}: {}", id, e.getMessage(), e);
            return ResponseEntity.status(500).body("Failed to update order: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteOrder(@PathVariable Long id) {
        try {
            // Fetch the order to get size information before deleting
            Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
            
            // Restore stock if the order has a size
            if (order.getSize() != null) {
                Size size = order.getSize();
                int currentStock = size.getStock();
                size.setStock(currentStock + order.getQuantity());
                sizeRepository.save(size);
                logger.info("Stock restored for size: {} by quantity: {}", size.getSizeValue(), order.getQuantity());
            }
            
            // Delete the order
            orderRepository.deleteById(id);
            logger.info("Order {} deleted successfully and stock restored", id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            logger.error("Error deleting order {}: ", id, e);
            return ResponseEntity.status(500).body("Failed to delete order: " + e.getMessage());
        }
    }
}