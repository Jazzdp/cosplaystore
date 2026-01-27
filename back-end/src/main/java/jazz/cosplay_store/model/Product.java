package jazz.cosplay_store.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.List;
import java.util.ArrayList;

@Entity
@Table(name = "products")
public class Product {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(length = 1000)
    private String description;
    
    @Column(nullable = false)
    private BigDecimal price;
    
    @ManyToOne(fetch = FetchType.EAGER, optional = true)
    @JoinColumn(name = "category_id", nullable = true)
    private Category category;
    
    @Column(name = "image_url", length = 4049)
    private String imageUrl;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<Size> sizes = new ArrayList<>();
    

    // Constructors
    public Product() {}

    public Product(String name, String description, BigDecimal price, Category category) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.category = category;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public String getCategory() { return category != null ? category.getName() : null; }
    public void setCategory(Category category) { this.category = category; }
    
    public Category getCategoryEntity() { return category; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public List<Size> getSizes() { return sizes; }
    public void setSizes(List<Size> sizes) { this.sizes = sizes; }

    public void addSize(Size size) {
        sizes.add(size);
        size.setProduct(this);
    }

    public void removeSize(Size size) {
        sizes.remove(size);
        size.setProduct(null);
    }
}
