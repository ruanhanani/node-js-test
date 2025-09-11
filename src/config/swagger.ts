import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: '🚀 Task Manager API - Sistema de Gerenciamento de Projetos',
      version: '1.0.0',
      description: `
# 📋 API REST Completa para Gerenciamento de Projetos e Tarefas

## 🎯 Funcionalidades Principais
- ✅ **CRUD Completo** - Projetos, Tarefas e Repositórios GitHub
- ✅ **Relacionamentos** - Tarefas vinculadas a projetos
- ✅ **Filtros Avançados** - Por status, prioridade, linguagem, etc.
- ✅ **Paginação** - Controle de resultados em listas grandes
- ✅ **Validação Rigorosa** - Dados sempre consistentes
- ✅ **Arquitetura em Camadas** - Controllers → Services → Repositories
- ✅ **Base MySQL** - Dados persistentes e relacionais
- ✅ **Documentação Interativa** - Teste direto nesta interface!

## 🛠️ Como Usar Esta Documentação

### 1. **Teste Direto no Swagger**
- Use o botão **"Try it out"** em cada endpoint
- Preencha os parâmetros nos formulários
- Execute e veja as respostas em tempo real

### 2. **Exemplos cURL**
- Cada endpoint contém exemplos prontos
- Copie e use no seu terminal
- Modifique conforme necessário

### 3. **Dados Pré-Carregados**
O banco já contém dados de exemplo:
- **5 Projetos** (IDs: 1-5)
- **19 Tarefas** distribuídas pelos projetos
- **8 Repositórios GitHub** com estatísticas reais

### 🔧 **Requisitos Técnicos**
- Node.js 18+
- MySQL 8.0+
- Docker & Docker Compose
- npm ou yarn

### 📚 **Links Úteis**
- [Repositório GitHub](https://github.com/seu-usuario/node-js-test)
- [Collection Postman](./docs/postman-collection.json)
- [Guia de Setup](./README.md)
      `,
      contact: {
        name: 'Ruan Hanani Galindo de Oliveira',
        email: 'ruan.hanani@example.com',
        url: 'https://linkedin.com/in/ruan-hanani'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: '🔧 Ambiente de Desenvolvimento Local',
      },
      {
        url: 'https://api.taskmanager.com',
        description: '🚀 Ambiente de Produção (Exemplo)',
      },
    ],
    externalDocs: {
      description: '📖 Documentação Completa no GitHub',
      url: 'https://github.com/seu-usuario/node-js-test#readme'
    },
    components: {
      schemas: {
        Project: {
          type: 'object',
          required: ['name'],
          properties: {
            id: {
              type: 'integer',
              description: '🆔 ID único do projeto',
              example: 1,
              readOnly: true
            },
            name: {
              type: 'string',
              minLength: 2,
              maxLength: 255,
              description: '📝 Nome do projeto (obrigatório)',
              example: 'E-commerce Platform',
            },
            description: {
              type: 'string',
              maxLength: 5000,
              description: '📜 Descrição detalhada do projeto (opcional)',
              example: 'Plataforma completa de e-commerce com React no frontend e Node.js no backend, incluindo sistema de pagamentos, catálogo de produtos e painel administrativo.',
            },
            status: {
              type: 'string',
              enum: ['active', 'inactive', 'completed'],
              description: '🟢 Status atual do projeto',
              example: 'active',
              default: 'active'
            },
            startDate: {
              type: 'string',
              format: 'date',
              description: '📅 Data de início do projeto (formato: YYYY-MM-DD)',
              example: '2024-01-15',
            },
            endDate: {
              type: 'string',
              format: 'date',
              description: '📎 Data prevista de conclusão (formato: YYYY-MM-DD)',
              example: '2024-06-30',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: '⏰ Data e hora de criação (gerado automaticamente)',
              example: '2024-01-15T10:00:00.000Z',
              readOnly: true
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: '🔄 Data e hora da última atualização',
              example: '2024-02-10T14:30:00.000Z',
              readOnly: true
            },
          },
          example: {
            id: 1,
            name: 'E-commerce Platform',
            description: 'Plataforma completa de e-commerce com React e Node.js',
            status: 'active',
            startDate: '2024-01-15',
            endDate: '2024-06-30',
            createdAt: '2024-01-15T10:00:00.000Z',
            updatedAt: '2024-02-10T14:30:00.000Z'
          }
        },
        ProjectInput: {
          type: 'object',
          required: ['name'],
          properties: {
            name: {
              type: 'string',
              minLength: 2,
              maxLength: 255,
              description: 'Nome do projeto',
              example: 'Novo Projeto Incrível'
            },
            description: {
              type: 'string',
              maxLength: 5000,
              description: 'Descrição opcional do projeto',
              example: 'Um projeto revolucionário que vai mudar o mundo'
            },
            status: {
              type: 'string',
              enum: ['active', 'inactive', 'completed'],
              description: 'Status do projeto',
              example: 'active'
            },
            startDate: {
              type: 'string',
              format: 'date',
              description: 'Data de início (YYYY-MM-DD)',
              example: '2024-04-01'
            },
            endDate: {
              type: 'string',
              format: 'date', 
              description: 'Data de fim (YYYY-MM-DD)',
              example: '2024-12-31'
            }
          },
          example: {
            name: 'Sistema de Vendas Online',
            description: 'Plataforma de vendas com integração a marketplaces',
            status: 'active',
            startDate: '2024-04-01',
            endDate: '2024-10-31'
          }
        },
        Task: {
          type: 'object',
          required: ['title', 'projectId'],
          properties: {
            id: {
              type: 'integer',
              description: '🆔 ID único da tarefa',
              example: 1,
              readOnly: true
            },
            title: {
              type: 'string',
              minLength: 2,
              maxLength: 255,
              description: '📝 Título da tarefa (obrigatório)',
              example: 'Implementar autenticação de usuários',
            },
            description: {
              type: 'string',
              maxLength: 5000,
              description: '📄 Descrição detalhada da tarefa (opcional)',
              example: 'Adicionar sistema de autenticação baseado em JWT com login, registro e recuperação de senha',
            },
            status: {
              type: 'string',
              enum: ['pending', 'in_progress', 'completed', 'cancelled'],
              description: '🟡 Status atual da tarefa',
              example: 'in_progress',
              default: 'pending'
            },
            priority: {
              type: 'string',
              enum: ['low', 'medium', 'high', 'critical'],
              description: '🔥 Prioridade da tarefa',
              example: 'high',
              default: 'medium'
            },
            projectId: {
              type: 'integer',
              description: '🔗 ID do projeto associado (obrigatório)',
              example: 1,
            },
            dueDate: {
              type: 'string',
              format: 'date',
              description: '📅 Data de vencimento da tarefa (formato: YYYY-MM-DD)',
              example: '2024-03-15',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: '⏰ Data de criação (gerado automaticamente)',
              example: '2024-01-18T09:00:00.000Z',
              readOnly: true
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: '🔄 Data da última atualização',
              example: '2024-02-10T16:45:00.000Z',
              readOnly: true
            },
          },
          example: {
            id: 2,
            title: 'Desenvolver sistema de autenticação',
            description: 'Implementar login, registro e recuperação de senha usando JWT',
            status: 'in_progress',
            priority: 'high',
            projectId: 1,
            dueDate: '2024-03-15',
            createdAt: '2024-01-18T09:00:00.000Z',
            updatedAt: '2024-02-10T16:45:00.000Z'
          }
        },
        GitHubRepo: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            githubId: { type: 'integer', format: 'int64', example: 278335273 },
            name: { type: 'string', example: 'github-readme-stats' },
            fullName: { type: 'string', example: 'anuraghazra/github-readme-stats' },
            description: { type: 'string', nullable: true, example: '⚡ Dynamically generated stats for your github readmes' },
            htmlUrl: { type: 'string', format: 'uri', example: 'https://github.com/anuraghazra/github-readme-stats' },
            cloneUrl: { type: 'string', format: 'uri', example: 'https://github.com/anuraghazra/github-readme-stats.git' },
            language: { type: 'string', nullable: true, example: 'JavaScript' },
            stargazersCount: { type: 'integer', example: 75828 },
            forksCount: { type: 'integer', example: 25917 },
            private: { type: 'boolean', example: false },
            username: { type: 'string', example: 'anuraghazra' },
            projectId: { type: 'integer', example: 1 },
            githubCreatedAt: { type: 'string', format: 'date-time', example: '2020-07-09T10:34:22.000Z' },
            githubUpdatedAt: { type: 'string', format: 'date-time', example: '2025-09-11T14:38:40.000Z' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
          example: {
            githubId: 278335273,
            name: 'github-readme-stats',
            fullName: 'anuraghazra/github-readme-stats',
            description: '⚡ Dynamically generated stats for your github readmes',
            htmlUrl: 'https://github.com/anuraghazra/github-readme-stats',
            language: 'JavaScript',
            stargazersCount: 75828,
            forksCount: 25917,
            private: false,
            username: 'anuraghazra',
            projectId: 1
          }
        },
        GitHubIntegrationResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Repositórios do GitHub para anuraghazra recuperados com sucesso' },
            data: {
              type: 'object',
              properties: {
                project: { $ref: '#/components/schemas/Project' },
                repositories: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/GitHubRepo' },
                  example: [{
                    githubId: 278335273,
                    name: 'github-readme-stats',
                    fullName: 'anuraghazra/github-readme-stats',
                    description: '⚡ Dynamically generated stats for your github readmes',
                    htmlUrl: 'https://github.com/anuraghazra/github-readme-stats',
                    language: 'JavaScript',
                    stargazersCount: 75828,
                    forksCount: 25917,
                    private: false,
                    username: 'anuraghazra',
                    projectId: 1
                  }]
                },
                meta: {
                  type: 'object',
                  properties: {
                    cached: { type: 'boolean', example: false },
                    cacheExpiry: { type: 'integer', nullable: true, example: 600 },
                    totalRepositories: { type: 'integer', example: 5 },
                    fetchedAt: { type: 'string', format: 'date-time', example: '2025-09-11T14:56:19.421Z' }
                  }
                }
              }
            },
            timestamp: { type: 'string', format: 'date-time' }
          }
        },
        TaskInput: {
          type: 'object',
          required: ['title', 'projectId'],
          properties: {
            title: {
              type: 'string',
              minLength: 2,
              maxLength: 255,
              description: 'Título da tarefa',
              example: 'Criar página de dashboard'
            },
            description: {
              type: 'string',
              maxLength: 5000,
              description: 'Descrição da tarefa',
              example: 'Desenvolver dashboard com métricas e gráficos interativos'
            },
            status: {
              type: 'string',
              enum: ['pending', 'in_progress', 'completed', 'cancelled'],
              description: 'Status da tarefa',
              example: 'pending'
            },
            priority: {
              type: 'string', 
              enum: ['low', 'medium', 'high', 'critical'],
              description: 'Prioridade da tarefa',
              example: 'medium'
            },
            projectId: {
              type: 'integer',
              description: 'ID do projeto',
              example: 1
            },
            dueDate: {
              type: 'string',
              format: 'date',
              description: 'Data limite (YYYY-MM-DD)',
              example: '2024-05-01'
            }
          },
          example: {
            title: 'Integrar com API de pagamento',
            description: 'Conectar sistema com Stripe para processar pagamentos',
            status: 'pending',
            priority: 'high',
            projectId: 1,
            dueDate: '2024-04-15'
          }
        },
        GitHubRepo: {
          type: 'object',
          required: ['githubId', 'name', 'fullName', 'htmlUrl', 'cloneUrl', 'username', 'githubCreatedAt', 'githubUpdatedAt', 'projectId'],
          properties: {
            id: {
              type: 'integer',
              description: '🆔 ID único no banco de dados local',
              example: 1,
              readOnly: true
            },
            githubId: {
              type: 'integer',
              description: '🐙 ID único do repositório no GitHub',
              example: 123456789,
            },
            name: {
              type: 'string',
              description: '📝 Nome do repositório',
              example: 'ecommerce-frontend',
            },
            fullName: {
              type: 'string',
              description: '📂 Nome completo (usuário/repositório)',
              example: 'testuser/ecommerce-frontend',
            },
            description: {
              type: 'string',
              nullable: true,
              description: '📄 Descrição do repositório',
              example: 'Frontend da plataforma de e-commerce desenvolvido em React com TypeScript',
            },
            htmlUrl: {
              type: 'string',
              format: 'uri',
              description: '🌐 URL pública do repositório no GitHub',
              example: 'https://github.com/testuser/ecommerce-frontend',
            },
            cloneUrl: {
              type: 'string',
              format: 'uri',
              description: '📎 URL para clonar o repositório',
              example: 'https://github.com/testuser/ecommerce-frontend.git',
            },
            language: {
              type: 'string',
              nullable: true,
              description: '💻 Linguagem principal do repositório',
              example: 'TypeScript',
            },
            stargazersCount: {
              type: 'integer',
              minimum: 0,
              description: '⭐ Número de estrelas (GitHub stars)',
              example: 245,
            },
            forksCount: {
              type: 'integer',
              minimum: 0,
              description: '🍴 Número de forks',
              example: 67,
            },
            private: {
              type: 'boolean',
              description: '🔒 Indica se o repositório é privado',
              example: false,
            },
            username: {
              type: 'string',
              description: '👤 Nome de usuário do proprietário',
              example: 'testuser',
            },
            projectId: {
              type: 'integer',
              description: '🔗 ID do projeto associado',
              example: 1,
            },
            githubCreatedAt: {
              type: 'string',
              format: 'date-time',
              description: '📅 Data de criação no GitHub',
              example: '2024-01-15T12:00:00.000Z',
            },
            githubUpdatedAt: {
              type: 'string',
              format: 'date-time',
              description: '🔄 Última atualização no GitHub',
              example: '2024-02-10T14:30:00.000Z',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: '⏰ Data de criação local (gerado automaticamente)',
              example: '2024-01-15T12:00:00.000Z',
              readOnly: true
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: '🔄 Data da última atualização local',
              example: '2024-02-10T14:30:00.000Z',
              readOnly: true
            },
          },
          example: {
            id: 1,
            githubId: 123456789,
            name: 'ecommerce-frontend',
            fullName: 'testuser/ecommerce-frontend',
            description: 'Frontend da plataforma de e-commerce com React e TypeScript',
            htmlUrl: 'https://github.com/testuser/ecommerce-frontend',
            cloneUrl: 'https://github.com/testuser/ecommerce-frontend.git',
            language: 'TypeScript',
            stargazersCount: 245,
            forksCount: 67,
            private: false,
            username: 'testuser',
            projectId: 1,
            githubCreatedAt: '2024-01-15T12:00:00.000Z',
            githubUpdatedAt: '2024-02-10T14:30:00.000Z',
            createdAt: '2024-01-15T12:00:00.000Z',
            updatedAt: '2024-02-10T14:30:00.000Z'
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
              description: 'Indica que a operação falhou'
            },
            message: {
              type: 'string',
              example: 'Erro de validação',
              description: 'Mensagem de erro principal'
            },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: {
                    type: 'string',
                    example: 'name',
                    description: 'Campo que causou o erro'
                  },
                  message: {
                    type: 'string',
                    example: 'Nome é obrigatório e deve ter pelo menos 2 caracteres',
                    description: 'Detalhes específicos do erro'
                  },
                },
              },
              description: 'Lista detalhada de erros de validação'
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              example: '2024-03-15T10:30:00.000Z',
              description: 'Data e hora do erro'
            },
          },
          example: {
            success: false,
            message: 'Erro de validação',
            errors: [
              {
                field: 'name',
                message: 'Nome é obrigatório e deve ter pelo menos 2 caracteres'
              },
              {
                field: 'projectId',
                message: 'ID do projeto deve ser um número inteiro positivo'
              }
            ],
            timestamp: '2024-03-15T10:30:00.000Z'
          }
        },
        ValidationError: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            message: {
              type: 'string',
              example: 'Dados inválidos fornecidos'
            },
            errors: {
              type: 'array',
              items: {
                type: 'string'
              },
              example: ['Nome é obrigatório', 'Email deve ter formato válido']
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              example: '2024-03-15T10:30:00.000Z'
            }
          }
        },
        NotFoundError: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            message: {
              type: 'string',
              example: 'Recurso não encontrado'
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              example: '2024-03-15T10:30:00.000Z'
            }
          }
        },
        SuccessResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
              description: 'Indica que a operação foi realizada com sucesso'
            },
            message: {
              type: 'string',
              example: 'Dados criados com sucesso',
              description: 'Mensagem descritiva da operação'
            },
            data: {
              type: 'object',
              description: 'Dados retornados pela operação'
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              example: '2024-03-15T10:30:00.000Z',
              description: 'Data e hora da resposta'
            },
          },
          example: {
            success: true,
            message: 'Projeto criado com sucesso',
            data: {
              id: 6,
              name: 'Novo Projeto',
              description: 'Descrição do projeto',
              status: 'active',
              startDate: '2024-04-01',
              endDate: '2024-12-31',
              createdAt: '2024-03-15T10:30:00.000Z',
              updatedAt: '2024-03-15T10:30:00.000Z'
            },
            timestamp: '2024-03-15T10:30:00.000Z'
          }
        },
        DeleteResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            message: {
              type: 'string',
              example: 'Recurso deletado com sucesso'
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              example: '2024-03-15T10:30:00.000Z'
            }
          }
        },
        PaginatedResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
              description: 'Indica sucesso da operação'
            },
            message: {
              type: 'string',
              example: 'Dados recuperados com sucesso',
              description: 'Mensagem descritiva'
            },
            data: {
              type: 'array',
              items: {},
              description: 'Lista de itens da página atual'
            },
            pagination: {
              type: 'object',
              properties: {
                page: {
                  type: 'integer',
                  example: 1,
                  description: 'Página atual'
                },
                limit: {
                  type: 'integer',
                  example: 10,
                  description: 'Itens por página'
                },
                total: {
                  type: 'integer',
                  example: 25,
                  description: 'Total de itens encontrados'
                },
                pages: {
                  type: 'integer',
                  example: 3,
                  description: 'Total de páginas disponíveis'
                },
                hasNext: {
                  type: 'boolean',
                  example: true,
                  description: 'Se existe próxima página'
                },
                hasPrev: {
                  type: 'boolean',
                  example: false,
                  description: 'Se existe página anterior'
                },
              },
              description: 'Informações de paginação'
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              example: '2024-03-15T10:30:00.000Z',
              description: 'Data e hora da resposta'
            },
          },
          example: {
            success: true,
            message: 'Projetos recuperados com sucesso',
            data: [
              {
                id: 1,
                name: 'E-commerce Platform',
                description: 'Plataforma completa de e-commerce',
                status: 'active',
                startDate: '2024-01-15',
                endDate: '2024-06-30',
                createdAt: '2024-01-15T10:00:00.000Z',
                updatedAt: '2024-01-15T10:00:00.000Z'
              },
              {
                id: 2,
                name: 'Mobile App Development',
                description: 'App mobile para gestão de tarefas',
                status: 'active',
                startDate: '2024-02-01',
                endDate: '2024-08-31',
                createdAt: '2024-02-01T14:30:00.000Z',
                updatedAt: '2024-02-20T16:45:00.000Z'
              }
            ],
            pagination: {
              page: 1,
              limit: 10,
              total: 5,
              pages: 1,
              hasNext: false,
              hasPrev: false
            },
            timestamp: '2024-03-15T10:30:00.000Z'
          }
        },
      },
      parameters: {
        PageParam: {
          name: 'page',
          in: 'query',
          description: '📄 Número da página (começa em 1)',
          required: false,
          schema: {
            type: 'integer',
            minimum: 1,
            default: 1,
            example: 1
          }
        },
        LimitParam: {
          name: 'limit',
          in: 'query', 
          description: '🔢 Número de itens por página (máximo: 50)',
          required: false,
          schema: {
            type: 'integer',
            minimum: 1,
            maximum: 50,
            default: 10,
            example: 10
          }
        },
        ProjectIdParam: {
          name: 'id',
          in: 'path',
          description: '🆔 ID único do projeto',
          required: true,
          schema: {
            type: 'integer',
            minimum: 1,
            example: 1
          }
        },
        TaskIdParam: {
          name: 'id',
          in: 'path',
          description: '🆔 ID único da tarefa',
          required: true,
          schema: {
            type: 'integer',
            minimum: 1,
            example: 1
          }
        },
        RepoIdParam: {
          name: 'id',
          in: 'path',
          description: '🆔 ID único do repositório GitHub',
          required: true,
          schema: {
            type: 'integer',
            minimum: 1,
            example: 1
          }
        },
        StatusParam: {
          name: 'status',
          in: 'query',
          description: '🟡 Filtrar por status',
          required: false,
          schema: {
            type: 'string',
            enum: ['pending', 'in_progress', 'completed', 'cancelled']
          }
        },
        PriorityParam: {
          name: 'priority',
          in: 'query',
          description: '🔥 Filtrar por prioridade',
          required: false,
          schema: {
            type: 'string',
            enum: ['low', 'medium', 'high', 'critical']
          }
        },
        LanguageParam: {
          name: 'language',
          in: 'query',
          description: '💻 Filtrar por linguagem de programação',
          required: false,
          schema: {
            type: 'string',
            example: 'JavaScript'
          }
        },
        ProjectFilterParam: {
          name: 'projectId',
          in: 'query',
          description: '🔗 Filtrar por ID do projeto',
          required: false,
          schema: {
            type: 'integer',
            minimum: 1,
            example: 1
          }
        }
      },
      responses: {
        200: {
          description: '✅ Operação realizada com sucesso',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/SuccessResponse'
              }
            }
          }
        },
        400: {
          description: '❌ Erro de validação nos dados fornecidos',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ValidationError'
              }
            }
          }
        },
        404: {
          description: '🔍 Recurso não encontrado',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/NotFoundError'
              }
            }
          }
        },
        500: {
          description: '⚠️ Erro interno do servidor',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        }
      }
    },
    tags: [
      {
        name: 'API Info',
        description: 'General API information and health check endpoints'
      },
      {
        name: 'Projects CRUD',
        description: 'Complete project management - CRUD operations and relationships',
        externalDocs: {
          description: 'Postman Collection',
          url: './docs/postman-collection.json'
        }
      },
      {
        name: 'Tasks CRUD',
        description: 'Task management linked to projects - Priorities, status and deadlines'
      },
      {
        name: 'GitHub Integration',
        description: 'GitHub repositories integration for projects - Fetch and store user repositories'
      }
    ]
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'], // Paths to files containing OpenAPI definitions
};

const swaggerSpec = swaggerJSDoc(options);

export { swaggerUi, swaggerSpec };
