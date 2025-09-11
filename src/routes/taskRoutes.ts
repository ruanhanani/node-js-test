import { Router } from 'express';
import { TaskController } from '@controllers/TaskController';
import { validateTask, validateParams } from '@middlewares/validation';

const router = Router();
const taskController = new TaskController();

/**
 * @swagger
 * /api/tasks:
 *   get:
 *     summary: 📋 Listar todas as tarefas
 *     description: |
 *       Retorna uma lista paginada de tarefas com filtros avançados.
 *       
 *       ### Filtros Disponíveis:
 *       - **Status**: `pending`, `in_progress`, `completed`, `cancelled`
 *       - **Prioridade**: `low`, `medium`, `high`, `critical`
 *       - **Projeto**: Filtrar por ID do projeto
 *       - **Data de Vencimento**: Intervalo de datas
 *       - **Busca**: Por título ou descrição
 *       
 *       ### Casos de Uso Comuns:
 *       ```bash
 *       # Tarefas pendentes de alta prioridade
 *       GET /api/tasks?status=pending&priority=high
 *       
 *       # Tarefas de um projeto específico
 *       GET /api/tasks?projectId=1
 *       
 *       # Tarefas vencidas (implementar filtro dueDate)
 *       GET /api/tasks?dueBefore=2024-03-15
 *       
 *       # Buscar tarefas por palavra-chave
 *       GET /api/tasks?search=autenticação
 *       ```
 *       
 *       ### Ordenação:
 *       Por padrão, retorna ordenado por prioridade (crítica primeiro) e data de vencimento.
 *     tags: [Tasks CRUD]
 *     parameters:
 *       - $ref: '#/components/parameters/PageParam'
 *       - $ref: '#/components/parameters/LimitParam'
 *       - $ref: '#/components/parameters/StatusParam'
 *       - $ref: '#/components/parameters/PriorityParam'
 *       - $ref: '#/components/parameters/ProjectFilterParam'
 *       - name: search
 *         in: query
 *         description: 🔍 Buscar por título ou descrição
 *         required: false
 *         schema:
 *           type: string
 *           example: autenticação
 *       - name: dueBefore
 *         in: query
 *         description: ⏰ Tarefas com vencimento antes desta data
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *           example: 2024-12-31
 *       - name: dueAfter
 *         in: query
 *         description: 📅 Tarefas com vencimento após esta data
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *           example: 2024-01-01
 *     responses:
 *       200:
 *         description: ✅ Lista de tarefas recuperada com sucesso
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
 *                         $ref: '#/components/schemas/Task'
 *             examples:
 *               success:
 *                 summary: Lista de tarefas
 *                 value:
 *                   success: true
 *                   message: "Tarefas recuperadas com sucesso"
 *                   data:
 *                     - id: 1
 *                       title: "Configurar ambiente de desenvolvimento"
 *                       description: "Instalar e configurar Node.js, React, MySQL e ferramentas necessárias"
 *                       status: "completed"
 *                       priority: "high"
 *                       dueDate: "2024-01-20"
 *                       projectId: 1
 *                       createdAt: "2024-01-15T10:30:00.000Z"
 *                       updatedAt: "2024-01-18T16:00:00.000Z"
 *                     - id: 2
 *                       title: "Desenvolver sistema de autenticação"
 *                       description: "Implementar login, registro e recuperação de senha usando JWT"
 *                       status: "in_progress"
 *                       priority: "high"
 *                       dueDate: "2024-03-15"
 *                       projectId: 1
 *                       createdAt: "2024-01-18T09:00:00.000Z"
 *                       updatedAt: "2024-02-10T16:45:00.000Z"
 *                   pagination:
 *                     page: 1
 *                     limit: 10
 *                     total: 19
 *                     pages: 2
 *                     hasNext: true
 *                     hasPrev: false
 *                   timestamp: "2024-03-15T10:30:00.000Z"
 *               filtered:
 *                 summary: Tarefas filtradas por prioridade
 *                 value:
 *                   success: true
 *                   message: "Tarefas recuperadas com sucesso"
 *                   data:
 *                     - id: 5
 *                       title: "Integração com gateway de pagamento"
 *                       description: "Conectar com Stripe/PayPal para processar pagamentos"
 *                       status: "pending"
 *                       priority: "high"
 *                       dueDate: "2024-03-10"
 *                       projectId: 1
 *                       createdAt: "2024-02-05T15:45:00.000Z"
 *                       updatedAt: "2024-02-05T15:45:00.000Z"
 *                   pagination:
 *                     page: 1
 *                     limit: 10
 *                     total: 6
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
  // validateTask.query, // Temporarily disabled
  taskController.getTasks
);

/**
 * @swagger
 * /api/tasks:
 *   post:
 *     summary: 🆕 Criar nova tarefa
 *     description: |
 *       Cria uma nova tarefa no sistema.
 *       
 *       ### Campos Obrigatórios:
 *       - **title**: Título da tarefa (2-255 caracteres)
 *       - **projectId**: ID do projeto associado
 *       
 *       ### Campos Opcionais:
 *       - **description**: Descrição detalhada
 *       - **status**: Status inicial (padrão: `pending`)
 *       - **priority**: Prioridade (padrão: `medium`)
 *       - **dueDate**: Data de vencimento
 *       
 *       ### Validações:
 *       - Título deve ter entre 2 e 255 caracteres
 *       - Status deve ser: `pending`, `in_progress`, `completed`, `cancelled`
 *       - Prioridade deve ser: `low`, `medium`, `high`, `critical`
 *       - Data deve estar no formato YYYY-MM-DD
 *       - Projeto deve existir
 *       
 *       ### Exemplo cURL:
 *       ```bash
 *       curl -X POST http://localhost:3000/api/tasks \\
 *         -H "Content-Type: application/json" \\
 *         -d '{
 *           "title": "Implementar autenticação JWT",
 *           "description": "Sistema completo de login com tokens",
 *           "status": "pending",
 *           "priority": "high",
 *           "dueDate": "2024-06-15",
 *           "projectId": 1
 *         }'
 *       ```
 *     tags: [Tasks CRUD]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TaskInput'
 *           examples:
 *             complete:
 *               summary: Tarefa completa
 *               value:
 *                 title: "Desenvolver dashboard administrativo"
 *                 description: "Interface completa para gestão de usuários e relatórios"
 *                 status: "pending"
 *                 priority: "high"
 *                 dueDate: "2024-07-01"
 *                 projectId: 1
 *             minimal:
 *               summary: Tarefa mínima (apenas título e projeto)
 *               value:
 *                 title: "Corrigir bug na validação"
 *                 projectId: 1
 *             urgent:
 *               summary: Tarefa urgente
 *               value:
 *                 title: "Corrigir falha de segurança crítica"
 *                 description: "Vulnerabilidade detectada no sistema de autenticação"
 *                 status: "pending"
 *                 priority: "critical"
 *                 dueDate: "2024-04-20"
 *                 projectId: 2
 *     responses:
 *       201:
 *         description: ✅ Tarefa criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Task'
 *             examples:
 *               created:
 *                 summary: Tarefa criada com sucesso
 *                 value:
 *                   success: true
 *                   message: "Tarefa criada com sucesso"
 *                   data:
 *                     id: 20
 *                     title: "Implementar autenticação JWT"
 *                     description: "Sistema completo de login com tokens"
 *                     status: "pending"
 *                     priority: "high"
 *                     dueDate: "2024-06-15"
 *                     projectId: 1
 *                     createdAt: "2024-03-15T18:30:00.000Z"
 *                     updatedAt: "2024-03-15T18:30:00.000Z"
 *                   timestamp: "2024-03-15T18:30:00.000Z"
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *             examples:
 *               validation_error:
 *                 summary: Erros de validação
 *                 value:
 *                   success: false
 *                   message: "Dados inválidos fornecidos"
 *                   errors:
 *                     - field: "title"
 *                       message: "Título é obrigatório"
 *                     - field: "projectId"
 *                       message: "ID do projeto é obrigatório"
 *                   timestamp: "2024-03-15T18:30:00.000Z"
 *               project_not_found:
 *                 summary: Projeto não encontrado
 *                 value:
 *                   success: false
 *                   message: "Projeto com ID 999 não encontrado"
 *                   timestamp: "2024-03-15T18:30:00.000Z"
 *       500:
 *         $ref: '#/components/responses/500'
 */
