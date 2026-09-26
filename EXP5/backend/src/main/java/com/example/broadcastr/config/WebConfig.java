package com.example.broadcastr.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Centralised CORS rules for the whole API.
 *
 * The frontend is a Vite dev server. Vite's default port is 5173, but if
 * that port is already taken it silently moves to the next free one
 * (5174, 5175, ...). A single hard-coded @CrossOrigin("http://localhost:5173")
 * on the controller would then start rejecting requests with no obvious
 * error in the UI - it just looks like "the backend isn't connecting".
 *
 * Allowing any localhost/127.0.0.1 port during development avoids that
 * whole class of problem.
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOriginPatterns(
                        "http://localhost:*",
                        "http://127.0.0.1:*"
                )
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(false);
    }
}
