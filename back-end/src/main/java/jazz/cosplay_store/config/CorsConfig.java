package jazz.cosplay_store.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.ArrayList;
import java.util.List;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Value("${app.frontend-url:}")
    private String frontendUrl;

    private List<String> buildAllowedOrigins() {
        List<String> origins = new ArrayList<>();
        origins.add("http://localhost:3000");
        origins.add("http://127.0.0.1:3000");
        origins.add("http://localhost:5173");
        if (frontendUrl != null && !frontendUrl.isBlank()) {
            origins.add(frontendUrl);
        }
        return origins;
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        List<String> origins = buildAllowedOrigins();
        registry.addMapping("/**")
                .allowedOrigins(origins.toArray(new String[0]))
                .allowedOriginPatterns("https://*.vercel.app")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }

     @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        List<String> origins = buildAllowedOrigins();
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowCredentials(true);
        configuration.setAllowedOrigins(origins);
        configuration.addAllowedOriginPattern("https://*.vercel.app");
        configuration.addAllowedHeader("*");
        configuration.addAllowedMethod("*");
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
