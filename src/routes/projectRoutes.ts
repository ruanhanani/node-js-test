import { Router } from 'express';
import { ProjectController } from '@controllers/ProjectController';
import { validateProject, validateParams, validateGitHub } from '@middlewares/validation';

const router = Router();
const projectController = new ProjectController();

// INDEPENDENT TEST ROUTE - No controller dependencies
router.get('/test-direct', (req, res) => {
  console.log('✨ INDEPENDENT TEST called');
  res.json({ success: true, message: 'Independent test works', query: req.query });
});

// DEBUG ROUTES
router.get(
  '/debug',
  projectController.debugGetProjects
);

router.get(
  '/debug-db',
  projectController.debugDatabase
);

// Test GitHub API directly - MUST BE BEFORE other routes
router.get(
  '/test-github/:username',
  projectController.testGitHubAPI
);

// Flush all cache route
router.delete(
  '/cache/flush-all',
  projectController.flushAllCache
);

/**
 * @swagger
 * /api/projects:
 *   get:
 *     summary: List all projects
 *     description: |
 *       Retorna uma lista paginada de projetos com filtros opcionais.
 *       
 *       ### Filtros Disponíveis:
 *       - **Status**: `active`, `inactive`, `completed`
 *       - **Data de Criação**: Intervalo de datas
 *       - **Busca**: Por nome ou descrição
 *       
 *       ### Paginação:
 *       - **page**: Página atual (padrão: 1)
 *       - **limit**: Itens por página (máximo: 50, padrão: 10)
 *       
 *       ### Exemplos de Uso:
 *       ```bash
 *       # Todos os projetos ativos
 *       GET /api/projects?status=active
 *       
 *       # Segunda página com 20 itens
 *       GET /api/projects?page=2&limit=20
 *       
 *       # Buscar por nome
 *       GET /api/projects?search=ecommerce
 *       ```
 *     tags: [Projects CRUD]
 *     parameters:
 *       - $ref: '#/components/parameters/PageParam'
 *       - $ref: '#/components/parameters/LimitParam'
 *       - name: status
 *         in: query
 *         description: Filter by project status
 *         required: false
 *         schema:
 *           type: string
 *           enum: [active, inactive, completed]
 *           example: active
 *       - name: search
 *         in: query
 *         description: 🔍 Buscar por nome ou descrição
 *         required: false
 *         schema:
 *           type: string
 *           example: ecommerce
 *       - name: startDate
 *         in: query
 *         description: 📅 Data inicial (formato: YYYY-MM-DD)
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *           example: 2024-01-01
 *       - name: endDate
 *         in: query
 *         description: 📅 Data final (formato: YYYY-MM-DD)
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *           example: 2024-12-31
 *     responses:
 *       200:
 *         description: ✅ Lista de projetos recuperada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/PaginatedResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Project'
 *             examples:
 *               success:
 *                 summary: Resposta de sucesso
 *                 value:
 *                   success: true
 *                   message: "Projetos recuperados com sucesso"
 *                   data:
 *                     - id: 1
 *                       name: "E-commerce Platform"
 *                       description: "Plataforma completa de e-commerce"
 *                       status: "active"
 *                       startDate: "2024-01-15"
 *                       endDate: "2024-06-30"
 *                       createdAt: "2024-01-15T10:00:00.000Z"
 *                       updatedAt: "2024-01-15T10:00:00.000Z"
 *                     - id: 2
 *                       name: "Mobile App Development"
 *                       description: "App mobile para gestão de tarefas"
 *                       status: "active"
 *                       startDate: "2024-02-01"
 *                       endDate: "2024-08-31"
 *                       createdAt: "2024-02-01T14:30:00.000Z"
 *                       updatedAt: "2024-02-20T16:45:00.000Z"
 *                   pagination:
 *                     page: 1
 *                     limit: 10
 *                     total: 5
 *                     pages: 1
 *                     hasNext: false
 *                     hasPrev: false
 *                   timestamp: "2024-03-15T10:30:00.000Z"
 *       400:
 *         $ref: '#/components/responses/400'
 *       500:
 *         $ref: '#/components/responses/500'
 */
router.get(
  '/',
  // validateProject.query, // Temporarily disabled
  projectController.getProjects
);




