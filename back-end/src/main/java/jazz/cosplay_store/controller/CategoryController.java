package jazz.cosplay_store.controller;

import jazz.cosplay_store.dto.CategoryRequestDTO;
import jazz.cosplay_store.dto.CategoryResponseDTO;
import jazz.cosplay_store.model.Category;
import jazz.cosplay_store.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin(origins = "http://localhost:3000")
public class CategoryController {

    @Autowired
    private CategoryRepository categoryRepository;

    // GET all categories
    @GetMapping
    public ResponseEntity<List<CategoryResponseDTO>> getAllCategories() {
        List<Category> categories = categoryRepository.findAll();
        return ResponseEntity.ok(
                categories.stream()
                        .map(c -> new CategoryResponseDTO(c.getId(), c.getName(), c.getPicUrl()))
                        .collect(Collectors.toList())
        );
    }

    // GET category by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getCategoryById(@PathVariable Long id) {
        return categoryRepository.findById(id)
                .map(c -> ResponseEntity.ok(new CategoryResponseDTO(c.getId(), c.getName(), c.getPicUrl())))
                .orElse(ResponseEntity.notFound().build());
    }

    // CREATE new category
    @PostMapping
    public ResponseEntity<?> createCategory(@RequestBody CategoryRequestDTO categoryDTO) {
        // Validate required fields
        if (categoryDTO.getName() == null || categoryDTO.getName().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Category name is required");
        }
        if (categoryDTO.getPicUrl() == null || categoryDTO.getPicUrl().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Category picture URL is required");
        }

        Category category = new Category(categoryDTO.getName(), categoryDTO.getPicUrl());
        Category saved = categoryRepository.save(category);

        return ResponseEntity.ok(new CategoryResponseDTO(saved.getId(), saved.getName(), saved.getPicUrl()));
    }

    // UPDATE category
    @PutMapping("/{id}")
    public ResponseEntity<?> updateCategory(@PathVariable Long id, @RequestBody CategoryRequestDTO categoryDTO) {
        return categoryRepository.findById(id)
                .map(existing -> {
                    if (categoryDTO.getName() != null && !categoryDTO.getName().trim().isEmpty()) {
                        existing.setName(categoryDTO.getName());
                    }
                    if (categoryDTO.getPicUrl() != null && !categoryDTO.getPicUrl().trim().isEmpty()) {
                        existing.setPicUrl(categoryDTO.getPicUrl());
                    }

                    Category updated = categoryRepository.save(existing);
                    return ResponseEntity.ok(new CategoryResponseDTO(updated.getId(), updated.getName(), updated.getPicUrl()));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // DELETE category
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCategory(@PathVariable Long id) {
        return categoryRepository.findById(id)
                .map(category -> {
                    categoryRepository.delete(category);
                    return ResponseEntity.ok("Category deleted successfully");
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
