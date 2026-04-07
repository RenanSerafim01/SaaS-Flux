# ⚙️ SaaS-Flux | Controle Financeiro Inteligente

<p align="center">
  <img src="https://img.shields.io/badge/Status-Produção-emerald?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white" />
  <img src="https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=spring&logoColor=white" />
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" />
</p>

> **Flux** é um Software as a Service (SaaS) Full-Stack desenvolvido para oferecer controle financeiro absoluto e inteligente. A aplicação combina uma interface de usuário premium com uma arquitetura de back-end robusta e segura.

---

## 🔗 Links Rápidos
Teste a aplicação na nuvem agora mesmo:

* 🚀 **Aplicação em Produção (Front-end):** https://flux-app-renan.vercel.app/
* 📚 **Documentação da API (Swagger):** https://saas-flux-api.onrender.com/swagger-ui/index.html
*(Nota: O back-end está hospedado em um plano gratuito. A primeira requisição pode levar cerca de 50 segundos para "acordar" o servidor).*

---

## 📸 Preview da Aplicação

### Painel de Controle (Dashboard)
<img width="1920" height="913" alt="image" src="https://github.com/user-attachments/assets/c40d78c9-6d53-4dd0-8ae2-030ae164aa4c" />


---

## 🤖 Desenvolvimento Assistido por IA (AI-Driven)

Este projeto foi construído utilizando **Inteligência Artificial Generativa** como *Pair Programmer*. A IA foi aplicada de forma estratégica para:
* Acelerar o desenvolvimento e a estruturação inicial do padrão Monorepo.
* Realizar *troubleshooting* e debugar integrações complexas entre o Java, os Schemas do PostgreSQL e a interface React.
* Otimizar a lógica visual e refatorar componentes dinâmicos no Tailwind CSS.

Isso reflete a capacidade de integrar ferramentas de IA modernas no fluxo de trabalho de engenharia de software para otimizar o tempo de desenvolvimento e garantir alta qualidade de entrega.

---

## 🚀 Visão Geral da Arquitetura (Monorepo)

Este projeto foi estruturado utilizando o padrão **Monorepo**, mantendo o Back-end e o Front-end organizados no mesmo repositório, demonstrando domínio na integração de sistemas isolados.

### 💻 Front-end (`/frontend`)
A interface foi projetada para oferecer a melhor experiência (UX/UI), com visual moderno (Dark Theme).
* **Tecnologias:** React, Vite, Tailwind CSS.
* **Destaques:** Dashboard dinâmico com cálculo de saldo em tempo real, consumo de API RESTful e gerenciamento de estados no client-side.

### ⚙️ Back-end (`/backend`)
O motor da aplicação garante que todas as regras de negócio sejam aplicadas rigorosamente.
* **Tecnologias:** Java 24, Spring Boot 4, Spring Data JPA.
* **Documentação:** API totalmente documentada interativamente via **Springdoc OpenAPI (Swagger)**.
* **Segurança:** **Spring Security** com autenticação via **Token JWT** e criptografia de senhas (Hash **BCrypt**).

### 🗄️ Banco de Dados
* **PostgreSQL (Supabase):** Modelagem relacional garantindo integridade de dados através de constraints e chaves estrangeiras.

---

## 💡 Principais Funcionalidades (Versão 1.0)

- [x] **Motor Matemático Inteligente:** Cálculo de Saldo Consolidado (Rendas vs. Despesas) com feedback visual.
- [x] **Autenticação Segura:** Sistema de login protegendo o acesso aos endpoints sensíveis.
- [x] **Gestão de Recorrências:** Separação de despesas avulsas de gastos fixos mensais.
- [x] **Categorização Dinâmica:** Gestão de categorias do sistema e marcações do usuário.
- [x] **Histórico de Entradas:** Rastreio detalhado de aportes e rendas.

---

## 🛠️ Como rodar o projeto localmente

### 1. Clonar o repositório
```bash
git clone [https://github.com/RenanSerafim01/SaaS-Flux.git](https://github.com/RenanSerafim01/SaaS-Flux.git)
```

### 2. Back-end (Spring Boot)
Navegue até o diretório `/backend` e configure as variáveis de ambiente (`DB_URL`, `DB_USER`, `DB_PASSWORD`, `JWT_SECRET`). Em seguida, execute o comando abaixo no terminal:
```bash
./mvnw spring-boot:run
```

### 3. Front-end (React + Vite)
Navegue até o diretório `/frontend`, crie um arquivo `.env` com a variável `VITE_API_URL=http://localhost:8080` e rode os comandos:
```bash
npm install
npm run dev
```

---

## 👨‍💻 Desenvolvedor

**Renan Serafim da Silva** *Estudante de Sistemas de Informação na FIAP* 
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/renanserafim/)
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/RenanSerafim01)
