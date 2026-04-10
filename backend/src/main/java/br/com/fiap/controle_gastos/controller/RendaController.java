package br.com.fiap.controle_gastos.controller;

import br.com.fiap.controle_gastos.dto.DadosAtualizacaoRenda;
import br.com.fiap.controle_gastos.dto.DadosCadastroRenda;
import br.com.fiap.controle_gastos.model.Renda;
import br.com.fiap.controle_gastos.model.Usuario;
import br.com.fiap.controle_gastos.repository.RendaRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import static org.springframework.http.ResponseEntity.*;

@RestController
@RequestMapping("/rendas")
@RequiredArgsConstructor
public class RendaController {

    private final RendaRepository repository;

    @PostMapping
    public ResponseEntity<String> cadastrar(
            @RequestBody @Valid DadosCadastroRenda dados,
            @AuthenticationPrincipal Usuario usuarioLogado) {

        var novaRenda = new Renda(
                dados.descricao(),
                dados.valorCentavos(),
                dados.dataRecebimento(),
                usuarioLogado
        );

        repository.save(novaRenda);
        return ok("Renda registrada com sucesso.");
    }

    @GetMapping
    public ResponseEntity<Page<Renda>> listar(
            Pageable paginacao,
            @AuthenticationPrincipal Usuario usuarioLogado) {

        var page = repository.findAllByUsuarioId(usuarioLogado.getId(), paginacao);
        return ok(page);
    }

    @PutMapping
    public ResponseEntity<String> atualizarRenda(
            @Valid @RequestBody DadosAtualizacaoRenda dados,
            @AuthenticationPrincipal Usuario usuarioLogado) {

        var rendaOptional = repository.findById(dados.id());

        if (rendaOptional.isEmpty()) {
            return notFound().build();
        }

        var renda = rendaOptional.get();

        if (!renda.getUsuario().getId().equals(usuarioLogado.getId())) {
            return status(HttpStatus.FORBIDDEN).build();
        }

        renda.atualizarInformacoes(dados);
        repository.save(renda);

        return ok("Renda atualizada com sucesso.");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(
            @PathVariable Long id,
            @AuthenticationPrincipal Usuario usuarioLogado) {

        var rendaOptional = repository.findById(id);

        if (rendaOptional.isEmpty()) {
            return notFound().build();
        }

        var renda = rendaOptional.get();

        if (!renda.getUsuario().getId().equals(usuarioLogado.getId())) {
            return status(HttpStatus.FORBIDDEN).build();
        }

        repository.delete(renda);

        return noContent().build();
    }
}