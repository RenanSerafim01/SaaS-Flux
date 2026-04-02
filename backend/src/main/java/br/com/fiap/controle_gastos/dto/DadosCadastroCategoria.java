package br.com.fiap.controle_gastos.dto;

import jakarta.validation.constraints.NotBlank;

public record DadosCadastroCategoria(
        @NotBlank(message = "O nome da categoria é obrigatório")
        String nome
) {
}