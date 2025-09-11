"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectController = void 0;
const ProjectService_1 = require("@services/ProjectService");
const GitHubService_1 = require("@services/GitHubService");
const errorHandler_1 = require("@middlewares/errorHandler");
class ProjectController {
    constructor() {
        /**
         * @route   GET /api/projects
         * @desc    Get all projects with filters and pagination
         * @access  Public
         */
        this.getProjects = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            const { page, limit, status, search, startDate, endDate } = req.query;
            const filters = {};
            if (status)
                filters.status = status;
            if (search)
                filters.search = search;
            if (startDate)
                filters.startDate = new Date(startDate);
            if (endDate)
                filters.endDate = new Date(endDate);
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
        this.getProjectById = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            const { id } = req.params;
            const includeRelations = req.query.include !== 'false';
            const project = await this.projectService.getProjectById(parseInt(id), includeRelations);
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
        this.createProject = (0, errorHandler_1.asyncHandler)(async (req, res) => {
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
        this.updateProject = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            const { id } = req.params;
            const updateData = req.body;
            const project = await this.projectService.updateProject(parseInt(id), updateData);
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
        this.deleteProject = (0, errorHandler_1.asyncHandler)(async (req, res) => {
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
        this.getProjectGithubRepos = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            const { id, username } = req.params;
            const result = await this.githubService.getUserRepositories(parseInt(id), username);
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
        this.getProjectTasks = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            const { id } = req.params;
            const { status, priority, overdue } = req.query;
            const filters = {};
            if (status)
                filters.status = status;
            if (priority)
                filters.priority = priority;
            if (overdue === 'true')
                filters.overdue = true;
            // Import TaskService here to avoid circular dependency
            const { TaskService } = await Promise.resolve().then(() => __importStar(require('@services/TaskService')));
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
        this.getProjectStats = (0, errorHandler_1.asyncHandler)(async (req, res) => {
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
        this.searchProjects = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            const { q: query } = req.query;
            if (!query) {
                throw new errorHandler_1.BadRequestError('Parâmetro de busca "q" é obrigatório');
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
        this.getActiveProjects = (0, errorHandler_1.asyncHandler)(async (req, res) => {
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
        this.getProjectsByDateRange = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            const { startDate, endDate } = req.query;
            if (!startDate || !endDate) {
                throw new errorHandler_1.BadRequestError('startDate e endDate são obrigatórios');
            }
            const projects = await this.projectService.getProjectsByDateRange(new Date(startDate), new Date(endDate));
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
        this.getProjectGithubStats = (0, errorHandler_1.asyncHandler)(async (req, res) => {
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
        this.clearProjectGithubCache = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            const { id } = req.params;
            const { username } = req.query;
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
        this.projectService = new ProjectService_1.ProjectService();
        this.githubService = new GitHubService_1.GitHubService();
    }
}
exports.ProjectController = ProjectController;
//# sourceMappingURL=ProjectController.js.map