package br.com.fiap.controle_gastos.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record DadosCadastroUsuario(
        @NotBlank
        @Email
        String login,

        @NotBlank
        String senha
) {
}