/**
 * @swagger
 * /api/projects:
 *   post:
 *     summary: 🆕 Criar um novo projeto
 *     description: |
 *       Cria um novo projeto no sistema.
 *       
 *       ### Campos Obrigatórios:
 *       - **name**: Nome do projeto (2-255 caracteres)
 *       
 *       ### Campos Opcionais:
 *       - **description**: Descrição detalhada
 *       - **status**: Status inicial (padrão: `active`)
 *       - **startDate**: Data de início
 *       - **endDate**: Data prevista de conclusão
 *       
 *       ### Validações:
 *       - Nome deve ter entre 2 e 255 caracteres
 *       - Status deve ser: `active`, `inactive` ou `completed`
 *       - Datas devem estar no formato YYYY-MM-DD
 *       - Data final deve ser posterior à data inicial
 *       
 *       ### Exemplo cURL:
 *       ```bash
 *       curl -X POST http://localhost:3000/api/projects \\
 *         -H "Content-Type: application/json" \\
 *         -d '{
 *           "name": "Sistema de Vendas Online",
 *           "description": "Plataforma completa para vendas com integração a marketplaces",
 *           "status": "active",
 *           "startDate": "2024-04-01",
 *           "endDate": "2024-12-31"
 *         }'
 *       ```
 *     tags: [Projects CRUD]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProjectInput'
 *           examples:
 *             complete:
 *               summary: Projeto completo
 *               value:
 *                 name: "E-commerce Marketplace"
 *                 description: "Plataforma de marketplace multi-vendor com sistema de pagamentos integrado"
 *                 status: "active"
 *                 startDate: "2024-04-01"
 *                 endDate: "2024-10-31"
 *             minimal:
 *               summary: Projeto mínimo (apenas nome)
 *               value:
 *                 name: "Projeto Rápido"
 *             enterprise:
 *               summary: Projeto empresarial
 *               value:
 *                 name: "Sistema ERP Corporativo"
 *                 description: "Sistema integrado de gestão empresarial com módulos de vendas, estoque, financeiro e RH"
 *                 status: "active"
 *                 startDate: "2024-05-01"
 *                 endDate: "2025-04-30"
 *     responses:
 *       201:
 *         description: ✅ Projeto criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Project'
 *             examples:
 *               created:
 *                 summary: Projeto recém-criado
 *                 value:
 *                   success: true
 *                   message: "Projeto criado com sucesso"
 *                   data:
 *                     id: 6
 *                     name: "Sistema de Vendas Online"
 *                     description: "Plataforma completa para vendas com integração a marketplaces"
 *                     status: "active"
 *                     startDate: "2024-04-01"
 *                     endDate: "2024-12-31"
 *                     createdAt: "2024-03-15T10:30:00.000Z"
 *                     updatedAt: "2024-03-15T10:30:00.000Z"
 *                   timestamp: "2024-03-15T10:30:00.000Z"
 *       400:
 *         description: ❌ Dados inválidos fornecidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *             examples:
 *               validation_error:
 *                 summary: Erro de validação
 *                 value:
 *                   success: false
 *                   message: "Dados inválidos fornecidos"
 *                   errors:
 *                     - field: "name"
 *                       message: "Nome é obrigatório e deve ter pelo menos 2 caracteres"
 *                     - field: "endDate"
 *                       message: "Data final deve ser posterior à data inicial"
 *                   timestamp: "2024-03-15T10:30:00.000Z"
 *               missing_name:
 *                 summary: Nome ausente
 *                 value:
 *                   success: false
 *                   message: "Dados inválidos fornecidos"
 *                   errors:
 *                     - field: "name"
 *                       message: "Nome é obrigatório"
 *                   timestamp: "2024-03-15T10:30:00.000Z"
 *       500:
 *         $ref: '#/components/responses/500'
 */
router.post(
  '/',
  // validateProject.create, // Temporarily disabled
  projectController.createProject
);

