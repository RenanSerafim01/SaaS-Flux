package br.com.fiap.controle_gastos.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Table(name = "trx_income")
@Entity(name = "Renda")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
public class Renda {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "income_description")
    private String descricao;

    @Column(name = "income_amount_cents")
    private Long valorCentavos;

    @Column(name = "income_date")
    private LocalDate dataRecebimento;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_master_user")
    private Usuario usuario;

    public Renda(String descricao, Long valorCentavos, LocalDate dataRecebimento, Usuario usuario) {
        this.descricao = descricao;
        this.valorCentavos = valorCentavos;
        this.dataRecebimento = dataRecebimento;
        this.usuario = usuario;
    }
}