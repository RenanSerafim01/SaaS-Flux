package br.com.fiap.controle_gastos.model;

import br.com.fiap.controle_gastos.dto.DadosAtualizacaoRenda;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "trx_income")
@Getter

@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EqualsAndHashCode(of = "id")
public class Renda {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "income_description", nullable = false)
    private String descricao;

    @Column(name = "income_amount_cents", nullable = false)
    private Long valorCentavos;

    @Column(name = "income_date", nullable = false)
    private LocalDate dataRecebimento;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_master_user", nullable = false)
    private Usuario usuario;

    public Renda(String descricao, Long valorCentavos, LocalDate dataRecebimento, Usuario usuario) {
        this.descricao = descricao;
        this.valorCentavos = valorCentavos;
        this.dataRecebimento = dataRecebimento;
        this.usuario = usuario;
    }

    public void atualizarInformacoes(DadosAtualizacaoRenda dados) {
        if (dados.descricao() != null && !dados.descricao().isBlank()) {
            this.descricao = dados.descricao();
        }
        if (dados.valorCentavos() != null) {
            this.valorCentavos = dados.valorCentavos();
        }
        if (dados.dataRecebimento() != null) {
            this.dataRecebimento = dados.dataRecebimento();
        }
    }
}