/**
 * @swagger
 * /api/projects/{id}:
 *   get:
 *     summary: 🔍 Buscar projeto por ID
 *     description: |
 *       Retorna os detalhes completos de um projeto específico.
 *       
 *       ### Informações Retornadas:
 *       - Dados completos do projeto
 *       - Datas de criação e atualização
 *       - Status atual e cronograma
 *       
 *       ### Casos de Uso:
 *       - Visualizar detalhes de um projeto
 *       - Verificar informações antes de editar
 *       - Integração com outras APIs
 *       
 *       ### Exemplo cURL:
 *       ```bash
 *       curl -X GET http://localhost:3000/api/projects/1 \\
 *         -H "Content-Type: application/json"
 *       ```
 *     tags: [Projects CRUD]
 *     parameters:
 *       - $ref: '#/components/parameters/ProjectIdParam'
 *     responses:
 *       200:
 *         description: ✅ Projeto encontrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Project'
 *             examples:
 *               project_found:
 *                 summary: Projeto encontrado
 *                 value:
 *                   success: true
 *                   message: "Projeto encontrado com sucesso"
 *                   data:
 *                     id: 1
 *                     name: "E-commerce Platform"
 *                     description: "Plataforma completa de e-commerce com React no frontend e Node.js no backend"
 *                     status: "active"
 *                     startDate: "2024-01-15"
 *                     endDate: "2024-06-30"
 *                     createdAt: "2024-01-15T10:00:00.000Z"
 *                     updatedAt: "2024-02-10T14:30:00.000Z"
 *                   timestamp: "2024-03-15T10:30:00.000Z"
 *       404:
 *         description: 🔍 Projeto não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFoundError'
 *             examples:
 *               not_found:
 *                 summary: Projeto não encontrado
 *                 value:
 *                   success: false
 *                   message: "Projeto com ID 999 não encontrado"
 *                   timestamp: "2024-03-15T10:30:00.000Z"
 *       400:
 *         description: ❌ ID inválido fornecido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *             examples:
 *               invalid_id:
 *                 summary: ID inválido
 *                 value:
 *                   success: false
 *                   message: "Dados inválidos fornecidos"
 *                   errors:
 *                     - field: "id"
 *                       message: "ID deve ser um número inteiro positivo"
 *                   timestamp: "2024-03-15T10:30:00.000Z"
 *       500:
 *         $ref: '#/components/responses/500'
 */
router.get(
  '/:id',
  // validateParams.id, // Temporarily disabled
  projectController.getProjectById
);

/**
 * @swagger
 * /api/projects/{id}:
 *   put:
 *     summary: Update an existing project
 *     description: |
 *       Updates an existing project with new information.
 *       
 *       ### Updateable Fields:
 *       - **name**: Project name (2-255 characters)
 *       - **description**: Detailed description
 *       - **status**: Project status
 *       - **startDate**: Start date
 *       - **endDate**: End date
 *       
 *       ### Validation Rules:
 *       - All fields are optional for updates
 *       - Name must be 2-255 characters if provided
 *       - Status must be valid enum value
 *       - End date must be after start date if both provided
 *       
 *       ### Example cURL:
 *       ```bash
 *       curl -X PUT http://localhost:3000/api/projects/1 \\
 *         -H "Content-Type: application/json" \\
 *         -d '{
 *           "name": "E-commerce Platform Updated",
 *           "status": "completed"
 *         }'
 *       ```
 *     tags: [Projects CRUD]
 *     parameters:
 *       - $ref: '#/components/parameters/ProjectIdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProjectInput'
 *           examples:
 *             status_update:
 *               summary: Update status only
 *               value:
 *                 status: "completed"
 *             full_update:
 *               summary: Update multiple fields
 *               value:
 *                 name: "E-commerce Platform - Enhanced"
 *                 description: "Enhanced e-commerce platform with AI recommendations"
 *                 status: "active"
 *                 endDate: "2024-12-31"
 *             name_description:
 *               summary: Update name and description
 *               value:
 *                 name: "Advanced E-commerce Solution"
 *                 description: "Complete e-commerce solution with advanced features"
 *     responses:
 *       200:
 *         description: Project updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Project'
 *             examples:
 *               updated:
 *                 summary: Project successfully updated
 *                 value:
 *                   success: true
 *                   message: "Project updated successfully"
 *                   data:
 *                     id: 1
 *                     name: "E-commerce Platform - Enhanced"
 *                     description: "Enhanced e-commerce platform with AI recommendations"
 *                     status: "active"
 *                     startDate: "2024-01-15"
 *                     endDate: "2024-12-31"
 *                     createdAt: "2024-01-15T10:00:00.000Z"
 *                     updatedAt: "2024-03-15T14:30:00.000Z"
 *                   timestamp: "2024-03-15T14:30:00.000Z"
 *       404:
 *         description: Project not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFoundError'
 *             examples:
 *               not_found:
 *                 summary: Project not found
 *                 value:
 *                   success: false
 *                   message: "Project with ID 999 not found"
 *                   timestamp: "2024-03-15T14:30:00.000Z"
 *       400:
 *         description: Invalid data provided
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *             examples:
 *               validation_error:
 *                 summary: Validation errors
 *                 value:
 *                   success: false
 *                   message: "Invalid data provided"
 *                   errors:
 *                     - field: "name"
 *                       message: "Name must be at least 2 characters long"
 *                     - field: "status"
 *                       message: "Status must be: active, inactive or completed"
 *                   timestamp: "2024-03-15T14:30:00.000Z"
 *       500:
 *         $ref: '#/components/responses/500'
 */
