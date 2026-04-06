package br.com.fiap.controle_gastos.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import br.com.fiap.controle_gastos.dto.DadosAutenticacao;
import br.com.fiap.controle_gastos.dto.DadosCadastroUsuario;
import br.com.fiap.controle_gastos.dto.DadosTokenJWT;
import br.com.fiap.controle_gastos.infra.security.TokenService;
import br.com.fiap.controle_gastos.model.Usuario;
import br.com.fiap.controle_gastos.repository.UsuarioRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AutenticacaoController {

    private static final Logger log = LoggerFactory.getLogger(AutenticacaoController.class);
    private final AuthenticationManager manager;
    private final TokenService tokenService;
    private final UsuarioRepository repository;

    public AutenticacaoController(AuthenticationManager manager, TokenService tokenService, UsuarioRepository repository) {
        this.manager = manager;
        this.tokenService = tokenService;
        this.repository = repository;
    }

    @PostMapping("/login")
    public ResponseEntity<?> efetuarLogin(@RequestBody @Valid DadosAutenticacao dados) {
        log.info("Iniciando requisição de autenticação para o usuário: {}", dados.login());

        try {
            var authenticationToken = new UsernamePasswordAuthenticationToken(dados.login(), dados.senha());
            var authentication = manager.authenticate(authenticationToken);

            var usuarioLogado = (Usuario) authentication.getPrincipal();

            log.debug("Credenciais validadas com sucesso. Gerando token JWT...");
            var tokenJWT = tokenService.gerarToken(usuarioLogado);

            log.info("Autenticação concluída com sucesso para o usuário: {}", dados.login());

            return ResponseEntity.ok(new DadosTokenJWT(tokenJWT, usuarioLogado.getFullName()));

        } catch (Exception e) {
            log.error("Falha na autenticação para o usuário: {}. Motivo: {}", dados.login(), e.getMessage());
            return ResponseEntity.status(401).body("Falha na autenticação: Credenciais inválidas ou erro interno.");
        }
    }

    @PostMapping("/cadastro")
    public ResponseEntity<?> cadastrar(@RequestBody @Valid DadosCadastroUsuario dados) {

        if (this.repository.findByLogin(dados.login()) != null) {
            return ResponseEntity.badRequest().body("Erro: E-mail já cadastrado no sistema.");
        }

        String senhaCriptografada = new BCryptPasswordEncoder().encode(dados.senha());

        // CORREÇÃO AQUI: Passando os três parâmetros exigidos (nome, email, senha)
        Usuario novoUsuario = new Usuario(dados.nome(), dados.login(), senhaCriptografada);

        this.repository.save(novoUsuario);

        return ResponseEntity.ok().body("Usuário cadastrado com sucesso.");
    }
}