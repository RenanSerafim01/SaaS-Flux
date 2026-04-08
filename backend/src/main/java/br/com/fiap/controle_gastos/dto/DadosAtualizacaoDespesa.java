package br.com.fiap.controle_gastos.dto;

import br.com.fiap.controle_gastos.model.TipoPagamento;
import jakarta.validation.constraints.NotNull;
import java.time.OffsetDateTime;

public record DadosAtualizacaoDespesa(
        @NotNull Long id,
        String descricao,
        Integer valorCentavos,
        OffsetDateTime dataDespesa,
        Long idCategoria,
        TipoPagamento metodoPagamento
) {}
