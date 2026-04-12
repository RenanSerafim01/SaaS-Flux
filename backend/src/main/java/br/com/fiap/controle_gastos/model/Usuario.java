package br.com.fiap.controle_gastos.model;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "master_user")
@Getter

@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EqualsAndHashCode(of = "id")
public class Usuario implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Column(nullable = false, unique = true)
    private String login;

    @Column(nullable = false)
    private String senha;

    public Usuario(String fullName, String login, String senha) {
        this.fullName = fullName;
        this.login = login;
        this.senha = senha;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_USER"));
    }

    @Override
    public String getPassword() {
        return senha; }

    @Override
    public String getUsername() {
        return login; }

    @Override
    public boolean isAccountNonExpired() {
        return true; }

    @Override
    public boolean isAccountNonLocked() {
        return true; }

    @Override
    public boolean isCredentialsNonExpired() {
        return true; }

    @Override
    public boolean isEnabled() {
        return true; }
}