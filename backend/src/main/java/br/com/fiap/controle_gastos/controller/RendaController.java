package br.com.fiap.controle_gastos.controller;

import br.com.fiap.controle_gastos.dto.DadosCadastroRenda;
import br.com.fiap.controle_gastos.model.Renda;
import br.com.fiap.controle_gastos.model.Usuario;
import br.com.fiap.controle_gastos.repository.RendaRepository;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/rendas")
public class RendaController {

    private final RendaRepository repository;

    public RendaController(RendaRepository repository) {
        this.repository = repository;
    }

    @PostMapping
    public ResponseEntity<?> cadastrar(@RequestBody @Valid DadosCadastroRenda dados, Authentication authentication) {
        var usuarioLogado = (Usuario) authentication.getPrincipal();

        Renda novaRenda = new Renda(
                dados.descricao(),
                dados.valorCentavos(),
                dados.dataRecebimento(),
                usuarioLogado
        );

        repository.save(novaRenda);
        return ResponseEntity.ok().body("Renda registrada com sucesso.");
    }

    @GetMapping
    public ResponseEntity<Page<Renda>> listar(Pageable paginacao, Authentication authentication) {
        var usuarioLogado = (Usuario) authentication.getPrincipal();
        var page = repository.findAllByUsuarioId(usuarioLogado.getId(), paginacao);
        return ResponseEntity.ok(page);
    }
}