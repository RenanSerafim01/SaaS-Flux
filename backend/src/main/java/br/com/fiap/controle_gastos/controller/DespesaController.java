package br.com.fiap.controle_gastos.controller;

import br.com.fiap.controle_gastos.dto.DadosCadastroDespesa;
import br.com.fiap.controle_gastos.dto.DadosDetalhamentoDespesa;
import br.com.fiap.controle_gastos.model.Categoria;
import br.com.fiap.controle_gastos.model.Despesa;
import br.com.fiap.controle_gastos.model.Usuario;
import br.com.fiap.controle_gastos.repository.CategoriaRepository;
import br.com.fiap.controle_gastos.repository.DespesaRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.List;

@RestController
@RequestMapping("/despesas")
public class DespesaController {

    private final DespesaRepository despesaRepository;
    private final CategoriaRepository categoriaRepository;

    public DespesaController(DespesaRepository despesaRepository, CategoriaRepository categoriaRepository) {
        this.despesaRepository = despesaRepository;
        this.categoriaRepository = categoriaRepository;
    }

    @PostMapping
    public ResponseEntity<DadosDetalhamentoDespesa> criarDespesa(
            @Valid @RequestBody DadosCadastroDespesa dados,
            @AuthenticationPrincipal Usuario usuarioLogado,
            UriComponentsBuilder uriBuilder) {

        Categoria categoria = categoriaRepository.findById(dados.idCategoria())
                .orElseThrow(() -> new EntityNotFoundException("Categoria não encontrada"));

        Despesa novaDespesa = new Despesa(dados, categoria, usuarioLogado);
        despesaRepository.save(novaDespesa);

        var uri = uriBuilder.path("/despesas/{id}").buildAndExpand(novaDespesa.getId()).toUri();
        return ResponseEntity.created(uri).body(new DadosDetalhamentoDespesa(novaDespesa));
    }

    @GetMapping
    public ResponseEntity<Page<DadosDetalhamentoDespesa>> listarTodas(
            @PageableDefault(size = 10, sort = {"dataDespesa"}) Pageable paginacao,
            @AuthenticationPrincipal Usuario usuarioLogado) {

        var page = despesaRepository.findAllByUsuarioId(usuarioLogado.getId(), paginacao).map(DadosDetalhamentoDespesa::new);
        return ResponseEntity.ok(page);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DadosDetalhamentoDespesa> buscarPorId(
            @PathVariable Long id,
            @AuthenticationPrincipal Usuario usuarioLogado) {

        return despesaRepository.findByIdAndUsuarioId(id, usuarioLogado.getId())
                .map(despesa -> ResponseEntity.ok(new DadosDetalhamentoDespesa(despesa)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/categoria/{nome}")
    public ResponseEntity<List<DadosDetalhamentoDespesa>> buscarPorCategoria(
            @PathVariable String nome,
            @AuthenticationPrincipal Usuario usuarioLogado) {

        var lista = despesaRepository.findByUsuarioIdAndCategoriaNomeContainingIgnoreCase(usuarioLogado.getId(), nome)
                .stream()
                .map(DadosDetalhamentoDespesa::new)
                .toList();
        return ResponseEntity.ok(lista);
    }

    @PutMapping("/{id}")
    public ResponseEntity<DadosDetalhamentoDespesa> atualizarDespesa(
            @PathVariable Long id,
            @Valid @RequestBody DadosCadastroDespesa dados,
            @AuthenticationPrincipal Usuario usuarioLogado) {

        return despesaRepository.findByIdAndUsuarioId(id, usuarioLogado.getId())
                .map(despesaExistente -> {
                    Categoria categoria = categoriaRepository.findById(dados.idCategoria())
                            .orElseThrow(() -> new EntityNotFoundException("Categoria não encontrada"));

                    despesaExistente.atualizarInformacoes(dados, categoria);
                    despesaRepository.save(despesaExistente);

                    return ResponseEntity.ok(new DadosDetalhamentoDespesa(despesaExistente));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarDespesa(
            @PathVariable Long id,
            @AuthenticationPrincipal Usuario usuarioLogado) {

        return despesaRepository.findByIdAndUsuarioId(id, usuarioLogado.getId())
                .map(despesa -> {
                    despesaRepository.delete(despesa);
                    return ResponseEntity.noContent().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/total-por-categoria/{idCategoria}")
    public ResponseEntity<Long> somarGastosPorCategoria(
            @PathVariable Long idCategoria,
            @AuthenticationPrincipal Usuario usuarioLogado) {

        Long total = despesaRepository.somarGastosPorCategoriaEUsuario(idCategoria, usuarioLogado.getId());
        return ResponseEntity.ok(total != null ? total : 0L);
    }
}