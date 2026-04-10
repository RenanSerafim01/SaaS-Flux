package br.com.fiap.controle_gastos.dto;

import br.com.fiap.controle_gastos.model.Categoria;

public record DadosDetalhamentoCategoria(
        Long id,
        String nome,
        Boolean isGlobal
) {
    public DadosDetalhamentoCategoria(Categoria categoria) {
        this(
                categoria.getId(),
                categoria.getNome(),
                categoria.getIsGlobal()
        );
    }
}