package br.com.fiap.controle_gastos.dto;

import br.com.fiap.controle_gastos.model.TipoPagamento;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Positive;
import java.time.OffsetDateTime;

public record DadosCadastroDespesa(
        @NotBlank(message = "A descrição não pode ficar em branco")
        String descricao,

        @NotNull(message = "O valor da despesa é obrigatório")
        @Positive(message = "O valor não pode ser negativo ou zero!")
        Integer valorCentavos,

        @NotNull(message = "A data da despesa é obrigatória")
        @PastOrPresent(message = "A data da despesa não pode ser no futuro")
        OffsetDateTime dataDespesa,

        @NotNull(message = "O método de pagamento é obrigatório")
        TipoPagamento metodoPagamento,

        @NotNull(message = "O ID da categoria é obrigatório")
        Long idCategoria
) {
}
