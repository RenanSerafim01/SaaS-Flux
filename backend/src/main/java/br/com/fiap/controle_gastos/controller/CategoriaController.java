package br.com.fiap.controle_gastos.controller;

import br.com.fiap.controle_gastos.dto.DadosCadastroCategoria;
import br.com.fiap.controle_gastos.dto.DadosDetalhamentoCategoria;
import br.com.fiap.controle_gastos.model.Categoria;
import br.com.fiap.controle_gastos.model.Usuario;
import br.com.fiap.controle_gastos.repository.CategoriaRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

@RestController
@RequestMapping("/categorias")
@RequiredArgsConstructor
public class CategoriaController {

    private final CategoriaRepository repository;

    @PostMapping
    public ResponseEntity<DadosDetalhamentoCategoria> cadastrar(
            @RequestBody @Valid DadosCadastroCategoria dados,
            @AuthenticationPrincipal Usuario usuarioLogado,
            UriComponentsBuilder uriBuilder) {

        var categoria = new Categoria(dados, usuarioLogado);
        repository.save(categoria);

        var uri = uriBuilder.path("/categorias/{id}").buildAndExpand(categoria.getId()).toUri();
        return ResponseEntity.created(uri).body(new DadosDetalhamentoCategoria(categoria));
    }

    @GetMapping
    public ResponseEntity<Page<DadosDetalhamentoCategoria>> listar(
            @PageableDefault(size = 100, sort = {"nome"}) Pageable paginacao,
            @AuthenticationPrincipal Usuario usuarioLogado) {

        var page = repository.buscarCategoriasGlobaisEPessoais(usuarioLogado.getId(), paginacao)
                .map(DadosDetalhamentoCategoria::new);

        return ResponseEntity.ok(page);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id, @AuthenticationPrincipal Usuario usuarioLogado) {
        var categoriaOptional = repository.findByIdAndUsuarioId(id, usuarioLogado.getId());

        if (categoriaOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        var categoria = categoriaOptional.get();

        if (Boolean.TRUE.equals(categoria.getIsGlobal())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        repository.delete(categoria);
        return ResponseEntity.noContent().build();
    }
}