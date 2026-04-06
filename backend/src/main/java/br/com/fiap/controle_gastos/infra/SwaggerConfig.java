package br.com.fiap.controle_gastos.infra;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Flux API - Controle de Gastos")
                        .description("API Rest da aplicação Flux. Desenvolvida para gestão financeira pessoal com arquitetura em nuvem.")
                        .version("Versão Beta 1.0"));
    }
}
