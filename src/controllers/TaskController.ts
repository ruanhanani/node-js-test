import { Request, Response } from 'express';
import { TaskService } from '@services/TaskService';
import { asyncHandler, NotFoundError, BadRequestError } from '@middlewares/errorHandler';

export class TaskController {
  private taskService: TaskService;

  constructor() {
    this.taskService = new TaskService();
  }

  /**
   * @route   GET /api/tasks
   * @desc    Get all tasks with filters and pagination
   * @access  Public
   */
  getTasks = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { 
      page, 
      limit, 
      status, 
      priority, 
      projectId, 
      overdue, 
      dueInDays, 
      search 
    } = req.query as any;
    
    const filters: any = {};
    if (status) filters.status = status;
    if (priority) filters.priority = priority;
    if (projectId) filters.projectId = parseInt(projectId);
    if (overdue === 'true') filters.overdue = true;
    if (dueInDays) filters.dueInDays = parseInt(dueInDays);

    const pageNum = page ? parseInt(page) : 1;
    const limitNum = limit ? parseInt(limit) : 10;

    const result = await this.taskService.getTasks(filters, pageNum, limitNum);

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
  getTaskById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
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
   * @route   POST /api/tasks
   * @desc    Create a new task directly
   * @access  Public
   */
  createTaskDirect = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const taskData = req.body;

    const task = await this.taskService.createTask(taskData);

    res.status(201).json({
      success: true,
      message: 'Tarefa criada com sucesso',
      data: task,
      timestamp: new Date().toISOString(),
    });
  });

  /**
   * @route   POST /api/projects/:projectId/tasks
   * @desc    Create a new task for a project
   * @access  Public
   */
  createTask = asyncHandler(async (req: Request, res: Response): Promise<void> => {
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
  updateTask = asyncHandler(async (req: Request, res: Response): Promise<void> => {
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
  deleteTask = asyncHandler(async (req: Request, res: Response): Promise<void> => {
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
  getTaskStats = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { projectId } = req.query as any;

    const stats = await this.taskService.getTaskStats(
      projectId ? parseInt(projectId) : undefined
    );

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
  searchTasks = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { q: query, projectId } = req.query as any;

    if (!query) {
      throw new BadRequestError('Parâmetro de busca "q" é obrigatório');
    }

    const tasks = await this.taskService.searchTasks(
      query,
      projectId ? parseInt(projectId) : undefined
    );

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
  getOverdueTasks = asyncHandler(async (req: Request, res: Response): Promise<void> => {
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
  getTasksDueIn = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { days } = req.params;
    const daysNumber = parseInt(days);

    if (isNaN(daysNumber) || daysNumber < 0) {
      throw new BadRequestError('Dias deve ser um número positivo');
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
  completeTask = asyncHandler(async (req: Request, res: Response): Promise<void> => {
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
  startTask = asyncHandler(async (req: Request, res: Response): Promise<void> => {
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
  cancelTask = asyncHandler(async (req: Request, res: Response): Promise<void> => {
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
  getTasksByStatus = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { status } = req.params;
    const { page = 1, limit = 10 } = req.query as any;

    const validStatuses = ['pending', 'in_progress', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      throw new BadRequestError(`Status deve ser um de: ${validStatuses.join(', ')}`);
    }

    const result = await this.taskService.getTasks(
      { status: status as 'pending' | 'in_progress' | 'completed' | 'cancelled' },
      parseInt(page),
      parseInt(limit)
    );

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
  getTasksByPriority = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { priority } = req.params;
    const { page = 1, limit = 10 } = req.query as any;

    const validPriorities = ['low', 'medium', 'high', 'critical'];
    if (!validPriorities.includes(priority)) {
      throw new BadRequestError(`Prioridade deve ser uma de: ${validPriorities.join(', ')}`);
    }

    const result = await this.taskService.getTasks(
      { priority: priority as 'low' | 'medium' | 'high' | 'critical' },
      parseInt(page),
      parseInt(limit)
    );

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
}
