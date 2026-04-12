package br.com.fiap.controle_gastos.repository;

import br.com.fiap.controle_gastos.model.GastoFixo;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface GastoFixoRepository extends JpaRepository<GastoFixo, Long> {

    Page<GastoFixo> findAllByUsuarioId(UUID usuarioId, Pageable paginacao);

    Optional<GastoFixo> findByIdAndUsuarioId(Long id, UUID usuarioId);

    @Query("""
            SELECT COALESCE(SUM(g.valorCentavos), 0) 
            FROM GastoFixo g 
            WHERE g.usuario.id = :idUsuario
            """)
    Long somarGastosFixosPorUsuario(@Param("idUsuario") UUID idUsuario);
}