router.put(
  '/:id',
  validateParams.id,
  validateProject.update,
  projectController.updateProject
);

/**
 * @swagger
 * /api/projects/{id}:
 *   delete:
 *     summary: Delete a project
 *     description: |
 *       Permanently deletes a project and all associated data.
 *       
 *       ### Warning:
 *       This action is irreversible. All associated tasks and GitHub repositories
 *       will also be deleted from the system.
 *       
 *       ### Use Cases:
 *       - Remove cancelled projects
 *       - Clean up test/demo projects
 *       - Archive completed projects
 *       
 *       ### Example cURL:
 *       ```bash
 *       curl -X DELETE http://localhost:3000/api/projects/1 \\
 *         -H "Content-Type: application/json"
 *       ```
 *     tags: [Projects CRUD]
 *     parameters:
 *       - $ref: '#/components/parameters/ProjectIdParam'
 *     responses:
 *       200:
 *         description: Project deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DeleteResponse'
 *             examples:
 *               deleted:
 *                 summary: Project successfully deleted
 *                 value:
 *                   success: true
 *                   message: "Project deleted successfully"
 *                   timestamp: "2024-03-15T15:00:00.000Z"
 *       404:
 *         description: Project not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFoundError'
 *             examples:
 *               not_found:
 *                 summary: Project not found
 *                 value:
 *                   success: false
 *                   message: "Project with ID 999 not found"
 *                   timestamp: "2024-03-15T15:00:00.000Z"
 *       400:
 *         description: Invalid ID provided
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *             examples:
 *               invalid_id:
 *                 summary: Invalid project ID
 *                 value:
 *                   success: false
 *                   message: "Invalid data provided"
 *                   errors:
 *                     - field: "id"
 *                       message: "ID must be a positive integer"
 *                   timestamp: "2024-03-15T15:00:00.000Z"
 *       500:
 *         $ref: '#/components/responses/500'
 */
router.delete(
  '/:id',
  validateParams.id,
  projectController.deleteProject
);

// Project tasks routes
router.get(
  '/:id/tasks',
  validateParams.id,
  projectController.getProjectTasks
);

