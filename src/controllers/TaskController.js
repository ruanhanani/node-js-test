"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskController = void 0;
const TaskService_1 = require("@services/TaskService");
const errorHandler_1 = require("@middlewares/errorHandler");
class TaskController {
    constructor() {
        /**
         * @route   GET /api/tasks
         * @desc    Get all tasks with filters and pagination
         * @access  Public
         */
        this.getTasks = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            const { page, limit, status, priority, projectId, overdue, dueInDays, search } = req.query;
            const filters = {};
            if (status)
                filters.status = status;
            if (priority)
                filters.priority = priority;
            if (projectId)
                filters.projectId = parseInt(projectId);
            if (overdue === 'true')
                filters.overdue = true;
            if (dueInDays)
                filters.dueInDays = parseInt(dueInDays);
            const result = await this.taskService.getTasks(filters, page, limit);
            res.status(200).json({
                success: true,
                message: 'Tarefas recuperadas com sucesso',
                data: result.tasks,
                pagination: result.pagination,
                meta: {
                    filters,
                },
                timestamp: new Date().toISOString(),
            });
        });
        /**
         * @route   GET /api/tasks/:id
         * @desc    Get task by ID
         * @access  Public
         */
        this.getTaskById = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            const { id } = req.params;
            const task = await this.taskService.getTaskById(parseInt(id));
            res.status(200).json({
                success: true,
                message: 'Tarefa recuperada com sucesso',
                data: task,
                timestamp: new Date().toISOString(),
            });
        });
        /**
         * @route   POST /api/projects/:projectId/tasks
         * @desc    Create a new task for a project
         * @access  Public
         */
        this.createTask = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            const { projectId } = req.params;
            const taskData = {
                ...req.body,
                projectId: parseInt(projectId),
            };
            const task = await this.taskService.createTask(taskData);
            res.status(201).json({
                success: true,
                message: 'Tarefa criada com sucesso',
                data: task,
                timestamp: new Date().toISOString(),
            });
        });
        /**
         * @route   PUT /api/tasks/:id
         * @desc    Update a task
         * @access  Public
         */
        this.updateTask = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            const { id } = req.params;
            const updateData = req.body;
            const task = await this.taskService.updateTask(parseInt(id), updateData);
            res.status(200).json({
                success: true,
                message: 'Tarefa atualizada com sucesso',
                data: task,
                timestamp: new Date().toISOString(),
            });
        });
        /**
         * @route   DELETE /api/tasks/:id
         * @desc    Delete a task
         * @access  Public
         */
        this.deleteTask = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            const { id } = req.params;
            await this.taskService.deleteTask(parseInt(id));
            res.status(200).json({
                success: true,
                message: 'Tarefa removida com sucesso',
                timestamp: new Date().toISOString(),
            });
        });
        /**
         * @route   GET /api/tasks/stats
         * @desc    Get task statistics
         * @access  Public
         */
        this.getTaskStats = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            const { projectId } = req.query;
            const stats = await this.taskService.getTaskStats(projectId ? parseInt(projectId) : undefined);
            res.status(200).json({
                success: true,
                message: 'Estatísticas das tarefas recuperadas com sucesso',
                data: stats,
                meta: {
                    projectId: projectId ? parseInt(projectId) : null,
                },
                timestamp: new Date().toISOString(),
            });
        });
        /**
         * @route   GET /api/tasks/search
         * @desc    Search tasks by title or description
         * @access  Public
         */
        this.searchTasks = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            const { q: query, projectId } = req.query;
            if (!query) {
                throw new errorHandler_1.BadRequestError('Parâmetro de busca "q" é obrigatório');
            }
            const tasks = await this.taskService.searchTasks(query, projectId ? parseInt(projectId) : undefined);
            res.status(200).json({
                success: true,
                message: 'Busca realizada com sucesso',
                data: tasks,
                meta: {
                    query,
                    projectId: projectId ? parseInt(projectId) : null,
                    totalResults: tasks.length,
                },
                timestamp: new Date().toISOString(),
            });
        });
        /**
         * @route   GET /api/tasks/overdue
         * @desc    Get overdue tasks
         * @access  Public
         */
        this.getOverdueTasks = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            const tasks = await this.taskService.getOverdueTasks();
            res.status(200).json({
                success: true,
                message: 'Tarefas em atraso recuperadas com sucesso',
                data: tasks,
                meta: {
                    totalOverdueTasks: tasks.length,
                },
                timestamp: new Date().toISOString(),
            });
        });
        /**
         * @route   GET /api/tasks/due-in/:days
         * @desc    Get tasks due in specific number of days
         * @access  Public
         */
        this.getTasksDueIn = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            const { days } = req.params;
            const daysNumber = parseInt(days);
            if (isNaN(daysNumber) || daysNumber < 0) {
                throw new errorHandler_1.BadRequestError('Dias deve ser um número positivo');
            }
            const tasks = await this.taskService.getTasksDueIn(daysNumber);
            res.status(200).json({
                success: true,
                message: `Tarefas com vencimento em ${daysNumber} dias recuperadas com sucesso`,
                data: tasks,
                meta: {
                    daysAhead: daysNumber,
                    totalTasks: tasks.length,
                },
                timestamp: new Date().toISOString(),
            });
        });
        /**
         * @route   PATCH /api/tasks/:id/complete
         * @desc    Mark task as completed
         * @access  Public
         */
        this.completeTask = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            const { id } = req.params;
            const task = await this.taskService.completeTask(parseInt(id));
            res.status(200).json({
                success: true,
                message: 'Tarefa marcada como concluída',
                data: task,
                timestamp: new Date().toISOString(),
            });
        });
        /**
         * @route   PATCH /api/tasks/:id/start
         * @desc    Mark task as in progress
         * @access  Public
         */
        this.startTask = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            const { id } = req.params;
            const task = await this.taskService.startTask(parseInt(id));
            res.status(200).json({
                success: true,
                message: 'Tarefa marcada como em progresso',
                data: task,
                timestamp: new Date().toISOString(),
            });
        });
        /**
         * @route   PATCH /api/tasks/:id/cancel
         * @desc    Cancel task
         * @access  Public
         */
        this.cancelTask = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            const { id } = req.params;
            const task = await this.taskService.cancelTask(parseInt(id));
            res.status(200).json({
                success: true,
                message: 'Tarefa cancelada com sucesso',
                data: task,
                timestamp: new Date().toISOString(),
            });
        });
        /**
         * @route   GET /api/tasks/by-status/:status
         * @desc    Get tasks by status
         * @access  Public
         */
        this.getTasksByStatus = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            const { status } = req.params;
            const { page = 1, limit = 10 } = req.query;
            const validStatuses = ['pending', 'in_progress', 'completed', 'cancelled'];
            if (!validStatuses.includes(status)) {
                throw new errorHandler_1.BadRequestError(`Status deve ser um de: ${validStatuses.join(', ')}`);
            }
            const result = await this.taskService.getTasks({ status: status }, parseInt(page), parseInt(limit));
            res.status(200).json({
                success: true,
                message: `Tarefas com status '${status}' recuperadas com sucesso`,
                data: result.tasks,
                pagination: result.pagination,
                meta: {
                    status,
                },
                timestamp: new Date().toISOString(),
            });
        });
        /**
         * @route   GET /api/tasks/by-priority/:priority
         * @desc    Get tasks by priority
         * @access  Public
         */
        this.getTasksByPriority = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            const { priority } = req.params;
            const { page = 1, limit = 10 } = req.query;
            const validPriorities = ['low', 'medium', 'high', 'critical'];
            if (!validPriorities.includes(priority)) {
                throw new errorHandler_1.BadRequestError(`Prioridade deve ser uma de: ${validPriorities.join(', ')}`);
            }
            const result = await this.taskService.getTasks({ priority: priority }, parseInt(page), parseInt(limit));
            res.status(200).json({
                success: true,
                message: `Tarefas com prioridade '${priority}' recuperadas com sucesso`,
                data: result.tasks,
                pagination: result.pagination,
                meta: {
                    priority,
                },
                timestamp: new Date().toISOString(),
            });
        });
        this.taskService = new TaskService_1.TaskService();
    }
}
exports.TaskController = TaskController;
//# sourceMappingURL=TaskController.js.map