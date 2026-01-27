package jazz.cosplay_store.repository;

import jazz.cosplay_store.model.Size;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SizeRepository extends JpaRepository<Size, Long> {
    List<Size> findByProductId(Long productId);
    void deleteByProductId(Long productId);
}
