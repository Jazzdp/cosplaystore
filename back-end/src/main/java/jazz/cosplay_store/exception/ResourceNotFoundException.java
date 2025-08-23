package jazz.cosplay_store.exception;

public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message ) {
        super(message);
    }
}