router.post(
  '/',
  validateTask.create,
  taskController.createTaskDirect
);

/**
 * @swagger
 * /api/tasks/{id}:
 *   get:
 *     summary: Get task by ID
 *     description: |
 *       Retrieves complete details of a specific task.
 *       
 *       ### Information Returned:
 *       - Complete task data with project association
 *       - Priority and status information
 *       - Due dates and timeline
 *       - Creation and update timestamps
 *       
 *       ### Use Cases:
 *       - View task details before editing
 *       - Check task progress and status
 *       - Integrate with other systems
 *       
 *       ### Example cURL:
 *       ```bash
 *       curl -X GET http://localhost:3000/api/tasks/1 \\
 *         -H "Content-Type: application/json"
 *       ```
 *     tags: [Tasks CRUD]
 *     parameters:
 *       - $ref: '#/components/parameters/TaskIdParam'
 *     responses:
 *       200:
 *         description: Task found successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Task'
 *             examples:
 *               task_found:
 *                 summary: Task found
 *                 value:
 *                   success: true
 *                   message: "Task found successfully"
 *                   data:
 *                     id: 1
 *                     title: "Configurar ambiente de desenvolvimento"
 *                     description: "Instalar e configurar Node.js, React, MySQL e ferramentas necessarias"
 *                     status: "completed"
 *                     priority: "high"
 *                     dueDate: "2024-01-20"
 *                     projectId: 1
 *                     createdAt: "2024-01-15T10:30:00.000Z"
 *                     updatedAt: "2024-01-18T16:00:00.000Z"
 *                   timestamp: "2024-03-15T16:00:00.000Z"
 *       404:
 *         description: Task not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFoundError'
 *             examples:
 *               not_found:
 *                 summary: Task not found
 *                 value:
 *                   success: false
 *                   message: "Task with ID 999 not found"
 *                   timestamp: "2024-03-15T16:00:00.000Z"
 *       400:
 *         description: Invalid ID provided
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *             examples:
 *               invalid_id:
 *                 summary: Invalid task ID
 *                 value:
 *                   success: false
 *                   message: "Invalid data provided"
 *                   errors:
 *                     - field: "id"
 *                       message: "ID must be a positive integer"
 *                   timestamp: "2024-03-15T16:00:00.000Z"
 *       500:
 *         $ref: '#/components/responses/500'
 */
