package br.com.fiap.controle_gastos.repository;

import br.com.fiap.controle_gastos.model.Despesa;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface DespesaRepository extends JpaRepository<Despesa, Long> {

    Page<Despesa> findAllByUsuarioId(UUID usuarioId, Pageable paginacao);

    Optional<Despesa> findByIdAndUsuarioId(Long id, UUID usuarioId);

    List<Despesa> findByUsuarioIdAndCategoriaNomeContainingIgnoreCase(UUID usuarioId, String nome);

    @Query("""
            SELECT COALESCE(SUM(d.valorCentavos), 0) 
            FROM Despesa d 
            WHERE d.categoria.id = :idCategoria 
            AND d.usuario.id = :idUsuario
            """)
    Long somarGastosPorCategoriaEUsuario(
            @Param("idCategoria") Long idCategoria,
            @Param("idUsuario") UUID idUsuario
    );
}