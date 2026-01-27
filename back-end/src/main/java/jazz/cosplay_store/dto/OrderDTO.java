package jazz.cosplay_store.dto;

import java.time.LocalDateTime;

public class OrderDTO {
    private Long id;
    private UserResponseDTO user;
    private ProductDTO product;
    private SizeDTO size;
    private int quantity;
    private int phone;
    private String address;
    private String fullName;
    private String status;
    private LocalDateTime createdAt;

    public OrderDTO() {}

    public OrderDTO(Long id, UserResponseDTO user, ProductDTO product, SizeDTO size, int quantity, int phone, String address, String fullName, String status, LocalDateTime createdAt) {
        this.id = id;
        this.user = user;
        this.product = product;
        this.size = size;
        this.quantity = quantity;
        this.phone = phone;
        this.address = address;
        this.fullName = fullName;
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
    public int getPhone() { return phone; }
    public void setPhone(int phone) { this.phone = phone; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public SizeDTO getSize() { return size; }
    public void setSize(SizeDTO size) { this.size = size; }
    
} 
