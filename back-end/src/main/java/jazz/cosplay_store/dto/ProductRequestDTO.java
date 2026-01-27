package jazz.cosplay_store.dto;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotEmpty;
import java.math.BigDecimal;
import java.util.List;


public class ProductRequestDTO {
    private String name;
    private Long categoryId;
    private String imageUrl;
    private String description;
    
    @Min(value = 0, message = "Price must be positive")
    private BigDecimal price;

    private List<SizeRequestDTO> sizes;

    // getters + setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }

    public List<SizeRequestDTO> getSizes() { return sizes; }
    public void setSizes(List<SizeRequestDTO> sizes) { this.sizes = sizes; }

    // For backward compatibility - removed individual stockQuantity getter/setter
    @Deprecated
    public int getStockQuantity() { return 0; }
    @Deprecated
    public void setStockQuantity(int stock) { }

    @Deprecated
    public String getSize() { return null; }
    @Deprecated
    public void setSize(String size) { }
}
