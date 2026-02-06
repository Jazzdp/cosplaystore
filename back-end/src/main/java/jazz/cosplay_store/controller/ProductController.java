package jazz.cosplay_store.controller;

import jazz.cosplay_store.dto.ProductRequestDTO;
import jazz.cosplay_store.dto.ProductResponseDTO;
import jazz.cosplay_store.dto.SizeDTO;
import jazz.cosplay_store.dto.SizeRequestDTO;
import jazz.cosplay_store.model.Product;
import jazz.cosplay_store.model.Size;
import jazz.cosplay_store.model.Category;
import jazz.cosplay_store.repository.ProductRepository;
import jazz.cosplay_store.repository.SizeRepository;
import jazz.cosplay_store.repository.CategoryRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.Objects;
import jazz.cosplay_store.config.CorsConfig;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping({"/products", "/api/products"})

public class ProductController {

    private final ProductRepository productRepository;
    private final SizeRepository sizeRepository;
    private final CategoryRepository categoryRepository;

    public ProductController(ProductRepository productRepository, SizeRepository sizeRepository, CategoryRepository categoryRepository) {
        this.productRepository = productRepository;
        this.sizeRepository = sizeRepository;
        this.categoryRepository = categoryRepository;
    }

    // Helper method to convert Product to ProductResponseDTO
    private ProductResponseDTO convertToResponseDTO(Product product) {
        List<SizeDTO> sizeDTOs = product.getSizes()
                .stream()
                .map(s -> new SizeDTO(s.getId(), s.getSizeValue(), s.getStock(), s.getColor()))
                .collect(Collectors.toList());
        
        Category category = product.getCategoryEntity();
        return new ProductResponseDTO(
                product.getId(),
                product.getName(),
                product.getDescription(),
                product.getPrice(),
                product.getImageUrl(),
                category != null ? category.getId() : null,
                category != null ? category.getName() : null,
                sizeDTOs
        );
    }

