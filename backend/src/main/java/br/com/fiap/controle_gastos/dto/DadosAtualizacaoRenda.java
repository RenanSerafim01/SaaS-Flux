package br.com.fiap.controle_gastos.dto;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public record DadosAtualizacaoRenda(
        @NotNull
        Long id,

        String descricao,
        Long valorCentavos,
        LocalDate dataRecebimento
) {
}