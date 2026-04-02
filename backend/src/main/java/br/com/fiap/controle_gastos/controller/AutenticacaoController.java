package br.com.fiap.controle_gastos.controller;

import br.com.fiap.controle_gastos.dto.DadosAutenticacao;
import br.com.fiap.controle_gastos.dto.DadosTokenJWT;
import br.com.fiap.controle_gastos.infra.security.TokenService;
import br.com.fiap.controle_gastos.model.Usuario;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/login")
public class AutenticacaoController {

    private final AuthenticationManager manager;
    private final TokenService tokenService;

    public AutenticacaoController(AuthenticationManager manager, TokenService tokenService) {
        this.manager = manager;
        this.tokenService = tokenService;
    }

    @PostMapping
    public ResponseEntity<?> efetuarLogin(@RequestBody @Valid DadosAutenticacao dados) {
        System.out.println(">>> PASSO 1: CHEGOU NO JAVA! E-mail: " + dados.login());

        try {
            var authenticationToken = new UsernamePasswordAuthenticationToken(dados.login(), dados.senha());

            System.out.println(">>> PASSO 2: Vai chamar o banco e conferir a senha...");
            var authentication = manager.authenticate(authenticationToken);

            System.out.println(">>> PASSO 3: Senha correta! Vai gerar o Token JWT...");
            var tokenJWT = tokenService.gerarToken((Usuario) authentication.getPrincipal());

            System.out.println(">>> PASSO 4: Token gerado com sucesso! Montando o JSON final...");
            return ResponseEntity.ok(new DadosTokenJWT(tokenJWT));

        } catch (Throwable e) {
            System.err.println("🚨 EXPLODIU NA LINHA DE CÓDIGO: " + e.getClass().getName());
            System.err.println("Motivo: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Erro interno: " + e.getMessage());
        }
    }
}