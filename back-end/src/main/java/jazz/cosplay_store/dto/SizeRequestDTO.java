package jazz.cosplay_store.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public class SizeRequestDTO {
    @NotBlank(message = "Size value is required")
    private String sizeValue;

    @Min(value = 0, message = "Stock cannot be negative")
    private Integer stock;

    private String color;

    public SizeRequestDTO() {}

    public SizeRequestDTO(String sizeValue, Integer stock) {
        this.sizeValue = sizeValue;
        this.stock = stock;
    }

    public SizeRequestDTO(String sizeValue, Integer stock, String color) {
        this.sizeValue = sizeValue;
        this.stock = stock;
        this.color = color;
    }

    // Getters and Setters
    public String getSizeValue() { return sizeValue; }
    public void setSizeValue(String sizeValue) { this.sizeValue = sizeValue; }

    public Integer getStock() { return stock; }
    public void setStock(Integer stock) { this.stock = stock; }

    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }
}
