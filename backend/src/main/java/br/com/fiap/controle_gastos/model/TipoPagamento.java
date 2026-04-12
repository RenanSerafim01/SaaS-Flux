package br.com.fiap.controle_gastos.model;

import lombok.Getter;

@Getter
public enum TipoPagamento {

    CREDITO("Cartão de Crédito"),
    DEBITO("Cartão de Débito"),
    PIX("Pix"),
    DINHEIRO("Dinheiro em Espécie");

    private final String descricao;

    TipoPagamento(String descricao) {
        this.descricao = descricao;
    }
}
