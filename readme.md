
# Todo List - Projeto Monorepo

Este repositório contém a implementação de uma aplicação full-stack de Lista de Tarefas (Todo List), desenvolvida como um monorepo com frontend em React, backend em NestJS e banco de dados PostgreSQL gerenciado via Docker.

## 📌 Tecnologias Utilizadas

- **Linguagem**: TypeScript (para frontend e backend)
- **Frontend**:
  - React
  - Vite
  - React Hook Form
  - Zod (validação de formulários)
  - Axios (requisições HTTP)
  - React Router DOM (roteamento)
- **Backend**:
  - NestJS
  - TypeORM (ORM para PostgreSQL)
  - JWT e Passport (autenticação)
  - Swagger (documentação da API)
- **Banco de Dados**:
  - PostgreSQL (rodando via Docker)
- **Outras Dependências**:
  - Docker (containerização do banco de dados)
  - Concurrently e Wait-On (gerenciamento de serviços múltiplos)
  - ESLint e Prettier (linting e formatação de código)
  - bcrypt (hash de senhas)

---

## 🚀 Configuração e Execução

### 1️⃣ Pré-requisitos

Certifique-se de ter as seguintes ferramentas instaladas:

- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- [Docker](https://www.docker.com/) (para rodar o PostgreSQL)
- [npm](https://www.npmjs.com/) (gerenciador de pacotes do Node.js)

### 2️⃣ Instalação

Clone este repositório e instale as dependências:

```bash
git clone https://github.com/seufernandez/task-manager.git
cd task-manager
npm run install:all
```

Isso instalará as dependências tanto do frontend quanto do backend.

### 3️⃣ Configuração

- **Banco de Dados**: O PostgreSQL é gerenciado via Docker. Certifique-se de que o Docker está rodando.
- **Variáveis de Ambiente**:
  - No diretório do backend (`/back`), crie um arquivo `.env` com as seguintes variáveis (ou renomeie `.env.example`, se fornecido):
    ```
    DATABASE_HOST=localhost
    DATABASE_PORT=5432
    DATABASE_USER=your_username
    DATABASE_PASSWORD=your_password
    DATABASE_NAME=todo_list
    JWT_SECRET=your_jwt_secret
    ```
  - O frontend (`/front`), crie um arquivo `.env` com as seguintes variáveis (ou renomeie `.env.example`, se fornecido):
     ```
    VITE_API_URL='http://localhost:3000'
    ```

### 4️⃣ Rodando a Aplicação

Inicie a aplicação completa (banco de dados, backend e frontend) com:

```bash
npm run start:all
```

Isso irá:
- Iniciar o PostgreSQL via Docker.
- Aguardar o banco de dados estar pronto.
- Iniciar o backend e o frontend simultaneamente.

- O frontend estará disponível em: `http://localhost:5173`
- O backend estará disponível em: `http://localhost:3000`

### 5️⃣ Populando o Banco de Dados

Para popular o banco de dados com dados iniciais de teste, incluindo um usuário de teste, execute:

```bash
npm run seed
```

Isso executa o script `npx ts-node src/database/seed.ts` no backend, criando um usuário de teste:
- **Nome de usuário**: `john_doe`
- **Senha**: `password123` (hasheada com bcrypt)

---

## 📂 Estrutura do Projeto

O projeto é organizado como um monorepo com os seguintes diretórios principais:

- **`/front`**: Frontend (aplicação React)
  - `/src`: Código-fonte do frontend
  - `/public`: Assets estáticos
- **`/back`**: Backend (API NestJS)
  - `/src`: Código-fonte do backend
  - `/src/database`: Scripts de seed e migrações
  - `/docker-compose.yml`: Configuração do Docker para PostgreSQL
- **`/docker-compose.yml`**: (opcional) Pode ser movido para a raiz, se preferir

---

## 📖 Documentação da API

A API do backend é documentada usando Swagger. Para acessar a documentação interativa, inicie o backend e visite:

```
http://localhost:3000/api
```
![image](https://github.com/user-attachments/assets/a9af389d-5d63-44d1-a76f-18a6e6c6b26e)

---

## 📖 Preview da Aplicação

![image](https://github.com/user-attachments/assets/cad1114b-f1d9-4689-9cb1-aadcf9882436)
![image](https://github.com/user-attachments/assets/9fd6cef7-9efe-44a8-be04-31836a90caca)
![image](https://github.com/user-attachments/assets/c49b24d3-f210-41f9-847b-048707016b2e)
![image](https://github.com/user-attachments/assets/6ef4a37b-0abf-4bc8-9a16-b77e14cc8b20)
![image](https://github.com/user-attachments/assets/0381be45-cc97-4278-92b5-f0a37de047d0)


---

## 📖 Observações e Sugestões

Este projeto implementa uma aplicação completa de Lista de Tarefas com autenticação e gerenciamento de tarefas. Aqui estão algumas observações e sugestões para melhorias:

- **Autenticação**: Utiliza JWT e Passport para proteger rotas de forma segura. Caso o usuário não esteja autenticado ou a chamada `/users/me` não retorne dados, o frontend redireciona automaticamente para a página inicial (`/`).
- **Banco de Dados**: PostgreSQL garante robustez e escalabilidade. Para produção, configure um banco de dados persistente.
- **Dados de Seed**: Inclui um usuário de teste (`john_doe`) para desenvolvimento. Remova ou ajuste para produção.
- **Segurança**: Implemente HTTPS, limite de taxa, validação de entrada e auditorias de segurança regulares para ambientes de produção.
- **Testes**: Adicione testes unitários (Jest) e testes de integração (Cypress) para garantir a qualidade do código.
- **Monitoramento**: Utilize ferramentas como Prometheus/Grafana e logging com ELK Stack para monitoramento em produção.

---

## 🚀 Melhorias Futuras

- Filtragem e busca avançada de tarefas.
- Suporte a categorias ou etiquetas para tarefas.
- Notificações push para lembretes de tarefas.
- Criptografia de ponta a ponta para maior segurança.
- Aprimorar validações de dados de entrada e Mappers de saída

---

## 🧪 Testes

Execute os testes de ponta a ponta para verificar o fluxo da aplicação.

```bash
npm run test
```

---

## 🚀 Melhoria Implementada

Integração com Caching: Adicionada integração com caching para melhorar o desempenho da aplicação, especificamente na rota GET /users/me. 


Agora, a resposta de dados do usuário autenticado é armazenada em cache, reduzindo a necessidade de consultas repetidas ao banco de dados e proporcionando uma experiência mais rápida para o usuário.

---

## 📝 Lógica de Negócio

1. **Autenticação**
   - ✅ Usuário pode: Acessar a aplicação se autenticado.
   - ❌ Usuário não pode: Acessar rotas protegidas sem autenticação; será redirecionado para a página inicial (`/`).

2. **Obter Tarefas**
   - ✅ Usuário pode: Ver suas próprias tarefas.
   - ❌ Usuário não pode: Acessar tarefas de outros usuários ou acessar a página de tarefas sem autenticação (redirecionado para `/`).

3. **Criar Tarefa**
   - ✅ Usuário pode: Criar uma nova tarefa.
   - ❌ Usuário não pode: Criar uma tarefa sem conteúdo válido ou sem autenticação (redirecionado para `/`).

4. **Atualizar Tarefa**
   - ✅ Usuário pode: Atualizar sua própria tarefa.
   - ❌ Usuário não pode: Atualizar tarefas de outros usuários, sem conteúdo ou sem autenticação (redirecionado para `/`).

5. **Deletar Tarefa**
   - ✅ Usuário pode: Deletar sua própria tarefa.
   - ❌ Usuário não pode: Deletar tarefas de outros usuários ou sem autenticação (redirecionado para `/`).

---

© 2025 - Projeto Todo List - Monorepo

