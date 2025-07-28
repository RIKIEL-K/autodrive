package com.example.Autodrive.Configuration;


import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // Applique la configuration CORS à tous les endpoints HTTP
                .allowedOriginPatterns(
                        "http://localhost:3000",          // Frontend en développement local
                        "http://127.0.0.1:3000",          // Parfois nécessaire aussi pour localhost
                        "https://*.amazonaws.com",      // Pour les ALB AWS ECS en production
                        "https://*.elb.amazonaws.com",
                        "http://autodrive-frontend-alb-1108088612.ca-central-1.elb.amazonaws.com"

                )
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*");
                //.allowCredentials(true);
    }
}
