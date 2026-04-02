package br.com.fiap.controle_gastos.dto;

import br.com.fiap.controle_gastos.model.Despesa;
import br.com.fiap.controle_gastos.model.TipoPagamento;
import java.time.OffsetDateTime;

public record DadosDetalhamentoDespesa(
        Long id,
        String descricao,
        Integer valorCentavos,
        OffsetDateTime dataDespesa,
        TipoPagamento metodoPagamento,
        DadosDetalhamentoCategoria categoria
) {
    public DadosDetalhamentoDespesa(Despesa despesa) {
        this(
                despesa.getId(),
                despesa.getDescricao(),
                despesa.getValorCentavos(),
                despesa.getDataDespesa(),
                despesa.getMetodoPagamento(),
                new DadosDetalhamentoCategoria(despesa.getCategoria())
        );
    }
}