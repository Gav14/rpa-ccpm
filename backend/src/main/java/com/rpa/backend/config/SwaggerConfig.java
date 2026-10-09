package com.rpa.backend.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("API de Registro de Productores Agrarios (RPA)")
                        .version("1.0")
                        .description("Documentación de la API REST para la gestión de productores, cultivos y familiares.")
                        .contact(new Contact()
                                .name("Tu Nombre / Equipo")
                                .email("tu-email@ejemplo.com")));
    }
}