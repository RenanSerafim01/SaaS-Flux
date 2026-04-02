package br.com.fiap.controle_gastos.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record DadosCadastroGastoFixo(
        @NotBlank String descricao,
        @NotNull Integer valorCentavos,
        @NotNull Integer diaVencimento,
        @NotNull Long idCategoria,
        @NotBlank String metodoPagamento
) {
}