package jazz.cosplay_store.dto;

import java.time.LocalDateTime;

public class OrderDTO {
    private Long id;
    private UserResponseDTO user;
    private ProductDTO product;
    private int quantity;
    private String status;
    private LocalDateTime createdAt;

    public OrderDTO() {}

    public OrderDTO(Long id, UserResponseDTO user, ProductDTO product, int quantity, String status, LocalDateTime createdAt) {
        this.id = id;
        this.user = user;
        this.product = product;
        this.quantity = quantity;
        this.status = status;
        this.createdAt = createdAt;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public UserResponseDTO getUser() { return user; }
    public void setUser(UserResponseDTO user) { this.user = user; }

    public ProductDTO getProduct() { return product; }
    public void setProduct(ProductDTO product) { this.product = product; }

    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
