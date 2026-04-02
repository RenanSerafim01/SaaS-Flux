package br.com.fiap.controle_gastos.model;

import br.com.fiap.controle_gastos.dto.DadosCadastroCategoria;
import jakarta.persistence.*;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "ref_expense_category")
@Getter
@Setter
@NoArgsConstructor
@EqualsAndHashCode(of = "id")
public class Categoria {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "category_name", nullable = false)
    private String nome;

    @Column(name = "is_global")
    private Boolean isGlobal;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_master_user")
    private Usuario usuario;

    public Categoria(DadosCadastroCategoria dados, Usuario usuario) {
        this.nome = dados.nome();
        this.isGlobal = false;
        this.usuario = usuario;
    }

    public void atualizarInformacoes(DadosCadastroCategoria dados) {
        this.nome = dados.nome();
    }
}