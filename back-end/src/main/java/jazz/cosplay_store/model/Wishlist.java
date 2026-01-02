package jazz.cosplay_store.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "wishlist", uniqueConstraints = {@UniqueConstraint(columnNames = {"user_id", "product_id"})})
public class Wishlist {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(name = "added_at")
    private LocalDateTime addedAt = LocalDateTime.now();

    // Constructors
    public Wishlist() {}

    public Wishlist(User user, Product product) {
        this.user = user;
        this.product = product;
        this.addedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public LocalDateTime getAddedAt() {
        return addedAt;
    }

    public void setAddedAt(LocalDateTime addedAt) {
        this.addedAt = addedAt;
    }
}
