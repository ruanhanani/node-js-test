import { Request, Response } from 'express';
import { ProjectService } from '@services/ProjectService';
import { GitHubService } from '@services/GitHubService';
import { asyncHandler, NotFoundError, BadRequestError } from '@middlewares/errorHandler';

export class ProjectController {
  private projectService: ProjectService;
  private githubService: GitHubService;

  constructor() {
    this.projectService = new ProjectService();
    this.githubService = new GitHubService();
  }

  /**
   * @route   GET /api/projects
   * @desc    Get all projects with filters and pagination
   * @access  Public
   */
  getProjects = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { page, limit, status, search, startDate, endDate } = req.query as any;
    
    const filters: any = {};
    if (status) filters.status = status;
    if (search) filters.search = search;
    if (startDate) filters.startDate = new Date(startDate);
    if (endDate) filters.endDate = new Date(endDate);

    const result = await this.projectService.getProjects(filters, page, limit);

    res.status(200).json({
      success: true,
      message: 'Projetos recuperados com sucesso',
      data: result.projects,
      pagination: result.pagination,
      timestamp: new Date().toISOString(),
    });
  });

  /**
   * @route   GET /api/projects/:id
   * @desc    Get project by ID with tasks and GitHub repos
   * @access  Public
   */
  getProjectById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const includeRelations = req.query.include !== 'false';

    const project = await this.projectService.getProjectById(
      parseInt(id),
      includeRelations
    );

    res.status(200).json({
      success: true,
      message: 'Projeto recuperado com sucesso',
      data: project,
      timestamp: new Date().toISOString(),
    });
  });

  /**
   * @route   POST /api/projects
   * @desc    Create a new project
   * @access  Public
   */
  createProject = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const projectData = req.body;

    const project = await this.projectService.createProject(projectData);

    res.status(201).json({
      success: true,
      message: 'Projeto criado com sucesso',
      data: project,
      timestamp: new Date().toISOString(),
    });
  });

  /**
   * @route   PUT /api/projects/:id
   * @desc    Update a project
   * @access  Public
   */
  updateProject = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const updateData = req.body;

    const project = await this.projectService.updateProject(
      parseInt(id),
      updateData
    );

    res.status(200).json({
      success: true,
      message: 'Projeto atualizado com sucesso',
      data: project,
      timestamp: new Date().toISOString(),
    });
  });

  /**
   * @route   DELETE /api/projects/:id
   * @desc    Delete a project
   * @access  Public
   */
  deleteProject = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    await this.projectService.deleteProject(parseInt(id));

    res.status(200).json({
      success: true,
      message: 'Projeto removido com sucesso',
      timestamp: new Date().toISOString(),
    });
  });

  /**
   * @route   GET /api/projects/:id/github/:username
   * @desc    Get GitHub repositories for a project and user
   * @access  Public
   */
  getProjectGithubRepos = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id, username } = req.params;

    const result = await this.githubService.getUserRepositories(
      parseInt(id),
      username
    );

    res.status(200).json({
      success: true,
      message: `Repositórios do GitHub para ${username} recuperados com sucesso`,
      data: {
        project: result.project,
        repositories: result.repositories,
        meta: {
          cached: result.cached,
          cacheExpiry: result.cacheExpiry,
          totalRepositories: result.repositories.length,
          fetchedAt: new Date().toISOString(),
        },
      },
      timestamp: new Date().toISOString(),
    });
  });

  /**
   * @route   GET /api/projects/:id/tasks
   * @desc    Get all tasks for a specific project
   * @access  Public
   */
  getProjectTasks = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { status, priority, overdue } = req.query as any;

    const filters: any = {};
    if (status) filters.status = status;
    if (priority) filters.priority = priority;
    if (overdue === 'true') filters.overdue = true;

    // Import TaskService here to avoid circular dependency
    const { TaskService } = await import('@services/TaskService');
    const taskService = new TaskService();

    const tasks = await taskService.getTasksByProjectId(parseInt(id), filters);

    res.status(200).json({
      success: true,
      message: 'Tarefas do projeto recuperadas com sucesso',
      data: tasks,
      meta: {
        projectId: parseInt(id),
        totalTasks: tasks.length,
        filters,
      },
      timestamp: new Date().toISOString(),
    });
  });

  /**
   * @route   GET /api/projects/stats
   * @desc    Get project statistics
   * @access  Public
   */
  getProjectStats = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const stats = await this.projectService.getProjectStats();

    res.status(200).json({
      success: true,
      message: 'Estatísticas dos projetos recuperadas com sucesso',
      data: stats,
      timestamp: new Date().toISOString(),
    });
  });

  /**
   * @route   GET /api/projects/search
   * @desc    Search projects by name or description
   * @access  Public
   */
  searchProjects = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { q: query } = req.query as any;

    if (!query) {
      throw new BadRequestError('Parâmetro de busca "q" é obrigatório');
    }

    const projects = await this.projectService.searchProjects(query);

    res.status(200).json({
      success: true,
      message: 'Busca realizada com sucesso',
      data: projects,
      meta: {
        query,
        totalResults: projects.length,
      },
      timestamp: new Date().toISOString(),
    });
  });

  /**
   * @route   GET /api/projects/active
   * @desc    Get active projects
   * @access  Public
   */
  getActiveProjects = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const projects = await this.projectService.getActiveProjects();

    res.status(200).json({
      success: true,
      message: 'Projetos ativos recuperados com sucesso',
      data: projects,
      meta: {
        totalActiveProjects: projects.length,
      },
      timestamp: new Date().toISOString(),
    });
  });

  /**
   * @route   GET /api/projects/date-range
   * @desc    Get projects by date range
   * @access  Public
   */
  getProjectsByDateRange = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { startDate, endDate } = req.query as any;

    if (!startDate || !endDate) {
      throw new BadRequestError('startDate e endDate são obrigatórios');
    }

    const projects = await this.projectService.getProjectsByDateRange(
      new Date(startDate),
      new Date(endDate)
    );

    res.status(200).json({
      success: true,
      message: 'Projetos no período recuperados com sucesso',
      data: projects,
      meta: {
        dateRange: { startDate, endDate },
        totalProjects: projects.length,
      },
      timestamp: new Date().toISOString(),
    });
  });

  /**
   * @route   GET /api/projects/:id/github-stats
   * @desc    Get GitHub repository statistics for a project
   * @access  Public
   */
  getProjectGithubStats = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    // TODO: Implement getProjectRepositoryStats method in GitHubService
    const stats = { message: 'Method not implemented yet' };

    res.status(200).json({
      success: true,
      message: 'Estatísticas do GitHub recuperadas com sucesso',
      data: stats,
      meta: {
        projectId: parseInt(id),
      },
      timestamp: new Date().toISOString(),
    });
  });

  /**
   * @route   DELETE /api/projects/:id/github-cache
   * @desc    Clear GitHub cache for a project
   * @access  Public
   */
  clearProjectGithubCache = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { username } = req.query as any;

    await this.githubService.clearCache(parseInt(id), username);

    res.status(200).json({
      success: true,
      message: 'Cache do GitHub limpo com sucesso',
      meta: {
        projectId: parseInt(id),
        username: username || 'todos os usuários',
      },
      timestamp: new Date().toISOString(),
    });
  });
}
