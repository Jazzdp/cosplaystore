package jazz.cosplay_store.dto;
import java.math.BigDecimal;
public class ProductResponseDTO {
    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private int stock;

    public ProductResponseDTO(Long id, String name, String description, BigDecimal price, int stock) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.stock = stock;
    }

    // getters only (read-only DTO)
    public Long getId() { return id; }
    public String getName() { return name; }
    public String getDescription() { return description; }
    public BigDecimal getPrice() { return price; }
    public int getStock() { return stock; }
    
}
