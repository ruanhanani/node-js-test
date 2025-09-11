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
   * ULTRA-SIMPLE DEBUG ENDPOINT - No asyncHandler
   */
  debugGetProjects = (req: Request, res: Response): void => {
    console.log('🚈 ULTRA-SIMPLE DEBUG called');
    res.status(200).json({
      success: true,
      message: 'Ultra-simple debug endpoint works',
      query: req.query,
      debug: true
    });
  };
  
  /**
   * DATABASE DEBUG ENDPOINT - Direct model access
   */
  debugDatabase = async (req: Request, res: Response): Promise<void> => {
    console.log('💾 DATABASE DEBUG called');
    try {
      const Project = require('@models/Project').Project;
      const count = await Project.count();
      console.log('📊 Found projects count:', count);
      
      res.status(200).json({
        success: true,
        message: 'Database debug successful',
        count,
        debug: true
      });
    } catch (error) {
      console.error('❌ DATABASE DEBUG ERROR:', error);
      res.status(500).json({ 
        success: false, 
        error: error instanceof Error ? error.message : String(error), 
        stack: error instanceof Error ? error.stack : undefined,
        debug: true 
      });
    }
  };

  /**
   * @route   GET /api/projects
   * @desc    Get all projects with filters and pagination
   * @access  Public
   */
  getProjects = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    console.log('🔎 ProjectController.getProjects called with query:', req.query);
    
    const { page, limit, status, search, startDate, endDate } = req.query as any;
    
    const filters: any = {};
    if (status) filters.status = status;
    if (search) filters.search = search;
    if (startDate) filters.startDate = new Date(startDate);
    if (endDate) filters.endDate = new Date(endDate);

    const pageNum = page ? parseInt(page) : 1;
    const limitNum = limit ? parseInt(limit) : 10;

    console.log('📊 Calling projectService.getProjects with:', { filters, pageNum, limitNum });
    
    try {
      const result = await this.projectService.getProjects(filters, pageNum, limitNum);
      console.log('✅ ProjectService returned:', { 
        projectsCount: result.projects.length, 
        pagination: result.pagination 
      });

      res.status(200).json({
        success: true,
        message: 'Projetos recuperados com sucesso',
        data: result.projects,
        pagination: result.pagination,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('❌ Error in ProjectController.getProjects:', error);
      throw error;
    }
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

  flushAllCache = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    await this.githubService.flushAllCache();

    res.status(200).json({
      success: true,
      message: 'Todo o cache foi limpo com sucesso',
      timestamp: new Date().toISOString(),
    });
  });

  /**
   * @route   GET /api/projects/test-github/:username
   * @desc    Direct test of GitHub API without cache or database
   * @access  Public
   */
  testGitHubAPI = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { username } = req.params;

    try {
      console.log(`🧪 [TestAPI] Direct GitHub API test for username: ${username}`);
      
      // Direct axios call to GitHub API
      const axios = require('axios');
      
      const response = await axios.get(`https://api.github.com/users/${username}/repos`, {
        params: {
          per_page: 5,
          sort: 'updated',
          direction: 'desc',
          type: 'public',
        },
        timeout: 15000,
        headers: {
          'User-Agent': 'Node.js-Test-API/1.0',
          'Accept': 'application/vnd.github.v3+json',
        },
      });

      console.log(`✅ [TestAPI] Success! Status: ${response.status}, Repos: ${response.data.length}`);
      
      const repos = response.data.map((repo: any) => ({
        name: repo.name,
        full_name: repo.full_name,
        description: repo.description,
        language: repo.language,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        url: repo.html_url,
      }));

      res.status(200).json({
        success: true,
        message: `Teste direto da API do GitHub para ${username} realizado com sucesso`,
        data: {
          username,
          repositories: repos,
          total: repos.length,
          rateLimit: {
            limit: response.headers['x-ratelimit-limit'],
            remaining: response.headers['x-ratelimit-remaining'],
            reset: new Date(parseInt(response.headers['x-ratelimit-reset']) * 1000).toISOString(),
          },
        },
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      console.error(`❌ [TestAPI] Error:`, error.message);
      
      res.status(500).json({
        success: false,
        message: 'Erro no teste da API do GitHub',
        error: {
          message: error.message,
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
        },
        timestamp: new Date().toISOString(),
      });
    }
  });

  /**
   * @route   POST /api/projects/:id/github/repositories
   * @desc    Create a GitHub repository manually for a project
   * @access  Public
   */
  createProjectGithubRepo = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const repoData = req.body;

    // Validate required fields
    const requiredFields = ['githubId', 'name', 'fullName', 'htmlUrl', 'cloneUrl', 'username'];
    const missingFields = requiredFields.filter(field => !repoData[field]);
    
    if (missingFields.length > 0) {
      throw new BadRequestError(
        `Campos obrigatórios ausentes: ${missingFields.join(', ')}`
      );
    }

    // Validate githubId is a positive integer
    if (!Number.isInteger(repoData.githubId) || repoData.githubId <= 0) {
      throw new BadRequestError('githubId deve ser um número inteiro positivo');
    }

    // Validate star and fork counts are non-negative
    if (repoData.stargazersCount && repoData.stargazersCount < 0) {
      throw new BadRequestError('stargazersCount deve ser um número não negativo');
    }
    if (repoData.forksCount && repoData.forksCount < 0) {
      throw new BadRequestError('forksCount deve ser um número não negativo');
    }

    // Set default values
    const repositoryData = {
      ...repoData,
      stargazersCount: repoData.stargazersCount || 0,
      forksCount: repoData.forksCount || 0,
      private: repoData.private || false,
      projectId: parseInt(id),
      githubCreatedAt: repoData.githubCreatedAt ? new Date(repoData.githubCreatedAt) : new Date(),
      githubUpdatedAt: repoData.githubUpdatedAt ? new Date(repoData.githubUpdatedAt) : new Date(),
    };

    const repository = await this.githubService.createRepository(
      parseInt(id),
      repositoryData
    );

    res.status(201).json({
      success: true,
      message: 'Repositório GitHub criado com sucesso',
      data: repository,
      timestamp: new Date().toISOString(),
    });
  });
}
