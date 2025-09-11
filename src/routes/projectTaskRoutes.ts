import { Router } from 'express';
import { TaskController } from '@controllers/TaskController';
import { validateTask, validateParams } from '@middlewares/validation';

const router = Router();
const taskController = new TaskController();

/**
 * @swagger
 * /api/projects/{projectId}/tasks:
 *   post:
 *     summary: ➕ Criar nova tarefa em um projeto
 *     description: |
 *       Cria uma nova tarefa associada a um projeto específico.
 *       
 *       ### Campos Obrigatórios:
 *       - **title**: Título da tarefa (2-255 caracteres)
 *       - **projectId**: ID do projeto (via URL)
 *       
 *       ### Campos Opcionais:
 *       - **description**: Descrição detalhada
 *       - **status**: Status inicial (padrão: `pending`)
 *       - **priority**: Prioridade (padrão: `medium`)
 *       - **dueDate**: Data de vencimento
 *       
 *       ### Status Disponíveis:
 *       - `pending` - Pendente (padrão)
 *       - `in_progress` - Em andamento
 *       - `completed` - Concluída
 *       - `cancelled` - Cancelada
 *       
 *       ### Prioridades Disponíveis:
 *       - `low` - Baixa
 *       - `medium` - Média (padrão)
 *       - `high` - Alta
 *       - `critical` - Crítica
 *       
 *       ### Exemplo cURL:
 *       ```bash
 *       curl -X POST http://localhost:3000/api/projects/1/tasks \\
 *         -H "Content-Type: application/json" \\
 *         -d '{
 *           "title": "Implementar autenticação de usuário",
 *           "description": "Desenvolver sistema de login com JWT e recuperação de senha",
 *           "priority": "high",
 *           "dueDate": "2024-05-01"
 *         }'
 *       ```
 *     tags: [Tasks CRUD]
 *     parameters:
 *       - name: projectId
 *         in: path
 *         description: 🆔 ID do projeto onde criar a tarefa
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TaskInput'
 *           examples:
 *             high_priority:
 *               summary: Tarefa de alta prioridade
 *               value:
 *                 title: "Integrar sistema de pagamentos"
 *                 description: "Implementar integração com Stripe para processar pagamentos seguros"
 *                 priority: "high"
 *                 dueDate: "2024-04-15"
 *             simple_task:
 *               summary: Tarefa simples
 *               value:
 *                 title: "Revisar documentação da API"
 *             critical_bug:
 *               summary: Bug crítico
 *               value:
 *                 title: "Corrigir vazamento de memória"
 *                 description: "Investigar e corrigir vazamento de memória no módulo de cache"
 *                 status: "in_progress"
 *                 priority: "critical"
 *                 dueDate: "2024-03-20"
 *             feature_request:
 *               summary: Nova funcionalidade
 *               value:
 *                 title: "Adicionar filtros avançados"
 *                 description: "Implementar filtros por data, categoria e tags na listagem de produtos"
 *                 priority: "medium"
 *                 dueDate: "2024-06-30"
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
 *               task_created:
 *                 summary: Tarefa recém-criada
 *                 value:
 *                   success: true
 *                   message: "Tarefa criada com sucesso"
 *                   data:
 *                     id: 20
 *                     title: "Implementar autenticação de usuário"
 *                     description: "Desenvolver sistema de login com JWT e recuperação de senha"
 *                     status: "pending"
 *                     priority: "high"
 *                     dueDate: "2024-05-01"
 *                     projectId: 1
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
 *               validation_errors:
 *                 summary: Múltiplos erros de validação
 *                 value:
 *                   success: false
 *                   message: "Dados inválidos fornecidos"
 *                   errors:
 *                     - field: "title"
 *                       message: "Título é obrigatório e deve ter pelo menos 2 caracteres"
 *                     - field: "priority"
 *                       message: "Prioridade deve ser: low, medium, high ou critical"
 *                     - field: "dueDate"
 *                       message: "Data deve estar no formato YYYY-MM-DD"
 *                   timestamp: "2024-03-15T10:30:00.000Z"
 *               missing_title:
 *                 summary: Título ausente
 *                 value:
 *                   success: false
 *                   message: "Dados inválidos fornecidos"
 *                   errors:
 *                     - field: "title"
 *                       message: "Título da tarefa é obrigatório"
 *                   timestamp: "2024-03-15T10:30:00.000Z"
 *       404:
 *         description: 🔍 Projeto não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFoundError'
 *             examples:
 *               project_not_found:
 *                 summary: Projeto inexistente
 *                 value:
 *                   success: false
 *                   message: "Projeto com ID 999 não encontrado"
 *                   timestamp: "2024-03-15T10:30:00.000Z"
 *       500:
 *         $ref: '#/components/responses/500'
 */
// Route for creating tasks under projects: POST /api/projects/:projectId/tasks
router.post(
  '/:projectId/tasks',
  validateParams.projectId,
  validateTask.createViaProject,
  taskController.createTask
);

export default router;