    // GET all products
    @GetMapping
    public List<ProductResponseDTO> getAllProducts() {
        return productRepository.findAll()
                .stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    // GET product by ID
    @GetMapping("/{id}")
    public ResponseEntity<ProductResponseDTO> getProductById(@PathVariable Long id) {
        return productRepository.findById(id)
                .map(p -> ResponseEntity.ok(convertToResponseDTO(p)))
                .orElse(ResponseEntity.notFound().build());
    }

    // CREATE product with sizes
    @PostMapping
    public ResponseEntity<?> createProduct(@RequestBody ProductRequestDTO productDTO) {
        // Validate required fields for creation
        if (productDTO.getName() == null || productDTO.getName().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Product name is required");
        }
        if (productDTO.getCategoryId() == null) {
            return ResponseEntity.badRequest().body("Category ID is required");
        }
        if (productDTO.getPrice() == null || productDTO.getPrice().signum() <= 0) {
            return ResponseEntity.badRequest().body("Valid price is required");
        }
        if (productDTO.getImageUrl() == null || productDTO.getImageUrl().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Image URL is required");
        }
        if (productDTO.getSizes() == null || productDTO.getSizes().isEmpty()) {
            return ResponseEntity.badRequest().body("At least one size is required");
        }

        // Find category by ID
        Category category = categoryRepository.findById(productDTO.getCategoryId())
                .orElse(null);
        if (category == null) {
            return ResponseEntity.badRequest().body("Category not found");
        }

        Product product = new Product();
        product.setName(productDTO.getName());
        product.setDescription(productDTO.getDescription());
        product.setPrice(productDTO.getPrice());
        product.setCategory(category);
        product.setImageUrl(productDTO.getImageUrl());

        Product saved = productRepository.save(product);

        // Add sizes if provided
        if (productDTO.getSizes() != null && !productDTO.getSizes().isEmpty()) {
            for (SizeRequestDTO sizeReq : productDTO.getSizes()) {
                Size size = new Size(saved, sizeReq.getSizeValue(), sizeReq.getStock(), sizeReq.getColor());
                sizeRepository.save(size);
                saved.addSize(size);
            }
        }

        return ResponseEntity.ok(convertToResponseDTO(saved));
    }

    // UPDATE product with sizes
    @Transactional
    @PutMapping("/{id}")
    public ResponseEntity<?> updateProduct(
            @PathVariable Long id,
            @RequestBody ProductRequestDTO productDTO) {

        return productRepository.findById(id)
                .map(existing -> {
                    // Only update fields that are provided (not null)
                    if (productDTO.getName() != null && !productDTO.getName().trim().isEmpty()) {
                        existing.setName(productDTO.getName());
                    }
                    if (productDTO.getDescription() != null && !productDTO.getDescription().trim().isEmpty()) {
                        existing.setDescription(productDTO.getDescription());
                    }
                    if (productDTO.getPrice() != null && productDTO.getPrice().signum() > 0) {
                        existing.setPrice(productDTO.getPrice());
                    }
                    if (productDTO.getCategoryId() != null) {
                        Category category = categoryRepository.findById(productDTO.getCategoryId()).orElse(null);
                        if (category != null) {
                            existing.setCategory(category);
                        }
                    }
                    if (productDTO.getImageUrl() != null && !productDTO.getImageUrl().trim().isEmpty()) {
                        existing.setImageUrl(productDTO.getImageUrl());
                    }

                    // Update sizes if provided
                    if (productDTO.getSizes() != null && !productDTO.getSizes().isEmpty()) {
                        // Update existing sizes or add new ones (don't delete to avoid breaking orders)
                        for (SizeRequestDTO sizeReq : productDTO.getSizes()) {
                            // Check if size already exists (using null-safe comparison)
                            Size existingSize = existing.getSizes().stream()
                                    .filter(s -> s.getSizeValue().equals(sizeReq.getSizeValue()) && 
                                                 Objects.equals(s.getColor(), sizeReq.getColor()))
                                    .findFirst()
                                    .orElse(null);
                            
                            if (existingSize != null) {
                                // Update stock of existing size
                                existingSize.setStock(sizeReq.getStock());
                                sizeRepository.save(existingSize);
                            } else {
                                // Add new size
                                Size newSize = new Size(existing, sizeReq.getSizeValue(), sizeReq.getStock(), sizeReq.getColor());
                                sizeRepository.save(newSize);
                                existing.addSize(newSize);
                            }
                        }
                    }

                    Product updated = productRepository.save(existing);
                    return ResponseEntity.ok(convertToResponseDTO(updated));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // DELETE product
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        return productRepository.findById(id)
                .map(p -> {
                    productRepository.delete(p);
                    return ResponseEntity.noContent().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Get sizes for a product
    @GetMapping("/{id}/sizes")
    public ResponseEntity<List<SizeDTO>> getProductSizes(@PathVariable Long id) {
        return productRepository.findById(id)
                .map(product -> {
                    List<SizeDTO> sizes = product.getSizes()
                            .stream()
                            .map(s -> new SizeDTO(s.getId(), s.getSizeValue(), s.getStock(), s.getColor()))
                            .collect(Collectors.toList());
                    return ResponseEntity.ok(sizes);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Add size to product
    @PostMapping("/{id}/sizes")
    public ResponseEntity<SizeDTO> addSizeToProduct(
            @PathVariable Long id,
            @Valid @RequestBody SizeRequestDTO sizeDTO) {
        return productRepository.findById(id)
                .map(product -> {
                    Size size = new Size(product, sizeDTO.getSizeValue(), sizeDTO.getStock(), sizeDTO.getColor());
                    Size saved = sizeRepository.save(size);
                    product.addSize(saved);
                    productRepository.save(product);
                    
                    return ResponseEntity.ok(new SizeDTO(saved.getId(), saved.getSizeValue(), saved.getStock(), saved.getColor()));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Update size
    @PutMapping("/sizes/{sizeId}")
    public ResponseEntity<SizeDTO> updateSize(
            @PathVariable Long sizeId,
            @Valid @RequestBody SizeRequestDTO sizeDTO) {
        return sizeRepository.findById(sizeId)
                .map(size -> {
                    size.setSizeValue(sizeDTO.getSizeValue());
                    size.setStock(sizeDTO.getStock());
                    size.setColor(sizeDTO.getColor());
                    Size updated = sizeRepository.save(size);
                    
                    return ResponseEntity.ok(new SizeDTO(updated.getId(), updated.getSizeValue(), updated.getStock(), updated.getColor()));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Delete size
    @DeleteMapping("/sizes/{sizeId}")
    public ResponseEntity<Void> deleteSize(@PathVariable Long sizeId) {
        return sizeRepository.findById(sizeId)
                .map(size -> {
                    sizeRepository.delete(size);
                    return ResponseEntity.noContent().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
