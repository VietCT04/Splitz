package com.example.viet.splitz.configuration;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {
    @Bean
    public OpenAPI splitzOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Splitz API")
                        .description("Group expense tracker — equal split among active members")
                        .version("v1.0.0"));
    }
}