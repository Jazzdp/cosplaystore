package jazz.cosplay_store.repository;
import jazz.cosplay_store.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, Long> {
}
