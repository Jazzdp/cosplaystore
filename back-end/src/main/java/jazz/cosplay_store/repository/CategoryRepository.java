package jazz.cosplay_store.repository;

import jazz.cosplay_store.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {
}
