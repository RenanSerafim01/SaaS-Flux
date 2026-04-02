package br.com.fiap.controle_gastos.controller;

import br.com.fiap.controle_gastos.dto.DadosCadastroGastoFixo;
import br.com.fiap.controle_gastos.dto.DadosDetalhamentoGastoFixo;
import br.com.fiap.controle_gastos.model.Categoria;
import br.com.fiap.controle_gastos.model.GastoFixo;
import br.com.fiap.controle_gastos.model.Usuario;
import br.com.fiap.controle_gastos.repository.CategoriaRepository;
import br.com.fiap.controle_gastos.repository.GastoFixoRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

@RestController
@RequestMapping("/gastos-fixos")
public class GastoFixoController {

    private final GastoFixoRepository gastoFixoRepository;
    private final CategoriaRepository categoriaRepository;

    public GastoFixoController(GastoFixoRepository gastoFixoRepository, CategoriaRepository categoriaRepository) {
        this.gastoFixoRepository = gastoFixoRepository;
        this.categoriaRepository = categoriaRepository;
    }

    @PostMapping
    public ResponseEntity<DadosDetalhamentoGastoFixo> criarGastoFixo(
            @Valid @RequestBody DadosCadastroGastoFixo dados,
            @AuthenticationPrincipal Usuario usuarioLogado,
            UriComponentsBuilder uriBuilder) {

        Categoria categoria = categoriaRepository.findById(dados.idCategoria())
                .orElseThrow(() -> new EntityNotFoundException("Categoria não encontrada"));

        // Mandando o usuarioLogado para dentro do construtor
        GastoFixo novoGasto = new GastoFixo(dados, categoria, usuarioLogado);
        gastoFixoRepository.save(novoGasto);

        var uri = uriBuilder.path("/gastos-fixos/{id}").buildAndExpand(novoGasto.getId()).toUri();
        return ResponseEntity.created(uri).body(new DadosDetalhamentoGastoFixo(novoGasto));
    }

    @GetMapping
    public ResponseEntity<Page<DadosDetalhamentoGastoFixo>> listarTodos(
            @PageableDefault(size = 10, sort = {"diaVencimento"}) Pageable paginacao,
            @AuthenticationPrincipal Usuario usuarioLogado) {

        // Trazendo só os gastos do usuário logado
        var page = gastoFixoRepository.findAllByUsuarioId(usuarioLogado.getId(), paginacao)
                .map(DadosDetalhamentoGastoFixo::new);

        return ResponseEntity.ok(page);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarGastoFixo(
            @PathVariable Long id,
            @AuthenticationPrincipal Usuario usuarioLogado) {

        return gastoFixoRepository.findByIdAndUsuarioId(id, usuarioLogado.getId())
                .map(gasto -> {
                    gastoFixoRepository.delete(gasto);
                    return ResponseEntity.noContent().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}