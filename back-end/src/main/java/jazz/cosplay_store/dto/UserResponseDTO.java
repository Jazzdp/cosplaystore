package jazz.cosplay_store.dto;

public class UserResponseDTO {
    private Long id;
    private String username;
    private String role;
    private String email;
    private String fullName;
    private int phone;

    public UserResponseDTO(Long id, String username, String role, String email, String fullName, int phone) {
        this.id = id;
        this.username = username;
        this.role = role;
        this.email = email;
        this.fullName = fullName;
        this.phone = phone;
    }

    // --- Getters ---
    public Long getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public String getRole() {
        return role;
    }

    public String getEmail() {
        return email;
    }

    public String getFullName() {
        return fullName;
    }
    public int getPhone() {
        return phone;
    }
}
