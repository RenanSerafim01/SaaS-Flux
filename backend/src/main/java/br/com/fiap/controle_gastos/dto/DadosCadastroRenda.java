package br.com.fiap.controle_gastos.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.time.LocalDate;

public record DadosCadastroRenda(
        @NotBlank(message = "A descrição da renda é obrigatória")
        String descricao,

        @NotNull(message = "O valor da renda é obrigatório")
        @Positive(message = "O valor deve ser maior que zero")
        Long valorCentavos,

        @NotNull(message = "A data de recebimento é obrigatória")
        LocalDate dataRecebimento
) {}