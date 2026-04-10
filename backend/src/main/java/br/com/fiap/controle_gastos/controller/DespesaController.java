package br.com.fiap.controle_gastos.controller;

import br.com.fiap.controle_gastos.dto.DadosAtualizacaoDespesa;
import br.com.fiap.controle_gastos.dto.DadosCadastroDespesa;
import br.com.fiap.controle_gastos.dto.DadosDetalhamentoDespesa;
import br.com.fiap.controle_gastos.model.Despesa;
import br.com.fiap.controle_gastos.model.Usuario;
import br.com.fiap.controle_gastos.repository.CategoriaRepository;
import br.com.fiap.controle_gastos.repository.DespesaRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;
import java.util.List;
import static org.springframework.http.ResponseEntity.*;

@RestController
@RequestMapping("/despesas")
@RequiredArgsConstructor
public class DespesaController {

    private final DespesaRepository despesaRepository;
    private final CategoriaRepository categoriaRepository;

    @PostMapping
    public ResponseEntity<DadosDetalhamentoDespesa> criarDespesa(
            @Valid @RequestBody DadosCadastroDespesa dados,
            @AuthenticationPrincipal Usuario usuarioLogado,
            UriComponentsBuilder uriBuilder) {

        var categoria = categoriaRepository.findById(dados.idCategoria())
                .orElseThrow(() -> new EntityNotFoundException("Categoria não encontrada"));

        var novaDespesa = new Despesa(dados, categoria, usuarioLogado);
        despesaRepository.save(novaDespesa);

        var uri = uriBuilder.path("/despesas/{id}").buildAndExpand(novaDespesa.getId()).toUri();

        return created(uri).body(new DadosDetalhamentoDespesa(novaDespesa));
    }

    @GetMapping
    public ResponseEntity<Page<DadosDetalhamentoDespesa>> listarTodas(
            @PageableDefault(size = 10, sort = {"dataDespesa"}) Pageable paginacao,
            @AuthenticationPrincipal Usuario usuarioLogado) {

        var page = despesaRepository.findAllByUsuarioId(usuarioLogado.getId(), paginacao)
                .map(DadosDetalhamentoDespesa::new);

        return ok(page);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DadosDetalhamentoDespesa> buscarPorId(
            @PathVariable Long id,
            @AuthenticationPrincipal Usuario usuarioLogado) {

        return despesaRepository.findByIdAndUsuarioId(id, usuarioLogado.getId())
                .map(despesa -> ok(new DadosDetalhamentoDespesa(despesa)))
                .orElse(notFound().build());
    }

    @GetMapping("/categoria/{nome}")
    public ResponseEntity<List<DadosDetalhamentoDespesa>> buscarPorCategoria(
            @PathVariable String nome,
            @AuthenticationPrincipal Usuario usuarioLogado) {

        var lista = despesaRepository.findByUsuarioIdAndCategoriaNomeContainingIgnoreCase(usuarioLogado.getId(), nome)
                .stream()
                .map(DadosDetalhamentoDespesa::new)
                .toList();

        return ok(lista);
    }

    @PutMapping
    public ResponseEntity<DadosDetalhamentoDespesa> atualizarDespesa(
            @Valid @RequestBody DadosAtualizacaoDespesa dados,
            @AuthenticationPrincipal Usuario usuarioLogado) {

        var despesaOptional = despesaRepository.findByIdAndUsuarioId(dados.id(), usuarioLogado.getId());

        if (despesaOptional.isEmpty()) {
            return notFound().build();
        }

        var despesaExistente = despesaOptional.get();
        despesaExistente.atualizarInformacoes(dados);

        if (dados.idCategoria() != null) {
            var categoria = categoriaRepository.findById(dados.idCategoria())
                    .orElseThrow(() -> new EntityNotFoundException("Categoria não encontrada"));
            despesaExistente.setCategoria(categoria);
        }

        despesaRepository.save(despesaExistente);

        return ok(new DadosDetalhamentoDespesa(despesaExistente));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarDespesa(
            @PathVariable Long id,
            @AuthenticationPrincipal Usuario usuarioLogado) {

        var despesaOptional = despesaRepository.findByIdAndUsuarioId(id, usuarioLogado.getId());

        if (despesaOptional.isEmpty()) {
            return notFound().build();
        }

        despesaRepository.delete(despesaOptional.get());

        return noContent().build();
    }

    @GetMapping("/total-por-categoria/{idCategoria}")
    public ResponseEntity<Long> somarGastosPorCategoria(
            @PathVariable Long idCategoria,
            @AuthenticationPrincipal Usuario usuarioLogado) {

        var total = despesaRepository.somarGastosPorCategoriaEUsuario(idCategoria, usuarioLogado.getId());

        return ok(total != null ? total : 0L);
    }
}