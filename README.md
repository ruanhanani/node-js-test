# 🚀 API REST Node.js - Gerenciador de Projetos e Tarefas

**Sistema completo de gerenciamento de projetos e tarefas com integração GitHub**

Esta é uma API REST robusta desenvolvida em Node.js + TypeScript que oferece funcionalidades completas de CRUD para projetos e tarefas, incluindo integração com a API do GitHub, sistema de cache, validações avançadas e documentação automática.

## ✨ Funcionalidades Principais

### 📋 Gestão de Projetos
- ✅ **CRUD Completo**: Criar, visualizar, editar e excluir projetos
- 📊 **Dashboard**: Estatísticas e métricas dos projetos
- 🔍 **Busca Avançada**: Pesquisa por nome, descrição, status
- 📅 **Filtros**: Por data de criação, status, período
- 📄 **Paginação**: Resultados organizados e otimizados

### ✅ Gestão de Tarefas
- 🆕 **Criação**: Novas tarefas vinculadas aos projetos
- 📝 **Edição**: Atualizar título, descrição, status, prioridade
- 🎯 **Status**: Pendente, em progresso, concluída, cancelada
- ⭐ **Prioridades**: Baixa, média, alta, crítica
- 📅 **Prazos**: Sistema de datas de vencimento
- 🔄 **Transições**: Mudança de status com validações

### 🔗 Integração GitHub
- 🔍 **API Integration**: Busca repositórios por usuário
- 💾 **Cache Inteligente**: TTL configurável para otimização
- 📊 **Estatísticas**: Stars, forks, linguagem principal
- 🔄 **Sincronização**: Dados atualizados automaticamente

### 🏗️ Arquitetura
- 📐 **Clean Architecture**: Separação clara de responsabilidades
- 🔧 **Repository Pattern**: Abstração da camada de dados
- 🎛️ **Service Layer**: Lógica de negócio centralizada
- 📊 **DTO Pattern**: Transferência de dados tipada
- 🛡️ **Middleware Chain**: Validação, logging, tratamento de erros

### 🚀 Performance & Caching
- ⚡ **Cache Redis**: Cache distribuído com TTL (ou mock em memória)
- 🔄 **Cache Invalidation**: Limpeza automática quando necessário
- 📊 **Rate Limiting**: Controle de requisições por IP
- 🗜️ **Compression**: Compressão gzip automática

### 📚 Documentação
- 📖 **Swagger UI**: Documentação interativa completa
- 🔍 **OpenAPI 3.0**: Especificação padrão da indústria
- 📝 **Schemas**: Modelos de dados documentados
- 🧪 **Try It Out**: Teste direto na documentação

## 🛠️ Stack Tecnológica

### **Backend Core**
- 🟢 **Node.js 18+**: Runtime JavaScript
- 🔷 **TypeScript 5+**: Tipagem estática
- ⚡ **Express.js**: Framework web minimalista
- 📊 **Sequelize**: ORM para banco de dados

### **Banco de Dados**
- 📁 **SQLite**: Banco em memória para desenvolvimento
- 🐘 **PostgreSQL**: Recomendado para produção
- 🔄 **Migrations**: Versionamento do banco

### **Validação & Segurança**
- ✅ **Joi**: Validação de schemas
- 🛡️ **Helmet**: Headers de segurança
- 🔐 **CORS**: Controle de origem cruzada
- 📊 **Rate Limiting**: Express-rate-limit

### **Cache & Performance**
- 🔴 **Redis**: Cache em memória distribuído (opcional)
- 💾 **Cache Mock**: Sistema de cache em memória para desenvolvimento
- 🗜️ **Compression**: Middleware gzip
- ⚡ **Connection Pooling**: Pool de conexões

### **Documentação & Teste**
- 📖 **Swagger**: Documentação automática
- 🧪 **Jest**: Framework de testes
- 📊 **Coverage**: Cobertura de código
- 📮 **Postman**: Collection de testes

### **DevOps & Deploy**
- 🐳 **Docker**: Containerização
- 📦 **Docker Compose**: Orquestração
- 🔧 **ESLint**: Linting de código
- 🎨 **Prettier**: Formatação

## 📦 Instalação Rápida

### **Pré-requisitos**
- Node.js 18 ou superior
- NPM 8 ou superior
- Git

### **1. Clone o repositório**
```bash
git clone https://github.com/seu-usuario/node-js-test.git
cd node-js-test
```

### **2. Instale as dependências**
```bash
npm install
```

### **3. Execute a aplicação**
```bash
# Modo desenvolvimento (recomendado)
npm run dev

# Ou build + execução
npm run build
npm start
```

