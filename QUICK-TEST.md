# 🚀 API Quick Test Guide

## Como rodar a API

```bash
# 1. Instalar dependências (se necessário)
npm install

# 2. Executar em modo desenvolvimento
npm run dev

# 3. A API estará disponível em: http://localhost:3000
```

## ✅ Endpoints Simples (Para teste rápido)

### Health Check
```bash
GET http://localhost:3000/api/simple/health
```

### Projetos
```bash
# Listar todos os projetos
GET http://localhost:3000/api/simple/projects

# Buscar projeto por ID
GET http://localhost:3000/api/simple/projects/1

# Criar novo projeto
POST http://localhost:3000/api/simple/projects
Content-Type: application/json

{
  "name": "Meu Projeto Teste",
  "description": "Descrição do projeto",
  "status": "active"
}

# Projeto com relacionamentos (tasks + repos)
GET http://localhost:3000/api/simple/projects/1/with-relations
```

### Tarefas
```bash
# Listar todas as tarefas
GET http://localhost:3000/api/simple/tasks

# Criar nova tarefa
POST http://localhost:3000/api/simple/tasks
Content-Type: application/json

{
  "title": "Nova Tarefa",
  "description": "Descrição da tarefa",
  "status": "pending",
  "priority": "high",
  "projectId": 1
}
```

### Repositórios GitHub
```bash
# Listar repositórios
GET http://localhost:3000/api/simple/repos
```

## 🔧 Endpoints Completos (Com cache e validações)

### Projetos
```bash
GET http://localhost:3000/api/projects
GET http://localhost:3000/api/projects/1
POST http://localhost:3000/api/projects
PUT http://localhost:3000/api/projects/1
DELETE http://localhost:3000/api/projects/1
```

### Tarefas
```bash
GET http://localhost:3000/api/tasks
GET http://localhost:3000/api/tasks/1
PUT http://localhost:3000/api/tasks/1
DELETE http://localhost:3000/api/tasks/1
```

## 📚 Documentação

- **Swagger UI**: http://localhost:3000/api-docs
- **API Info**: http://localhost:3000/
- **Health Check**: http://localhost:3000/health

## ✅ Status da Implementação

- ✅ Banco SQLite em memória configurado
- ✅ Dados mock populados automaticamente
- ✅ Cache em memória (sem Redis)
- ✅ Endpoints simples funcionando
- ✅ Endpoints completos funcionando
- ✅ Swagger documentação
- ✅ Tratamento de erros
- ✅ Logs de requisições

## 🔬 Dados Mock Disponíveis

A API já vem com dados de exemplo:
- **3 Projetos** (Website, Mobile App, API Service)
- **6 Tarefas** distribuídas entre os projetos
- **3 Repositórios GitHub** de exemplo

## 💡 Dicas de Uso

1. Use os endpoints `/api/simple/*` para testes rápidos sem complexidade
2. Use os endpoints `/api/*` para funcionalidades completas com cache
3. O banco é recriado a cada reinicialização (dados em memória)
4. Logs detalhados aparecem no console
5. Cache funciona por 5-10 minutos por endpoint
