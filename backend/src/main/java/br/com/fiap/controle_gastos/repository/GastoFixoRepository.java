package br.com.fiap.controle_gastos.repository;

import br.com.fiap.controle_gastos.model.GastoFixo;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

public interface GastoFixoRepository extends JpaRepository<GastoFixo, Long> {
    Page<GastoFixo> findAllByUsuarioId(UUID usuarioId, Pageable paginacao);

    Optional<GastoFixo> findByIdAndUsuarioId(Long id, UUID usuarioId);
}