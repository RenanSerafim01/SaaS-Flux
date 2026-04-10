package br.com.fiap.controle_gastos.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record DadosCadastroGastoFixo(
        @NotBlank(message = "A descrição é obrigatória")
        String descricao,

        @NotNull(message = "O valor do gasto fixo é obrigatório")
        @Positive(message = "O valor deve ser maior que zero")
        Integer valorCentavos,

        @NotNull(message = "O dia de vencimento é obrigatório")
        @Min(value = 1, message = "O dia de vencimento mínimo é 1")
        @Max(value = 31, message = "O dia de vencimento máximo é 31")
        Integer diaVencimento,

        @NotNull(message = "O ID da categoria é obrigatório")
        Long idCategoria,

        @NotBlank(message = "O método de pagamento é obrigatório")
        String metodoPagamento
) {}