package br.com.fiap.controle_gastos.repository;

import br.com.fiap.controle_gastos.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, UUID> {

    UserDetails findByLogin(String login);

    boolean existsByLogin(String login);
}