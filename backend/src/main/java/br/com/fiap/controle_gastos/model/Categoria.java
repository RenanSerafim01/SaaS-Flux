package br.com.fiap.controle_gastos.model;

import br.com.fiap.controle_gastos.dto.DadosCadastroCategoria;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "ref_expense_category")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EqualsAndHashCode(of = "id")
public class Categoria {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "category_name", nullable = false)
    private String nome;

    @Column(name = "is_global", nullable = false)
    private Boolean isGlobal = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_master_user")
    private Usuario usuario;

    public Categoria(DadosCadastroCategoria dados, Usuario usuario) {
        this.nome = dados.nome();
        this.usuario = usuario;
    }

    public void atualizarInformacoes(DadosCadastroCategoria dados) {
        if (dados.nome() != null && !dados.nome().isBlank()) {
            this.nome = dados.nome();
        }
    }
}