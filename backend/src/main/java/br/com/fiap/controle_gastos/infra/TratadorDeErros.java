package br.com.fiap.controle_gastos.infra;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class TratadorDeErros {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> tratarErrosDeValidacao(MethodArgumentNotValidException ex) {

        Map<String, String> erros = new HashMap<>();

        for (FieldError erro : ex.getBindingResult().getFieldErrors()) {
            erros.put(erro.getField(), erro.getDefaultMessage());
        }

        return ResponseEntity.badRequest().body(erros);
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity tratarErroIntegridadeDados(DataIntegrityViolationException ex) {
        System.out.println(" ERRO DE INTEGRIDADE NO BANCO: " + ex.getMessage());

        return ResponseEntity.badRequest().body("Erro de integridade no banco. Verifique se existem informações obrigatórias faltando ou itens vinculados.");
    }

}