### **4. Acesse a aplicação**
- 🌐 **API**: http://localhost:3000
- 📚 **Swagger UI**: http://localhost:3000/api-docs
- ❤️ **Health Check**: http://localhost:3000/health
- 🧪 **Endpoints Simples**: http://localhost:3000/api/simple/health

**Pronto! A API está rodando com dados mock pré-carregados.**

## 🚀 Uso Rápido

### **Endpoints para Teste Imediato**

```bash
# Health Check
curl http://localhost:3000/api/simple/health

# Listar projetos (já populados)
curl http://localhost:3000/api/simple/projects

# Ver projeto específico com dados relacionados
curl http://localhost:3000/api/simple/projects/1/with-relations

# Criar novo projeto
curl -X POST http://localhost:3000/api/simple/projects \
  -H "Content-Type: application/json" \
  -d '{"name":"Meu Projeto","description":"Teste via API"}'

# Listar tarefas
curl http://localhost:3000/api/simple/tasks

# Criar nova tarefa
curl -X POST http://localhost:3000/api/simple/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Nova Tarefa","projectId":1}'
```

### **Dados Mock Disponíveis**
A aplicação já vem com:
- **3 Projetos** (Website, Mobile App, API Service)
- **6 Tarefas** distribuídas entre os projetos
- **3 Repositórios GitHub** de exemplo

### **Collection Postman**
Importe o arquivo `postman-collection.json` no Postman para ter todos os endpoints pré-configurados!

## 📚 Documentação Completa da API

### **🎯 Endpoints Simples (Recomendado para teste)**

#### **Health Check**
```bash
GET /api/simple/health
```
**Resposta**: Status da API + estatísticas do banco

#### **Projetos**
```bash
# Listar todos os projetos
GET /api/simple/projects

# Buscar projeto por ID
GET /api/simple/projects/{id}

# Projeto com tarefas e repositórios
GET /api/simple/projects/{id}/with-relations

# Criar novo projeto
POST /api/simple/projects
{
  "name": "Nome do Projeto",
  "description": "Descrição opcional",
  "status": "active" // active, inactive, completed
}
```

#### **Tarefas**
```bash
# Listar todas as tarefas
GET /api/simple/tasks

# Criar nova tarefa
POST /api/simple/tasks
{
  "title": "Título da Tarefa",
  "description": "Descrição opcional",
  "status": "pending", // pending, in_progress, completed, cancelled
  "priority": "medium", // low, medium, high, critical
  "projectId": 1
}
```

#### **Repositórios GitHub**
```bash
# Listar repositórios GitHub
GET /api/simple/repos
```

### **🔧 Endpoints Completos (Com cache e validações)**

#### **Projetos Avançados**
```bash
# Listar com filtros e paginação
GET /api/projects?status=active&page=1&limit=10

# Busca textual
GET /api/projects/search?q=website

# Filtro por data
GET /api/projects/date-range?startDate=2024-01-01&endDate=2024-12-31

# Estatísticas
GET /api/projects/stats

# Projetos ativos
GET /api/projects/active

# CRUD completo
POST /api/projects
PUT /api/projects/{id}
DELETE /api/projects/{id}
```

#### **Tarefas Avançadas**
```bash
# Listar com filtros
GET /api/tasks?status=pending&priority=high&page=1&limit=10

# Tarefas de um projeto
GET /api/projects/{id}/tasks

# Transições de status
PATCH /api/tasks/{id}/complete
PATCH /api/tasks/{id}/start
PATCH /api/tasks/{id}/cancel

# Estatísticas
GET /api/tasks/stats

# CRUD completo
PUT /api/tasks/{id}
DELETE /api/tasks/{id}
```

#### **GitHub Integration**
```bash
# Repositórios de um usuário GitHub
GET /api/projects/{id}/github/{username}

# Estatísticas GitHub de um projeto
GET /api/projects/{id}/github-stats

# Limpar cache GitHub
DELETE /api/projects/{id}/github-cache
```

## ⚙️ Configuração Avançada

### **Variáveis de Ambiente (.env)**
```env
# Servidor
PORT=3000
NODE_ENV=development

# Banco de Dados (Opcional - usa SQLite em memória por padrão)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=nodetest
DB_USER=postgres
DB_PASS=senha123

# Cache Redis (Opcional - usa cache em memória por padrão)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
CACHE_TTL=600

# GitHub API (Opcional)
GITHUB_TOKEN=seu_token_aqui

# Rate Limiting
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=100
```

### **Docker (Opcional)**
```bash
# Desenvolvimento com Docker
docker-compose up -d

# Apenas banco e Redis
docker-compose up -d postgres redis
npm run dev
```

