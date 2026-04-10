package br.com.fiap.controle_gastos.infra;

import jakarta.persistence.EntityNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.List;

import static org.springframework.http.ResponseEntity.*;

@Slf4j
@RestControllerAdvice
public class TratadorDeErros {

    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<Void> tratarErro404() {
        return notFound().build();
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<List<DadosErroValidacao>> tratarErrosDeValidacao(MethodArgumentNotValidException ex) {
        var erros = ex.getFieldErrors().stream()
                .map(DadosErroValidacao::new)
                .toList();

        return badRequest().body(erros);
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<String> tratarErroIntegridadeDados(DataIntegrityViolationException ex) {

        log.error("Erro de integridade relacional no banco de dados", ex);
        return badRequest().body("Não foi possível processar a requisição devido a um conflito de dados. Verifique se existem informações obrigatórias faltando ou itens já vinculados.");
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> tratarErro500(Exception ex) {
        log.error("Erro interno inesperado no servidor", ex);
        return internalServerError().body("Ocorreu um erro interno no servidor. Tente novamente mais tarde.");
    }

    private record DadosErroValidacao(String campo, String mensagem) {
        public DadosErroValidacao(FieldError erro) {
            this(erro.getField(), erro.getDefaultMessage());
        }
    }
}