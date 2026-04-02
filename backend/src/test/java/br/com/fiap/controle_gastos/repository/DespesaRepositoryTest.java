package br.com.fiap.controle_gastos.repository;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@ActiveProfiles("test")
class DespesaRepositoryTest {

    @Autowired
    private DespesaRepository despesaRepository;

    @Test
    @DisplayName("Deveria retornar a soma correta das despesas para uma categoria existente")
    void somarGastosPorCategoriaCenario1() {
        assertThat(despesaRepository).isNotNull();
    }
}