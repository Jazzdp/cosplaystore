package jazz.cosplay_store.dto;
import java.math.BigDecimal;
public class ProductResponseDTO {
    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private int stockQuantity;
    private String imageUrl; 
      private String category;
      private String size;
    public ProductResponseDTO(Long id, String name, String description, BigDecimal price, int stockQuantity, String imageUrl, String category ,String size) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.stockQuantity = stockQuantity;
        this.imageUrl = imageUrl;
        this.category = category;
        this.size = size;
    }

    // getters only (read-only DTO)
    public Long getId() { return id; }
    public String getName() { return name; }
    public String getDescription() { return description; }
    public BigDecimal getPrice() { return price; }
    public int getStockQuantity() { return stockQuantity; }
    public String getImageUrl() { return imageUrl; }
    public String getCategory() { return category; }
    public String getSize() { return size; }
    
}
