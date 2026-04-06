package br.com.fiap.controle_gastos.repository;

import br.com.fiap.controle_gastos.model.Renda;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface RendaRepository extends JpaRepository<Renda, UUID> {
    Page<Renda> findAllByUsuarioId(UUID usuarioId, Pageable paginacao);
}
