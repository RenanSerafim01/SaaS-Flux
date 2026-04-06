package br.com.fiap.controle_gastos.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.UUID;

@Table(name = "trx_income")
@Entity(name = "Renda")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
public class Renda {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String descricao;

    @Column(name = "valor_centavos")
    private Long valorCentavos;

    @Column(name = "data_recebimento")
    private LocalDate dataRecebimento;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    public Renda(String descricao, Long valorCentavos, LocalDate dataRecebimento, Usuario usuario) {
        this.descricao = descricao;
        this.valorCentavos = valorCentavos;
        this.dataRecebimento = dataRecebimento;
        this.usuario = usuario;
    }
}