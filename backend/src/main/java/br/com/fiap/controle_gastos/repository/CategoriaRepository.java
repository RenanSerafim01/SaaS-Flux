package br.com.fiap.controle_gastos.repository;

import br.com.fiap.controle_gastos.model.Categoria;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface CategoriaRepository extends JpaRepository<Categoria, Long> {

    @Query("""
            SELECT c FROM Categoria c 
            WHERE c.isGlobal = true 
            OR c.usuario.id = :usuarioId
            """)
    Page<Categoria> buscarCategoriasGlobaisEPessoais(
            @Param("usuarioId") UUID usuarioId,
            Pageable paginacao
    );

    Optional<Categoria> findByIdAndUsuarioId(Long id, UUID usuarioId);
}