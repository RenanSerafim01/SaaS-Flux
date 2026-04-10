package br.com.fiap.controle_gastos.controller;

import br.com.fiap.controle_gastos.dto.DadosAtualizacaoGastoFixo;
import br.com.fiap.controle_gastos.dto.DadosCadastroGastoFixo;
import br.com.fiap.controle_gastos.dto.DadosDetalhamentoGastoFixo;
import br.com.fiap.controle_gastos.model.GastoFixo;
import br.com.fiap.controle_gastos.model.Usuario;
import br.com.fiap.controle_gastos.repository.CategoriaRepository;
import br.com.fiap.controle_gastos.repository.GastoFixoRepository;
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
import static org.springframework.http.ResponseEntity.*;

@RestController
@RequestMapping("/gastos-fixos")
@RequiredArgsConstructor
public class GastoFixoController {

    private final GastoFixoRepository gastoFixoRepository;
    private final CategoriaRepository categoriaRepository;

    @PostMapping
    public ResponseEntity<DadosDetalhamentoGastoFixo> criarGastoFixo(
            @Valid @RequestBody DadosCadastroGastoFixo dados,
            @AuthenticationPrincipal Usuario usuarioLogado,
            UriComponentsBuilder uriBuilder) {

        var categoria = categoriaRepository.findById(dados.idCategoria())
                .orElseThrow(() -> new EntityNotFoundException("Categoria não encontrada"));

        var novoGasto = new GastoFixo(dados, categoria, usuarioLogado);
        gastoFixoRepository.save(novoGasto);

        var uri = uriBuilder.path("/gastos-fixos/{id}").buildAndExpand(novoGasto.getId()).toUri();
        return created(uri).body(new DadosDetalhamentoGastoFixo(novoGasto));
    }

    @GetMapping
    public ResponseEntity<Page<DadosDetalhamentoGastoFixo>> listarTodos(
            @PageableDefault(size = 10, sort = {"diaVencimento"}) Pageable paginacao,
            @AuthenticationPrincipal Usuario usuarioLogado) {

        var page = gastoFixoRepository.findAllByUsuarioId(usuarioLogado.getId(), paginacao)
                .map(DadosDetalhamentoGastoFixo::new);

        return ok(page);
    }

    @PutMapping
    public ResponseEntity<DadosDetalhamentoGastoFixo> atualizarGastoFixo(
            @Valid @RequestBody DadosAtualizacaoGastoFixo dados,
            @AuthenticationPrincipal Usuario usuarioLogado) {

        var gastoOptional = gastoFixoRepository.findByIdAndUsuarioId(dados.id(), usuarioLogado.getId());

        if (gastoOptional.isEmpty()) {
            return notFound().build();
        }

        var gastoExistente = gastoOptional.get();
        gastoExistente.atualizarInformacoes(dados);

        if (dados.idCategoria() != null) {
            var categoria = categoriaRepository.findById(dados.idCategoria())
                    .orElseThrow(() -> new EntityNotFoundException("Categoria não encontrada"));
            gastoExistente.setCategoria(categoria);
        }

        gastoFixoRepository.save(gastoExistente);
        return ok(new DadosDetalhamentoGastoFixo(gastoExistente));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarGastoFixo(
            @PathVariable Long id,
            @AuthenticationPrincipal Usuario usuarioLogado) {

        var gastoOptional = gastoFixoRepository.findByIdAndUsuarioId(id, usuarioLogado.getId());

        if (gastoOptional.isEmpty()) {
            return notFound().build();
        }

        gastoFixoRepository.delete(gastoOptional.get());
        return noContent().build();
    }
}