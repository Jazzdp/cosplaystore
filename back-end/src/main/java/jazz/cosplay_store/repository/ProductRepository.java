package jazz.cosplay_store.repository;

import jazz.cosplay_store.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    
    // Find products by category
    List<Product> findByCategory(String category);
    
    // Find available products
    List<Product> findByAvailableTrue();
    
    // Find products by name (case insensitive)
    List<Product> findByNameContainingIgnoreCase(String name);
    
    // Find products by price range
    @Query("SELECT p FROM Product p WHERE p.price BETWEEN :minPrice AND :maxPrice")
    List<Product> findByPriceRange(@Param("minPrice") double minPrice, @Param("maxPrice") double maxPrice);
    
    // Find products by category and available status
    List<Product> findByCategoryAndAvailableTrue(String category);
}
