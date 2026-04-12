package br.com.fiap.controle_gastos.repository;

import br.com.fiap.controle_gastos.model.Renda;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface RendaRepository extends JpaRepository<Renda, Long> {

    Page<Renda> findAllByUsuarioId(UUID usuarioId, Pageable paginacao);

    Optional<Renda> findByIdAndUsuarioId(Long id, UUID usuarioId);

    @Query("""
            SELECT COALESCE(SUM(r.valorCentavos), 0) 
            FROM Renda r 
            WHERE r.usuario.id = :idUsuario
            """)
    Long somarRendasPorUsuario(@Param("idUsuario") UUID idUsuario);
}