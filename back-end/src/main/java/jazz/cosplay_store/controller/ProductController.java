package jazz.cosplay_store.controller;

import jazz.cosplay_store.dto.ProductRequestDTO;
import jazz.cosplay_store.dto.ProductResponseDTO;
import jazz.cosplay_store.model.Product;
import jazz.cosplay_store.repository.ProductRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/products")
public class ProductController {

    private final ProductRepository productRepository;

    public ProductController(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    // GET all products
    @GetMapping
    public List<ProductResponseDTO> getAllProducts() {
        return productRepository.findAll()
                .stream()
                .map(p -> new ProductResponseDTO(
                        p.getId(),
                        p.getName(),
                        p.getDescription(),
                        p.getPrice(),
                        p.getStockQuantity()
                ))
                .collect(Collectors.toList());
    }

    // GET product by ID
    @GetMapping("/{id}")
    public ResponseEntity<ProductResponseDTO> getProductById(@PathVariable Long id) {
        return productRepository.findById(id)
                .map(p -> ResponseEntity.ok(
                        new ProductResponseDTO(
                                p.getId(),
                                p.getName(),
                                p.getDescription(),
                                p.getPrice(),
                                p.getStockQuantity()
                        )
                ))
                .orElse(ResponseEntity.notFound().build());
    }

    // CREATE product
    @PostMapping
    public ResponseEntity<ProductResponseDTO> createProduct(@Valid @RequestBody ProductRequestDTO productDTO) {
        Product product = new Product();
        product.setName(productDTO.getName());
        product.setDescription(productDTO.getDescription());
        product.setPrice(productDTO.getPrice());
        product.setStockQuantity(productDTO.getStock());

        Product saved = productRepository.save(product);

        return ResponseEntity.ok(new ProductResponseDTO(
                saved.getId(),
                saved.getName(),
                saved.getDescription(),
                saved.getPrice(),
                saved.getStockQuantity()
        ));
    }

    // UPDATE product
    @PutMapping("/{id}")
    public ResponseEntity<ProductResponseDTO> updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody ProductRequestDTO productDTO) {

        return productRepository.findById(id)
                .map(existing -> {
                    existing.setName(productDTO.getName());
                    existing.setDescription(productDTO.getDescription());
                    existing.setPrice(productDTO.getPrice());
                    existing.setStockQuantity(productDTO.getStock());

                    Product updated = productRepository.save(existing);

                    return ResponseEntity.ok(new ProductResponseDTO(
                            updated.getId(),
                            updated.getName(),
                            updated.getDescription(),
                            updated.getPrice(),
                            updated.getStockQuantity()
                    ));
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
}
