# ⚙️ SaaS-Flux | Controle Financeiro Inteligente

<p align="center">
  <img src="https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white" />
  <img src="https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=spring&logoColor=white" />
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" />
</p>

> **Flux** é um Software as a Service (SaaS) Full-Stack desenvolvido para oferecer controle financeiro absoluto e inteligente. A aplicação combina uma interface de usuário premium com uma arquitetura de back-end robusta e segura.

---

## 🚀 Visão Geral da Arquitetura (Monorepo)

Este projeto foi estruturado utilizando o padrão **Monorepo**, mantendo o Back-end e o Front-end organizados no mesmo repositório, demonstrando domínio na arquitetura e integração de sistemas isolados.

### 💻 Front-end (`/frontend`)
A interface do usuário foi projetada para oferecer a melhor experiência (UX/UI), utilizando um visual moderno (Dark Theme) e Mobile-First.
* **Tecnologias:** React, Vite, Tailwind CSS.
* **Destaques:** Dashboard dinâmico, consumo de API RESTful assíncrono e gerenciamento de estados no client-side.

### ⚙️ Back-end (`/backend`)
O motor da aplicação garante que todas as regras de negócio sejam estritamente aplicadas antes de qualquer alteração no banco de dados.
* **Tecnologias:** Java 24, Spring Boot 4, Spring Data JPA, Hibernate, Flyway.
* **Segurança:** Implementação de **Spring Security** com autenticação via **Token JWT** (JSON Web Token) e criptografia de senhas utilizando Hash **BCrypt**.

### 🗄️ Banco de Dados
* **PostgreSQL (Supabase):** Modelagem relacional avançada, garantindo integridade de dados através de constraints e chaves estrangeiras.

---

## 💡 Principais Funcionalidades (Beta 1.0)

- [x] **Dashboard Premium:** Visão consolidada de transações e saldos com detalhamento visual em barras de progresso.
- [x] **Autenticação Segura:** Sistema de login protegendo o acesso aos endpoints sensíveis.
- [x] **Gestão de Recorrências:** Algoritmo que separa despesas avulsas de gastos fixos mensais.
- [x] **Categorização Inteligente:** Gestão de categorias globais do sistema e marcadores personalizados pelo usuário.

---

## 🛠️ Como rodar o projeto localmente

### 1. Back-end (Spring Boot)
Navegue até o diretório `/backend` e configure as variáveis de ambiente (`DB_URL`, `DB_USER`, `DB_PASSWORD`). Em seguida, execute:
```bash
./mvnw spring-boot:run
