package jazz.cosplay_store.dto;

public class SizeDTO {
    private Long id;
    private String sizeValue;
    private Integer stock;
    private String color;

    public SizeDTO() {}

    public SizeDTO(Long id, String sizeValue, Integer stock) {
        this.id = id;
        this.sizeValue = sizeValue;
        this.stock = stock;
    }

    public SizeDTO(Long id, String sizeValue, Integer stock, String color) {
        this.id = id;
        this.sizeValue = sizeValue;
        this.stock = stock;
        this.color = color;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getSizeValue() { return sizeValue; }
    public void setSizeValue(String sizeValue) { this.sizeValue = sizeValue; }

    public Integer getStock() { return stock; }
    public void setStock(Integer stock) { this.stock = stock; }

    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }
}
