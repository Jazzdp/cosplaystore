package jazz.cosplay_store.dto;

public class CategoryResponseDTO {

    private Long id;

    private String name;

    private String picUrl;

    // --- Constructors ---
    public CategoryResponseDTO() {}

    public CategoryResponseDTO(Long id, String name, String picUrl) {
        this.id = id;
        this.name = name;
        this.picUrl = picUrl;
    }

    // --- Getters & Setters ---
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPicUrl() {
        return picUrl;
    }

    public void setPicUrl(String picUrl) {
        this.picUrl = picUrl;
    }
}