router.get(
  '/:id',
  validateParams.id,
  taskController.getTaskById
);

/**
 * @swagger
 * /api/tasks/{id}:
 *   put:
 *     summary: Update an existing task
 *     description: |
 *       Updates an existing task with new information.
 *       
 *       ### Updateable Fields:
 *       - **title**: Task title (2-255 characters)
 *       - **description**: Detailed description
 *       - **status**: Task status (pending, in_progress, completed, cancelled)
 *       - **priority**: Task priority (low, medium, high, critical)
 *       - **dueDate**: Due date (YYYY-MM-DD format)
 *       - **projectId**: Associated project ID
 *       
 *       ### Common Use Cases:
 *       - Update task status as work progresses
 *       - Change priority based on business needs
 *       - Extend or modify due dates
 *       - Transfer tasks between projects
 *       
 *       ### Example cURL:
 *       ```bash
 *       curl -X PUT http://localhost:3000/api/tasks/1 \\
 *         -H "Content-Type: application/json" \\
 *         -d '{
 *           "status": "completed",
 *           "priority": "high"
 *         }'
 *       ```
 *     tags: [Tasks CRUD]
 *     parameters:
 *       - $ref: '#/components/parameters/TaskIdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TaskInput'
 *           examples:
 *             status_update:
 *               summary: Update task status
 *               value:
 *                 status: "completed"
 *             priority_change:
 *               summary: Change priority
 *               value:
 *                 priority: "critical"
 *                 dueDate: "2024-03-20"
 *             full_update:
 *               summary: Complete task update
 *               value:
 *                 title: "Enhanced Authentication System"
 *                 description: "Implement OAuth2 and multi-factor authentication"
 *                 status: "in_progress"
 *                 priority: "high"
 *                 dueDate: "2024-05-15"
 *             project_transfer:
 *               summary: Move task to different project
 *               value:
 *                 projectId: 2
 *     responses:
 *       200:
 *         description: Task updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Task'
 *             examples:
 *               updated:
 *                 summary: Task successfully updated
 *                 value:
 *                   success: true
 *                   message: "Task updated successfully"
 *                   data:
 *                     id: 1
 *                     title: "Enhanced Authentication System"
 *                     description: "Implement OAuth2 and multi-factor authentication"
 *                     status: "in_progress"
 *                     priority: "high"
 *                     dueDate: "2024-05-15"
 *                     projectId: 1
 *                     createdAt: "2024-01-15T10:30:00.000Z"
 *                     updatedAt: "2024-03-15T16:30:00.000Z"
 *                   timestamp: "2024-03-15T16:30:00.000Z"
 *       404:
 *         description: Task not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFoundError'
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
 *                     - field: "status"
 *                       message: "Status must be: pending, in_progress, completed, or cancelled"
 *                     - field: "priority"
 *                       message: "Priority must be: low, medium, high, or critical"
 *                   timestamp: "2024-03-15T16:30:00.000Z"
 *       500:
 *         $ref: '#/components/responses/500'
 */