## 🧪 Testes

```bash
# Executar todos os testes
npm test

# Modo watch
npm run test:watch

# Coverage
npm run test:coverage

# Testes específicos
npm test -- --testPathPattern=project
```

## 📊 Scripts Disponíveis

```bash
npm run dev          # Desenvolvimento com hot reload
npm run build        # Compilar TypeScript
npm start            # Produção
npm test             # Executar testes
npm run lint         # Linting ESLint
npm run format       # Formatação Prettier
```

## 📁 Estrutura do Projeto

```
src/
├── config/              # Configurações
│   ├── database.ts      # Config SQLite/PostgreSQL
│   ├── database-simple.ts # Config SQLite em memória
│   ├── redis.ts         # Config Redis
│   └── swagger.ts       # Config Swagger
├── controllers/         # Controllers da API
│   ├── ProjectController.ts
│   ├── TaskController.ts
│   └── SimpleController.ts
├── middlewares/         # Middlewares
│   └── errorHandler.ts
├── models/             # Modelos Sequelize
│   ├── Project.ts
│   ├── Task.ts
│   └── GitHubRepo.ts
├── repositories/       # Repository pattern
│   ├── ProjectRepository.ts
│   └── TaskRepository.ts
├── routes/             # Rotas
│   ├── projectRoutes.ts
│   ├── taskRoutes.ts
│   └── simple.ts
├── services/           # Lógica de negócio
│   ├── ProjectService.ts
│   ├── TaskService.ts
│   └── GitHubService.ts
├── utils/              # Utilitários
│   ├── cache.ts        # Cache Redis
│   └── cache-mock.ts   # Cache em memória
└── index.ts            # Entry point
```

## 🚀 Deploy em Produção

### **Environment Variables**
```bash
NODE_ENV=production
PORT=3000
DB_HOST=seu_postgres_host
DB_NAME=seu_banco
DB_USER=seu_usuario
DB_PASS=sua_senha
REDIS_HOST=seu_redis_host
GITHUB_TOKEN=seu_token_github
```

### **Docker**
```bash
# Build da imagem
docker build -t nodetest-api .

# Executar
docker run -p 3000:3000 -e NODE_ENV=production nodetest-api
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -am 'feat: nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

### **Padrões de Commit**
- `feat:` nova funcionalidade
- `fix:` correção de bug
- `docs:` documentação
- `refactor:` refatoração
- `test:` testes
- `chore:` manutenção

## 📋 Roadmap

- [ ] Autenticação JWT
- [ ] Websockets para notificações
- [ ] Upload de arquivos
- [ ] Logs estruturados
- [ ] Métricas Prometheus
- [ ] CI/CD Pipeline
- [ ] Kubernetes deployment

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para detalhes.

## 👨‍💻 Autor

**Ruan Hanani**
- 📧 Email: ruanhanani@exemplo.com
- 🐙 GitHub: [@ruanhanani](https://github.com/ruanhanani)
- 💼 LinkedIn: [Ruan Hanani](https://linkedin.com/in/ruanhanani)

## 🎯 Features Implementadas

- ✅ **CRUD Completo** - Projetos e Tarefas
- ✅ **Integração GitHub** - API oficial do GitHub
- ✅ **Cache Sistema** - Redis + Mock em memória
- ✅ **Documentação Swagger** - Interativa e completa
- ✅ **Validações Robustas** - Joi schemas
- ✅ **Tratamento de Erros** - Middleware global
- ✅ **Logs Estruturados** - Request/Response logging
- ✅ **Rate Limiting** - Proteção contra spam
- ✅ **Compressão** - Otimização de performance
- ✅ **CORS** - Configuração de segurança
- ✅ **TypeScript** - Tipagem completa
- ✅ **Testes** - Jest framework
- ✅ **Docker** - Containerização
- ✅ **Postman Collection** - Testes prontos
- ✅ **Dados Mock** - Ambiente de teste

## 🔥 Quick Start Summary

```bash
# Clone e instale
git clone https://github.com/seu-usuario/node-js-test.git
cd node-js-test
npm install

# Execute
npm run dev

# Teste
curl http://localhost:3000/api/simple/health

# Swagger
open http://localhost:3000/api-docs
```

**🎉 Pronto! Sua API REST completa está funcionando!**

---

<p align="center">
  Desenvolvido com ❤️ e ☕ por <strong>Ruan Hanani</strong>
</p>

<p align="center">
  <a href="#-api-rest-nodejs---gerenciador-de-projetos-e-tarefas">⬆️ Voltar ao topo</a>
</p>
