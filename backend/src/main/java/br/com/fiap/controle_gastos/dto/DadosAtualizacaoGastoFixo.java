package br.com.fiap.controle_gastos.dto;

import br.com.fiap.controle_gastos.model.TipoPagamento;
import jakarta.validation.constraints.NotNull;

public record DadosAtualizacaoGastoFixo(
        @NotNull
        Long id,

        String descricao,
        Integer valorCentavos,
        Integer diaVencimento,
        Long idCategoria,
        TipoPagamento metodoPagamento
) {}
