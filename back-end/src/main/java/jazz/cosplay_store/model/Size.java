package jazz.cosplay_store.model;

import jakarta.persistence.*;

@Entity
@Table(name = "sizes")
public class Size {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(nullable = false)
    private String sizeValue; // e.g., "S", "M", "L", "XL"

    @Column(nullable = false)
    private Integer stock; // quantity in stock for this size

    @Column(length = 500)
    private String color; // optional color variant

    // Constructors
    public Size() {}

    public Size(Product product, String sizeValue, Integer stock) {
        this.product = product;
        this.sizeValue = sizeValue;
        this.stock = stock;
    }

    public Size(Product product, String sizeValue, Integer stock, String color) {
        this.product = product;
        this.sizeValue = sizeValue;
        this.stock = stock;
        this.color = color;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public String getSizeValue() {
        return sizeValue;
    }

    public void setSizeValue(String sizeValue) {
        this.sizeValue = sizeValue;
    }

    public Integer getStock() {
        return stock;
    }

    public void setStock(Integer stock) {
        this.stock = stock;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }
}