/**
 * @swagger
 * /api/projects/{id}/github/{username}:
 *   get:
 *     summary: 🐙 Buscar repositórios GitHub de um usuário para o projeto
 *     description: |
 *       Busca os repositórios GitHub de um usuário e associa ao projeto.
 *       
 *       ### Funcionalidades:
 *       - Conecta com a API do GitHub para buscar repositórios públicos
 *       - Armazena informações como estrelas, forks, linguagem
 *       - Cache inteligente para evitar chamadas desnecessárias
 *       - Associa repositórios ao projeto especificado
 *       
 *       ### Informações Coletadas:
 *       - Nome e descrição do repositório
 *       - Linguagem principal
 *       - Número de estrelas e forks
 *       - URLs (navegar e clonar)
 *       - Datas de criação e última atualização
 *       
 *       ### Rate Limiting:
 *       A API do GitHub tem limites. Use com moderação!
 *       
 *       ### Exemplo cURL:
 *       ```bash
 *       curl -X GET http://localhost:3000/api/projects/1/github/testuser \\
 *         -H "Content-Type: application/json"
 *       ```
 *     tags: [GitHub Integration]
 *     parameters:
 *       - $ref: '#/components/parameters/ProjectIdParam'
 *       - name: username
 *         in: path
 *         description: 👤 Nome de usuário do GitHub
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?$'
 *           example: testuser
 *         examples:
 *           valid_username:
 *             summary: Usuário válido
 *             value: testuser
 *           github_org:
 *             summary: Organização no GitHub
 *             value: microsoft
 *           popular_user:
 *             summary: Usuário popular
 *             value: torvalds
 *     responses:
 *       200:
 *         description: ✅ Repositórios encontrados e associados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         project:
 *                           $ref: '#/components/schemas/Project'
 *                         repositories:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/GitHubRepo'
 *                         stats:
 *                           type: object
 *                           properties:
 *                             total:
 *                               type: integer
 *                               example: 8
 *                             totalStars:
 *                               type: integer
 *                               example: 1247
 *                             totalForks:
 *                               type: integer
 *                               example: 298
 *                             languages:
 *                               type: object
 *                               example:
 *                                 JavaScript: 3
 *                                 TypeScript: 2
 *                                 Python: 2
 *                                 Rust: 1
 *             examples:
 *               repositories_found:
 *                 summary: Repositórios encontrados
 *                 value:
 *                   success: true
 *                   message: "Repositórios GitHub encontrados e associados com sucesso"
 *                   data:
 *                     project:
 *                       id: 1
 *                       name: "E-commerce Platform"
 *                       status: "active"
 *                     repositories:
 *                       - id: 1
 *                         githubId: 123456789
 *                         name: "ecommerce-frontend"
 *                         fullName: "testuser/ecommerce-frontend"
 *                         description: "Frontend da plataforma de e-commerce com React"
 *                         htmlUrl: "https://github.com/testuser/ecommerce-frontend"
 *                         language: "JavaScript"
 *                         stargazersCount: 245
 *                         forksCount: 67
 *                         private: false
 *                         projectId: 1
 *                       - id: 2
 *                         githubId: 987654321
 *                         name: "ecommerce-backend"
 *                         fullName: "testuser/ecommerce-backend"
 *                         description: "Backend API com Node.js e Express"
 *                         htmlUrl: "https://github.com/testuser/ecommerce-backend"
 *                         language: "TypeScript"
 *                         stargazersCount: 189
 *                         forksCount: 43
 *                         private: false
 *                         projectId: 1
 *                     stats:
 *                       total: 2
 *                       totalStars: 434
 *                       totalForks: 110
 *                       languages:
 *                         JavaScript: 1
 *                         TypeScript: 1
 *                   timestamp: "2024-03-15T10:30:00.000Z"
 *               no_repositories:
 *                 summary: Nenhum repositório encontrado
 *                 value:
 *                   success: true
 *                   message: "Nenhum repositório público encontrado para o usuário"
 *                   data:
 *                     project:
 *                       id: 1
 *                       name: "E-commerce Platform"
 *                       status: "active"
 *                     repositories: []
 *                     stats:
 *                       total: 0
 *                       totalStars: 0
 *                       totalForks: 0
 *                       languages: {}
 *                   timestamp: "2024-03-15T10:30:00.000Z"
 *       404:
 *         description: 🔍 Projeto ou usuário GitHub não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFoundError'
 *             examples:
 *               project_not_found:
 *                 summary: Projeto não encontrado
 *                 value:
 *                   success: false
 *                   message: "Projeto com ID 999 não encontrado"
 *                   timestamp: "2024-03-15T10:30:00.000Z"
 *               user_not_found:
 *                 summary: Usuário GitHub não encontrado
 *                 value:
 *                   success: false
 *                   message: "Usuário 'usuarioinexistente' não encontrado no GitHub"
 *                   timestamp: "2024-03-15T10:30:00.000Z"
 *       400:
 *         description: ❌ Dados inválidos fornecidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *             examples:
 *               invalid_username:
 *                 summary: Nome de usuário inválido
 *                 value:
 *                   success: false
 *                   message: "Dados inválidos fornecidos"
 *                   errors:
 *                     - field: "username"
 *                       message: "Nome de usuário deve conter apenas letras, números e hífens"
 *                   timestamp: "2024-03-15T10:30:00.000Z"
 *       429:
 *         description: ⏰ Limite de rate da API do GitHub atingido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               rate_limit:
 *                 summary: Rate limit atingido
 *                 value:
 *                   success: false
 *                   message: "Limite de requisições da API do GitHub atingido. Tente novamente em alguns minutos."
 *                   timestamp: "2024-03-15T10:30:00.000Z"
 *       500:
 *         $ref: '#/components/responses/500'
 */
