package jazz.cosplay_store.dto;
import java.math.BigDecimal;
import java.util.List;

public class ProductResponseDTO {
    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private String imageUrl; 
    private Long categoryId;
    private String categoryName;
    private List<SizeDTO> sizes;

    public ProductResponseDTO() {}

    public ProductResponseDTO(Long id, String name, String description, BigDecimal price, String imageUrl, Long categoryId, String categoryName, List<SizeDTO> sizes) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.imageUrl = imageUrl;
        this.categoryId = categoryId;
        this.categoryName = categoryName;
        this.sizes = sizes;
    }

    // getters only (read-only DTO)
    public Long getId() { return id; }
    public String getName() { return name; }
    public String getDescription() { return description; }
    public BigDecimal getPrice() { return price; }
    public String getImageUrl() { return imageUrl; }
    public Long getCategoryId() { return categoryId; }
    public String getCategoryName() { return categoryName; }
    public List<SizeDTO> getSizes() { return sizes; }
    public void setSizes(List<SizeDTO> sizes) { this.sizes = sizes; }
    
    // For backward compatibility - deprecated methods
    @Deprecated
    public int getStockQuantity() { 
        return sizes != null ? sizes.stream().mapToInt(SizeDTO::getStock).sum() : 0;
    }
    
    @Deprecated
    public String getSize() { 
        return null;
    }
}

