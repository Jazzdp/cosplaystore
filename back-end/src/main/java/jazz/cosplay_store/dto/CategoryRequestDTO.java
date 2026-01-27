package jazz.cosplay_store.dto;

public class CategoryRequestDTO {

    private String name;

    private String picUrl;

    // --- Constructors ---
    public CategoryRequestDTO() {}

    public CategoryRequestDTO(String name, String picUrl) {
        this.name = name;
        this.picUrl = picUrl;
    }

    // --- Getters & Setters ---
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
