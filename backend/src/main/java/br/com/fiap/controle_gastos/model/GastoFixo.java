package br.com.fiap.controle_gastos.model;

import br.com.fiap.controle_gastos.dto.DadosCadastroGastoFixo;
import jakarta.persistence.*;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Entity
@Table(name = "cfg_recurring_expense")
@Getter
@Setter
@NoArgsConstructor
@EqualsAndHashCode(of = "id")
public class GastoFixo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_master_user")
    private Usuario usuario;

    @Column(name = "description", nullable = false)
    private String descricao;

    @Column(name = "amount_cents", nullable = false)
    private Integer valorCentavos;

    @Column(name = "due_day", nullable = false)
    private Integer diaVencimento;

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(name = "payment_method", nullable = false)
    private TipoPagamento metodoPagamento;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_ref_expense_category")
    private Categoria categoria;

    public GastoFixo(DadosCadastroGastoFixo dados, Categoria categoria, Usuario usuario) {
        this.descricao = dados.descricao();
        this.valorCentavos = dados.valorCentavos();
        this.diaVencimento = dados.diaVencimento();
        this.metodoPagamento = TipoPagamento.valueOf(dados.metodoPagamento().toUpperCase());
        this.categoria = categoria;
        this.usuario = usuario;
    }
}