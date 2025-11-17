package jazz.cosplay_store.controller;
import jazz.cosplay_store.model.Order;
import jazz.cosplay_store.repository.OrderRepository;
import jazz.cosplay_store.repository.UserRepository;
import jazz.cosplay_store.model.User;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/orders")
public class OrderController {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;

    public OrderController(OrderRepository orderRepository, UserRepository userRepository) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    // Endpoint for authenticated users to fetch their own orders
    @GetMapping("/me")
    public List<Order> getMyOrders(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return List.of();
        }
        String username = authentication.getName();
        java.util.Optional<User> found = userRepository.findByUsername(username);
        if (found.isEmpty()) return List.of();
        User u = found.get();
        return orderRepository.findByUserId(u.getId());
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
