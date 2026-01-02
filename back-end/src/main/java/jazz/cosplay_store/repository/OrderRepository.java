package jazz.cosplay_store.repository;
import jazz.cosplay_store.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
	@Query("SELECT o FROM Order o WHERE o.user.id = :userId")
	List<Order> findByUserId(@Param("userId") Long userId);
	
	@Query(value = "SELECT o.id, o.product_id, o.quantity, o.status, o.createdAt, o.user_id FROM orders o", nativeQuery = true)
	List<Object[]> findAllOrdersRaw();
}