// GitHub integration routes
router.get(
  '/:id/github/:username',
  validateParams.github,
  projectController.getProjectGithubRepos
);

// Clear GitHub cache route
router.delete(
  '/:id/github-cache',
  validateParams.id,
  projectController.clearProjectGithubCache
);

/**
 * @swagger
 * /api/projects/{id}/github/repositories:
 *   post:
 *     summary: 📤 Criar repositório GitHub manualmente no projeto
 *     description: |
 *       Permite adicionar um repositório GitHub manualmente ao projeto.
 *       
 *       ### Funcionalidades:
 *       - Criação manual de repositório GitHub
 *       - Associação automática ao projeto especificado
 *       - Validação de dados obrigatórios
 *       - Verificação de duplicatas por githubId
 *       
 *       ### Campos Obrigatórios:
 *       - `githubId`: ID único do repositório no GitHub
 *       - `name`: Nome do repositório
 *       - `fullName`: Nome completo (user/repo)
 *       - `htmlUrl`: URL para visualizar no GitHub
 *       - `cloneUrl`: URL para clonar o repositório
 *       - `username`: Nome do usuário/organização
 *       
 *       ### Exemplo cURL:
 *       ```bash
 *       curl -X POST http://localhost:3000/api/projects/1/github/repositories \\
 *         -H "Content-Type: application/json" \\
 *         -d '{
 *           "githubId": 123456789,
 *           "name": "my-awesome-repo",
 *           "fullName": "myuser/my-awesome-repo",
 *           "description": "Meu repositório incrível",
 *           "htmlUrl": "https://github.com/myuser/my-awesome-repo",
 *           "cloneUrl": "https://github.com/myuser/my-awesome-repo.git",
 *           "language": "TypeScript",
 *           "stargazersCount": 150,
 *           "forksCount": 25,
 *           "private": false,
 *           "username": "myuser"
 *         }'
 *       ```
 *     tags: [GitHub Integration]
 *     parameters:
 *       - $ref: '#/components/parameters/ProjectIdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - githubId
 *               - name
 *               - fullName
 *               - htmlUrl
 *               - cloneUrl
 *               - username
 *             properties:
 *               githubId:
 *                 type: integer
 *                 description: ID único do repositório no GitHub
 *                 example: 123456789
 *               name:
 *                 type: string
 *                 description: Nome do repositório
 *                 example: "my-awesome-repo"
 *               fullName:
 *                 type: string
 *                 description: Nome completo (usuário/repositório)
 *                 example: "myuser/my-awesome-repo"
 *               description:
 *                 type: string
 *                 nullable: true
 *                 description: Descrição do repositório
 *                 example: "Meu repositório incrível"
 *               htmlUrl:
 *                 type: string
 *                 format: uri
 *                 description: URL para visualizar no GitHub
 *                 example: "https://github.com/myuser/my-awesome-repo"
 *               cloneUrl:
 *                 type: string
 *                 format: uri
 *                 description: URL para clonar o repositório
 *                 example: "https://github.com/myuser/my-awesome-repo.git"
 *               language:
 *                 type: string
 *                 nullable: true
 *                 description: Linguagem principal do repositório
 *                 example: "TypeScript"
 *               stargazersCount:
 *                 type: integer
 *                 minimum: 0
 *                 description: Número de estrelas
 *                 example: 150
 *                 default: 0
 *               forksCount:
 *                 type: integer
 *                 minimum: 0
 *                 description: Número de forks
 *                 example: 25
 *                 default: 0
 *               private:
 *                 type: boolean
 *                 description: Se o repositório é privado
 *                 example: false
 *                 default: false
 *               username:
 *                 type: string
 *                 description: Nome do usuário/organização
 *                 example: "myuser"
 *               githubCreatedAt:
 *                 type: string
 *                 format: date-time
 *                 description: Data de criação no GitHub
 *                 example: "2024-01-15T10:30:00Z"
 *               githubUpdatedAt:
 *                 type: string
 *                 format: date-time
 *                 description: Data da última atualização no GitHub
 *                 example: "2024-03-10T14:20:00Z"
 *           examples:
 *             typescript_repo:
 *               summary: Repositório TypeScript
 *               value:
 *                 githubId: 987654321
 *                 name: "awesome-typescript-app"
 *                 fullName: "developer/awesome-typescript-app"
 *                 description: "Aplicação incrível em TypeScript"
 *                 htmlUrl: "https://github.com/developer/awesome-typescript-app"
 *                 cloneUrl: "https://github.com/developer/awesome-typescript-app.git"
 *                 language: "TypeScript"
 *                 stargazersCount: 342
 *                 forksCount: 67
 *                 private: false
 *                 username: "developer"
 *                 githubCreatedAt: "2024-01-15T10:30:00Z"
 *                 githubUpdatedAt: "2024-03-10T14:20:00Z"
 *             javascript_repo:
 *               summary: Repositório JavaScript
 *               value:
 *                 githubId: 456789123
 *                 name: "react-components-lib"
 *                 fullName: "myorg/react-components-lib"
 *                 description: "Biblioteca de componentes React"
 *                 htmlUrl: "https://github.com/myorg/react-components-lib"
 *                 cloneUrl: "https://github.com/myorg/react-components-lib.git"
 *                 language: "JavaScript"
 *                 stargazersCount: 128
 *                 forksCount: 34
 *                 private: false
 *                 username: "myorg"
 *     responses:
 *       201:
 *         description: ✅ Repositório criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/GitHubRepo'
 *             examples:
 *               created_repo:
 *                 summary: Repositório criado
 *                 value:
 *                   success: true
 *                   message: "Repositório GitHub criado com sucesso"
 *                   data:
 *                     id: 15
 *                     githubId: 987654321
 *                     name: "awesome-typescript-app"
 *                     fullName: "developer/awesome-typescript-app"
 *                     description: "Aplicação incrível em TypeScript"
 *                     htmlUrl: "https://github.com/developer/awesome-typescript-app"
 *                     cloneUrl: "https://github.com/developer/awesome-typescript-app.git"
 *                     language: "TypeScript"
 *                     stargazersCount: 342
 *                     forksCount: 67
 *                     private: false
 *                     username: "developer"
 *                     projectId: 1
 *                     githubCreatedAt: "2024-01-15T10:30:00.000Z"
 *                     githubUpdatedAt: "2024-03-10T14:20:00.000Z"
 *                     createdAt: "2024-03-15T15:30:00.000Z"
 *                     updatedAt: "2024-03-15T15:30:00.000Z"
 *                   timestamp: "2024-03-15T15:30:00.000Z"
 *       400:
 *         description: ❌ Dados inválidos fornecidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *             examples:
 *               missing_required:
 *                 summary: Campos obrigatórios ausentes
 *                 value:
 *                   success: false
 *                   message: "Dados inválidos fornecidos"
 *                   errors:
 *                     - field: "githubId"
 *                       message: "githubId é obrigatório"
 *                     - field: "name"
 *                       message: "name é obrigatório"
 *                   timestamp: "2024-03-15T15:30:00.000Z"
 *               invalid_data:
 *                 summary: Dados inválidos
 *                 value:
 *                   success: false
 *                   message: "Dados inválidos fornecidos"
 *                   errors:
 *                     - field: "githubId"
 *                       message: "githubId deve ser um número inteiro positivo"
 *                     - field: "stargazersCount"
 *                       message: "stargazersCount deve ser um número não negativo"
 *                   timestamp: "2024-03-15T15:30:00.000Z"
 *       404:
 *         description: 🔍 Projeto não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFoundError'
 *             examples:
 *               project_not_found:
 *                 summary: Projeto não encontrado
 *                 value:
 *                   success: false
 *                   message: "Projeto com ID 999 não encontrado"
 *                   timestamp: "2024-03-15T15:30:00.000Z"
 *       409:
 *         description: ⚠️ Repositório já existe
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               duplicate_repo:
 *                 summary: Repositório duplicado
 *                 value:
 *                   success: false
 *                   message: "Repositório com githubId 987654321 já existe neste projeto"
 *                   timestamp: "2024-03-15T15:30:00.000Z"
 *       500:
 *         $ref: '#/components/responses/500'
 */
// Add GitHub repository manually
router.post(
  '/:id/github/repositories',
  validateParams.id,
  validateGitHub.createRepo,
  projectController.createProjectGithubRepo
);

export default router;


