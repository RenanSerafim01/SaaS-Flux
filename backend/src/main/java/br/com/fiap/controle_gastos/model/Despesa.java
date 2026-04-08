package br.com.fiap.controle_gastos.model;

import br.com.fiap.controle_gastos.dto.DadosAtualizacaoDespesa;
import br.com.fiap.controle_gastos.dto.DadosCadastroDespesa;
import jakarta.persistence.*;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.OffsetDateTime;

@Entity
@Table(name = "trx_expense")
@Getter
@Setter
@NoArgsConstructor
@EqualsAndHashCode(of = "id")
public class Despesa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_master_user", nullable = false)
    private Usuario usuario;

    @ManyToOne
    @JoinColumn(name = "id_ref_expense_category", nullable = false)
    private Categoria categoria;

    @Column(name = "expense_description", nullable = false)
    private String descricao;

    @Column(name = "expense_amount", nullable = false)
    private Integer valorCentavos;

    @Column(name = "expense_date", nullable = false)
    private OffsetDateTime dataDespesa;

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(name = "payment_method", nullable = false)
    private TipoPagamento metodoPagamento;

    public Despesa(DadosCadastroDespesa dados, Categoria categoria, Usuario usuario) {
        this.descricao = dados.descricao();
        this.valorCentavos = dados.valorCentavos();
        this.dataDespesa = dados.dataDespesa();
        this.metodoPagamento = dados.metodoPagamento();
        this.categoria = categoria;
        this.usuario = usuario;
    }

    public void atualizarInformacoes(DadosCadastroDespesa dados, Categoria categoria) {
        this.descricao = dados.descricao();
        this.valorCentavos = dados.valorCentavos();
        this.dataDespesa = dados.dataDespesa();
        this.metodoPagamento = dados.metodoPagamento();
        this.categoria = categoria;
    }

    public void atualizarInformacoes(DadosAtualizacaoDespesa dados) {
        if (dados.descricao() != null) {
            this.descricao = dados.descricao();
        }
        if (dados.valorCentavos() != null) {
            this.valorCentavos = dados.valorCentavos();
        }
        if (dados.dataDespesa() != null) {
            this.dataDespesa = dados.dataDespesa();
        }
        if (dados.metodoPagamento() != null) {
            this.metodoPagamento = dados.metodoPagamento();
        }
    }
}