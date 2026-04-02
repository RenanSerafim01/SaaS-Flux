package br.com.fiap.controle_gastos.dto;

import br.com.fiap.controle_gastos.model.GastoFixo;

public record DadosDetalhamentoGastoFixo(
        Long id,
        String descricao,
        Integer valorCentavos,
        Integer diaVencimento,
        String metodoPagamento,
        DadosDetalhamentoCategoria categoria
) {
    public DadosDetalhamentoGastoFixo(GastoFixo gasto) {
        this(
                gasto.getId(),
                gasto.getDescricao(),
                gasto.getValorCentavos(),
                gasto.getDiaVencimento(),
                gasto.getMetodoPagamento().name(),
                new DadosDetalhamentoCategoria(gasto.getCategoria())
        );
    }
}