router.put(
  '/:id',
  validateParams.id,
  validateTask.update,
  taskController.updateTask
);

/**
 * @swagger
 * /api/tasks/{id}:
 *   delete:
 *     summary: Delete a task
 *     description: |
 *       Permanently deletes a task from the system.
 *       
 *       ### Warning:
 *       This action is irreversible. The task will be completely removed
 *       from the database along with all its data.
 *       
 *       ### Common Use Cases:
 *       - Remove duplicate or erroneous tasks
 *       - Clean up completed tasks that are no longer needed
 *       - Remove cancelled tasks from the system
 *       
 *       ### Example cURL:
 *       ```bash
 *       curl -X DELETE http://localhost:3000/api/tasks/1 \\
 *         -H "Content-Type: application/json"
 *       ```
 *     tags: [Tasks CRUD]
 *     parameters:
 *       - $ref: '#/components/parameters/TaskIdParam'
 *     responses:
 *       200:
 *         description: Task deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DeleteResponse'
 *             examples:
 *               deleted:
 *                 summary: Task successfully deleted
 *                 value:
 *                   success: true
 *                   message: "Task deleted successfully"
 *                   timestamp: "2024-03-15T17:00:00.000Z"
 *       404:
 *         description: Task not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFoundError'
 *             examples:
 *               not_found:
 *                 summary: Task not found
 *                 value:
 *                   success: false
 *                   message: "Task with ID 999 not found"
 *                   timestamp: "2024-03-15T17:00:00.000Z"
 *       400:
 *         description: Invalid ID provided
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *             examples:
 *               invalid_id:
 *                 summary: Invalid task ID
 *                 value:
 *                   success: false
 *                   message: "Invalid data provided"
 *                   errors:
 *                     - field: "id"
 *                       message: "ID must be a positive integer"
 *                   timestamp: "2024-03-15T17:00:00.000Z"
 *       500:
 *         $ref: '#/components/responses/500'
 */
router.delete(
  '/:id',
  validateParams.id,
  taskController.deleteTask
);

/**
 * @swagger
 * /api/tasks/{id}/complete:
 *   patch:
 *     summary: Mark task as completed
 *     description: |
 *       Quickly marks a task as completed without requiring a full update.
 *       
 *       ### What it does:
 *       - Sets task status to "completed"
 *       - Updates the timestamp
 *       - Maintains all other task data
 *       
 *       ### Use Cases:
 *       - Quick task completion from task lists
 *       - Bulk completion operations
 *       - Mobile app quick actions
 *       
 *       ### Example cURL:
 *       ```bash
 *       curl -X PATCH http://localhost:3000/api/tasks/1/complete \\
 *         -H "Content-Type: application/json"
 *       ```
 *     tags: [Tasks CRUD]
 *     parameters:
 *       - $ref: '#/components/parameters/TaskIdParam'
 *     responses:
 *       200:
 *         description: Task marked as completed
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Task'
 *             examples:
 *               completed:
 *                 summary: Task marked as completed
 *                 value:
 *                   success: true
 *                   message: "Task marked as completed"
 *                   data:
 *                     id: 1
 *                     title: "Implement authentication"
 *                     description: "Add JWT-based authentication system"
 *                     status: "completed"
 *                     priority: "high"
 *                     dueDate: "2024-03-15"
 *                     projectId: 1
 *                     createdAt: "2024-01-15T10:30:00.000Z"
 *                     updatedAt: "2024-03-15T17:15:00.000Z"
 *                   timestamp: "2024-03-15T17:15:00.000Z"
 *       404:
 *         description: Task not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFoundError'
 *       400:
 *         description: Task already completed or invalid ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *             examples:
 *               already_completed:
 *                 summary: Task already completed
 *                 value:
 *                   success: false
 *                   message: "Task is already completed"
 *                   timestamp: "2024-03-15T17:15:00.000Z"
 *       500:
 *         $ref: '#/components/responses/500'
 */
// Task action routes
router.patch(
  '/:id/complete',
  validateParams.id,
  taskController.completeTask
);

router.patch(
  '/:id/start',
  validateParams.id,
  taskController.startTask
);

router.patch(
  '/:id/cancel',
  validateParams.id,
  taskController.cancelTask
);

export default router;

