package br.com.fiap.controle_gastos.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public record DadosCadastroRenda(
        @NotBlank String descricao,
        @NotNull Long valorCentavos,
        @NotNull LocalDate dataRecebimento
) {
}