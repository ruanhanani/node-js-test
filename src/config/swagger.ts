import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Node.js Test API - Gerenciador de Projetos e Tarefas',
      version: '1.0.0',
      description: `
        API REST completa para gerenciamento de projetos e tarefas com integração GitHub.
        
        ## Funcionalidades
        - ✅ CRUD completo de Projetos e Tarefas
        - ✅ Integração com GitHub API (5 últimos repositórios)
        - ✅ Cache Redis com TTL de 10 minutos
        - ✅ Arquitetura em camadas (Controllers → Services → Repositories)
        - ✅ Validação rigorosa com Joi
        - ✅ Tratamento robusto de erros
        - ✅ Paginação e filtros avançados
        - ✅ Logs detalhados e rate limiting
      `,
      contact: {
        name: 'Ruan Hanani',
        email: 'ruan@example.com',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de Desenvolvimento',
      },
    ],
    components: {
      schemas: {
        Project: {
          type: 'object',
          required: ['name'],
          properties: {
            id: {
              type: 'integer',
              description: 'ID único do projeto',
              example: 1,
            },
            name: {
              type: 'string',
              minLength: 2,
              maxLength: 255,
              description: 'Nome do projeto',
              example: 'E-commerce Platform',
            },
            description: {
              type: 'string',
              maxLength: 5000,
              description: 'Descrição detalhada do projeto',
              example: 'Complete e-commerce solution with React and Node.js',
            },
            status: {
              type: 'string',
              enum: ['active', 'inactive', 'completed'],
              description: 'Status atual do projeto',
              example: 'active',
            },
            startDate: {
              type: 'string',
              format: 'date',
              description: 'Data de início do projeto',
              example: '2025-01-01',
            },
            endDate: {
              type: 'string',
              format: 'date',
              description: 'Data de término do projeto',
              example: '2025-06-30',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Data de criação',
              example: '2025-01-01T00:00:00.000Z',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Data da última atualização',
              example: '2025-01-01T00:00:00.000Z',
            },
          },
        },
        Task: {
          type: 'object',
          required: ['title', 'projectId'],
          properties: {
            id: {
              type: 'integer',
              description: 'ID único da tarefa',
              example: 1,
            },
            title: {
              type: 'string',
              minLength: 2,
              maxLength: 255,
              description: 'Título da tarefa',
              example: 'Implement user authentication',
            },
            description: {
              type: 'string',
              maxLength: 5000,
              description: 'Descrição detalhada da tarefa',
              example: 'Add JWT-based authentication system with login and registration',
            },
            status: {
              type: 'string',
              enum: ['pending', 'in_progress', 'completed', 'cancelled'],
              description: 'Status atual da tarefa',
              example: 'in_progress',
            },
            priority: {
              type: 'string',
              enum: ['low', 'medium', 'high', 'critical'],
              description: 'Prioridade da tarefa',
              example: 'high',
            },
            projectId: {
              type: 'integer',
              description: 'ID do projeto associado',
              example: 1,
            },
            dueDate: {
              type: 'string',
              format: 'date',
              description: 'Data de vencimento da tarefa',
              example: '2025-02-28',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Data de criação',
              example: '2025-01-01T00:00:00.000Z',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Data da última atualização',
              example: '2025-01-01T00:00:00.000Z',
            },
          },
        },
        GitHubRepo: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'ID único no banco de dados',
              example: 1,
            },
            githubId: {
              type: 'integer',
              description: 'ID único no GitHub',
              example: 123456789,
            },
            name: {
              type: 'string',
              description: 'Nome do repositório',
              example: 'ecommerce-frontend',
            },
            fullName: {
              type: 'string',
              description: 'Nome completo do repositório',
              example: 'testuser/ecommerce-frontend',
            },
            description: {
              type: 'string',
              description: 'Descrição do repositório',
              example: 'Frontend for e-commerce platform built with React',
            },
            htmlUrl: {
              type: 'string',
              description: 'URL do repositório no GitHub',
              example: 'https://github.com/testuser/ecommerce-frontend',
            },
            language: {
              type: 'string',
              description: 'Linguagem principal do repositório',
              example: 'TypeScript',
            },
            stargazersCount: {
              type: 'integer',
              description: 'Número de estrelas',
              example: 42,
            },
            forksCount: {
              type: 'integer',
              description: 'Número de forks',
              example: 8,
            },
            private: {
              type: 'boolean',
              description: 'Se o repositório é privado',
              example: false,
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            message: {
              type: 'string',
              example: 'Erro interno do servidor',
            },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: {
                    type: 'string',
                    example: 'name',
                  },
                  message: {
                    type: 'string',
                    example: 'Nome é obrigatório',
                  },
                },
              },
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              example: '2025-01-01T00:00:00.000Z',
            },
          },
        },
        SuccessResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            message: {
              type: 'string',
              example: 'Operação realizada com sucesso',
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              example: '2025-01-01T00:00:00.000Z',
            },
          },
        },
        PaginatedResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            message: {
              type: 'string',
              example: 'Dados recuperados com sucesso',
            },
            data: {
              type: 'array',
              items: {},
            },
            pagination: {
              type: 'object',
              properties: {
                page: {
                  type: 'integer',
                  example: 1,
                },
                limit: {
                  type: 'integer',
                  example: 10,
                },
                total: {
                  type: 'integer',
                  example: 25,
                },
                pages: {
                  type: 'integer',
                  example: 3,
                },
              },
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              example: '2025-01-01T00:00:00.000Z',
            },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'], // Paths to files containing OpenAPI definitions
};

const swaggerSpec = swaggerJSDoc(options);

export { swaggerUi, swaggerSpec };
