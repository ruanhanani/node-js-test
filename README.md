# 🚀 Task Manager API

> **Sistema Robusto de Gerenciamento de Projetos e Tarefas com Integração GitHub**

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Express](https://img.shields.io/badge/Express-4.18-lightgrey.svg)](https://expressjs.com/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-orange.svg)](https://www.mysql.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED.svg)](https://www.docker.com/)
[![Swagger](https://img.shields.io/badge/Swagger-3.0-85EA2D.svg)](https://swagger.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

API REST profissional desenvolvida em **Node.js + TypeScript** para gerenciamento completo de projetos e tarefas, com integração ao **GitHub API**, arquitetura em camadas e documentação interativa.

## ⚡ Início Rápido

### 📋 Pré-requisitos
- **Node.js** 18+ ([Download](https://nodejs.org/))
- **Docker** e **Docker Compose** ([Download](https://docs.docker.com/get-docker/))
- **Git** ([Download](https://git-scm.com/))

### 🚀 Instalação

```bash
# 1. Clone o repositório
git clone https://github.com/ruanhanani/node-js-test.git
cd node-js-test

# 2. Instale as dependências
npm install

# 3. Compile o TypeScript
npm run build

# 4. Inicie apenas o banco MySQL via Docker
docker-compose up -d

# 5. Execute a API localmente
node start.js
```

✅ **API disponível em:** `http://localhost:3000`

---

## 🌟 Funcionalidades Principais

### ✅ **CRUD Completo**
- 📂 **Projetos** - Criação, listagem, edição e exclusão
- 📝 **Tarefas** - Gerenciamento completo com prioridades e status
- 📄 **Paginação** - Controle de resultados em todas as listagens

### ✅ **Integração GitHub**
- 🐙 **Repositórios** - Busca de repos públicos por usuário
- 📈 **Metadados** - Estrelas, forks, linguagem, descrição
- 🔄 **Cache Inteligente** - TTL de 10 minutos
- 🛡️ **Rate Limiting** - Proteção contra abuse

### ✅ **Arquitetura Robusta**
- 🏗️ **Camadas Bem Definidas** - Controller → Service → Repository
- 🛡️ **Validação Rigorosa** - Joi para entrada de dados
- 🚨 **Tratamento de Erros** - Middleware centralizado
- 📝 **Logs Estruturados** - Para debugging e monitoramento

### ✅ **Developer Experience**
- 📖 **Swagger UI** - Documentação interativa em tempo real
- 🗺️ **Collection Postman** - Endpoints prontos para teste
- 🐳 **Docker Ready** - Setup instantâneo com containers
- 📋 **TypeScript** - Tipagem forte e desenvolvimento moderno

---

## 📚 Documentação

| Recurso | URL/Arquivo | Descrição |
|---------|-------------|-------------|
| 📖 **Swagger UI** | [`http://localhost:3000/api-docs`](http://localhost:3000/api-docs) | Documentação interativa completa |
| 🥰 **Health Check** | [`http://localhost:3000/health`](http://localhost:3000/health) | Status da API |
| 📄 **Collection Postman** | `docs/task-manager-api.postman_collection.json` | Requests organizadas para importação |
| 🏠 **Homepage** | [`http://localhost:3000/`](http://localhost:3000/) | Página inicial da API |

---

## 🗂️ Endpoints da API

### 📂 **Projects CRUD**

| Método | Endpoint | Descrição | Filtros/Parâmetros |
|--------|----------|-----------|-------------------|
| `GET` | `/api/projects` | 📋 Listar projetos | `?page=1&limit=10&status=active&search=termo` |
| `POST` | `/api/projects` | ➕ Criar projeto | `name*`, `description`, `status`, `startDate`, `endDate` |
| `GET` | `/api/projects/:id` | 🔍 Buscar por ID | - |
| `PUT` | `/api/projects/:id` | ✏️ Atualizar projeto | Campos opcionais |
| `DELETE` | `/api/projects/:id` | ✖️ Remover projeto | - |

### 📝 **Tasks CRUD**

| Método | Endpoint | Descrição | Filtros/Parâmetros |
|--------|----------|-----------|-------------------|
| `GET` | `/api/tasks` | 📋 Listar tarefas | `?page=1&limit=10&status=pending&priority=high&projectId=1` |
| `GET` | `/api/tasks/:id` | 🔍 Buscar por ID | - |
| `PUT` | `/api/tasks/:id` | ✏️ Atualizar tarefa | `title`, `description`, `status`, `priority`, `dueDate` |
| `DELETE` | `/api/tasks/:id` | ✖️ Remover tarefa | - |

### 🐙 **GitHub Integration**

| Método | Endpoint | Descrição | Parâmetros |
|--------|-----------|-----------|-----------|
| `GET` | `/api/projects/:id/github/:username` | 🐙 Buscar repositórios GitHub | `id`: Project ID, `username`: GitHub username |
| `DELETE` | `/api/projects/:id/github-cache` | 🗑️ Limpar cache GitHub | `?username=user` (opcional) |

#### 🚀 **Exemplos da Integração GitHub:**

```bash
# Buscar repositórios do anuraghazra (github-readme-stats)
GET /api/projects/1/github/anuraghazra

# Buscar repositórios da EbookFoundation (free-programming-books) 
GET /api/projects/1/github/EbookFoundation

# Buscar repositórios do public-apis
GET /api/projects/1/github/public-apis

# Limpar cache para usuário específico
DELETE /api/projects/1/github-cache?username=anuraghazra
```

#### 📊 **Resposta da API:**
```json
{
  "success": true,
  "message": "Repositórios do GitHub para anuraghazra recuperados com sucesso",
  "data": {
    "project": {
      "id": 1,
      "name": "E-commerce Platform",
      "status": "active"
    },
    "repositories": [
      {
        "githubId": 278335273,
        "name": "github-readme-stats",
        "fullName": "anuraghazra/github-readme-stats",
        "description": "⚡ Dynamically generated stats for your github readmes",
        "htmlUrl": "https://github.com/anuraghazra/github-readme-stats",
        "language": "JavaScript",
        "stargazersCount": 75828,
        "forksCount": 25917,
        "private": false,
        "projectId": 1
      }
    ],
    "meta": {
      "cached": false,
      "totalRepositories": 5,
      "fetchedAt": "2025-09-11T14:56:19.421Z"
    }
  }
}
```

### 🔥 **Testes Realizados com Sucesso:**

#### ✅ **anuraghazra** (github-readme-stats)
- 📊 **75,828 estrelas** - github-readme-stats
- 📊 **604 estrelas** - anuraghazra.github.io  
- 📊 **695 estrelas** - Verly.js
- 📊 **369 estrelas** - anuraghazra (profile README)
- 📊 **52 estrelas** - Atomic.js

#### ✅ **EbookFoundation** (free-programming-books)
- 📊 **367,907 estrelas** - free-programming-books
- 📊 **1,965 estrelas** - free-science-books
- 📊 **347 estrelas** - free-programming-books-search
- 📊 **272 estrelas** - ebookfoundation.github.io
- 📊 **2 estrelas** - altpoet

#### ✅ **public-apis**
- 📊 **364,711 estrelas** - public-apis

---

## 🛠️ Stack Tecnológica

### 🔥 **Backend Core**
- 🟢 **Node.js 18+** - Runtime JavaScript de alta performance
- 🔵 **TypeScript 5.0** - Tipagem estática e desenvolvimento moderno
- ⚡ **Express.js** - Framework web rápido e minimalista
- 🏗️ **Arquitetura em Camadas** - Controller → Service → Repository

### 🗄️ **Banco de Dados & ORM**
- 🐬 **MySQL 8.0** - Banco relacional robusto
- 🔗 **Sequelize** - ORM com relações e migrações
- 🐳 **PHPMyAdmin** - Interface de administração web

### 🛡️ **Validação & Segurança**
- ✅ **Joi** - Validação robusta de schemas
- 🛡️ **Helmet** - Headers de segurança HTTP
- 📈 **Rate Limiting** - Controle de taxa de requisições
- 🗁️ **CORS** - Controle de acesso cross-origin

### 📝 **Documentação & Testes**
- 📖 **Swagger/OpenAPI 3.0** - Documentação auto-gerada
- 🧪 **Jest** - Framework de testes
- 🗺️ **Postman Collection** - Testes de integração

### 🐙 **Integrações Externas**
- 🐙 **GitHub API** - Busca de repositórios públicos
- 🔄 **Cache em Memória** - TTL configurável para performance

### 🚀 **DevOps & Deploy**
- 🐳 **Docker** - Containerização completa
- 📋 **Docker Compose** - Orquestração multi-container
- 🏗️ **Multi-stage Build** - Builds otimizados

---

## 🗄️ Banco de Dados

### 🔗 **Configuração de Conexão**

```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=nodetest_db
DB_USER=root
DB_PASS=rootpassword
```

### 🗂️ **Estrutura das Tabelas**

#### 📂 **Projects** (Projetos)
| Campo | Tipo | Restrições | Descrição |
|-------|------|------------|-------------|
| `id` | `INT` | `PK`, `AUTO_INCREMENT` | Identificador único |
| `name` | `VARCHAR(255)` | `NOT NULL` | Nome do projeto |
| `description` | `TEXT` | `NULLABLE` | Descrição detalhada |
| `status` | `ENUM` | `'active', 'inactive', 'completed'` | Status atual |
| `startDate` | `DATE` | `NULLABLE` | Data de início |
| `endDate` | `DATE` | `NULLABLE` | Data prevista de término |
| `createdAt` | `DATETIME` | `NOT NULL` | Data de criação |
| `updatedAt` | `DATETIME` | `NOT NULL` | Última atualização |

#### 📝 **Tasks** (Tarefas)
| Campo | Tipo | Restrições | Descrição |
|-------|------|------------|-------------|
| `id` | `INT` | `PK`, `AUTO_INCREMENT` | Identificador único |
| `title` | `VARCHAR(255)` | `NOT NULL` | Título da tarefa |
| `description` | `TEXT` | `NULLABLE` | Descrição detalhada |
| `status` | `ENUM` | `'pending', 'in_progress', 'completed', 'cancelled'` | Status atual |
| `priority` | `ENUM` | `'low', 'medium', 'high', 'critical'` | Nível de prioridade |
| `dueDate` | `DATE` | `NULLABLE` | Data de vencimento |
| `projectId` | `INT` | `FK → projects.id` | Projeto associado |
| `createdAt` | `DATETIME` | `NOT NULL` | Data de criação |
| `updatedAt` | `DATETIME` | `NOT NULL` | Última atualização |

#### 🐙 **GitHub_Repos** (Repositórios GitHub)
| Campo | Tipo | Restrições | Descrição |
|-------|------|------------|-------------|
| `id` | `INT` | `PK`, `AUTO_INCREMENT` | Identificador único |
| `githubId` | `BIGINT` | `UNIQUE`, `NOT NULL` | ID do GitHub |
| `name` | `VARCHAR(255)` | `NOT NULL` | Nome do repositório |
| `fullName` | `VARCHAR(255)` | `NOT NULL` | Nome completo (owner/repo) |
| `description` | `TEXT` | `NULLABLE` | Descrição do repositório |
| `htmlUrl` | `VARCHAR(500)` | `NOT NULL` | URL do repositório |
| `cloneUrl` | `VARCHAR(500)` | `NOT NULL` | URL para clonagem |
| `language` | `VARCHAR(100)` | `NULLABLE` | Linguagem principal |
| `stargazersCount` | `INT` | `DEFAULT 0` | Número de estrelas |
| `forksCount` | `INT` | `DEFAULT 0` | Número de forks |
| `private` | `BOOLEAN` | `DEFAULT FALSE` | Repositório privado |
| `username` | `VARCHAR(255)` | `NOT NULL` | Usuário GitHub |
| `projectId` | `INT` | `FK → projects.id` | Projeto associado |
| `githubCreatedAt` | `DATETIME` | `NOT NULL` | Criação no GitHub |
| `githubUpdatedAt` | `DATETIME` | `NOT NULL` | Última atualização no GitHub |
| `createdAt` | `DATETIME` | `NOT NULL` | Data de criação local |
| `updatedAt` | `DATETIME` | `NOT NULL` | Última atualização local |

### 📊 **Dados de Exemplo**
O banco é automaticamente populado com:
- 📂 **5 Projetos** com diferentes status e cronogramas
- 📝 **19 Tarefas** distribuídas pelos projetos
- 🐙 **8 Repositórios GitHub** com metadados reais

## 🏗️ Arquitetura do Projeto

```
src/
├── config/            # Configurações (DB, Swagger, Cache)
│   ├── database-mysql.ts
│   ├── database-simple.ts
│   ├── redis.ts
│   └── swagger.ts
├── controllers/       # Controladores (lógica HTTP)
│   ├── ProjectController.ts
│   ├── TaskController.ts
│   └── SimpleController.ts
├── middlewares/       # Middlewares (validação, erros)
│   ├── errorHandler.ts
│   └── validation.ts
├── models/            # Modelos Sequelize
│   ├── Project.ts
│   ├── Task.ts
│   └── GitHubRepo.ts
├── repositories/      # Acesso a dados
│   ├── BaseRepository.ts
│   ├── ProjectRepository.ts
│   ├── TaskRepository.ts
│   └── GitHubRepository.ts
├── routes/            # Rotas da API
│   ├── projectRoutes.ts
│   ├── taskRoutes.ts
│   ├── projectTaskRoutes.ts
│   └── simple.ts
├── services/          # Lógica de negócio
│   ├── ProjectService.ts
│   ├── TaskService.ts
│   └── GitHubService.ts
├── tests/             # Testes (setup)
│   └── setup.ts
├── utils/             # Utilitários
│   ├── cache.ts
│   └── cache-mock.ts
└── index.ts           # Entrada da aplicação
```

---

## 🐳 Docker

> **Observação**: Docker roda apenas **MySQL** + **phpMyAdmin**. A **API** executa localmente via `node start.js`.

### 🚀 **Comandos Rápidos**
```bash
# Subir banco MySQL e phpMyAdmin
docker-compose up -d

# Ver logs em tempo real
docker-compose logs -f

# Parar todos os containers
docker-compose down

# Restart completo
docker-compose down && docker-compose up -d
```

### 🌐 **Acesso aos Serviços:**
- 🚀 **API**: [http://localhost:3000](http://localhost:3000) *(roda localmente)*
- 🐬 **PHPMyAdmin**: [http://localhost:8080](http://localhost:8080) *(container)*
- 🗄️ **MySQL**: `localhost:3306` *(container)*

---

## 📦 Collection do Postman

### 📝 **Arquivo:** `docs/Task Manager - API.postman_collection.json`

#### 🚀 **Como Importar:**
1. 🗺️ Abra o **Postman**
2. 📎 Clique em **Import**
3. 📁 Selecione o arquivo `docs/Task Manager - API.postman_collection.json`
4. ✅ A collection será importada com todas as requests organizadas

#### 🎯 **Conteúdo da Collection:**

| Categoria | Requests | Descrição |
|-----------|----------|-------------|
| 📊 **API Info** | 2 | Health check e documentação |
| 📂 **Projects CRUD** | 5 | CRUD completo de projetos |
| 📝 **Tasks CRUD** | 9 | CRUD completo + ações (start, complete, cancel) |

#### 🔧 **Variável Pré-configurada:**
- `baseUrl`: `http://localhost:3000`

---

## 🔧 Scripts Disponíveis

### 🚀 **Desenvolvimento**
```bash
node start.js            # ⭐ Comando principal - Execução direta
npm run dev              # Servidor em modo watch (hot reload)
npm run build            # Compilar TypeScript
npm start                # Executar com npm (alternativo)
```

### 🧪 **Qualidade de Código**
```bash
npm run lint             # Verificar código com ESLint
npm run lint:fix         # Corrigir problemas automaticamente
npm run format           # Formatar código com Prettier
npm test                 # Executar testes
```

---

## 💨 Troubleshooting

### 🚀 **API não inicia**
- ✅ Verifique se a **porta 3000** está livre
- ✅ Execute `npm run build` antes de `node start.js`
- ✅ Confirme **Node.js 18+**: `node --version`

### 🐬 **MySQL não conecta**
- ✅ Aguarde **~15 segundos** após `docker-compose up -d`
- ✅ Verifique se a **porta 3306** está livre
- ✅ Confirme se o **Docker** está rodando: `docker ps`

### 🛠️ **Build falha**
- ✅ Execute `npm install` novamente
- ✅ Limpe o cache: `npm cache clean --force`
- ✅ Verifique dependências: `npm audit`

### 🔗 **Endpoints não respondem**
- ✅ Teste primeiro: [http://localhost:3000/health](http://localhost:3000/health)
- ✅ Verifique logs no console
- ✅ Confirme conexão com banco de dados

---

## 👨‍💻 Desenvolvedor

### **Ruan Hanani Galindo Oliveira**

- 🐙 **GitHub**: [github.com/ruanhanani](https://github.com/ruanhanani)
- 🔗 **LinkedIn**: [linkedin.com/in/ruanhananí](https://www.linkedin.com/in/ruanhananí)
- 📧 **Email**: hanani.ruan@gmail.com

> ***Engenheiro de Dados e Full Stack Developer*** *especializado em* ***Node.js***, ***TypeScript***, ***JavaScript***, ***Python***  *e arquiteturas de dados*


---

<div align="center">

### 🌟 ***Se este projeto foi útil para você, considere dar uma estrela!*** ⭐

---

### 🚀 ***Happy Coding!*** 🚀

### *Feito com* ❤️ *e muito* ☕ *por* [***Ruan Hanani***](https://github.com/ruanhanani)

</div>

