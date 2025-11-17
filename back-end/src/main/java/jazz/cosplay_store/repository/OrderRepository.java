package jazz.cosplay_store.repository;
import jazz.cosplay_store.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
	List<Order> findByUserId(Long userId);
    List<Order> findAll();
}
