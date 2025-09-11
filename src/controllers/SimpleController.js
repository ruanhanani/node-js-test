"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimpleController = void 0;
const Project_1 = require("@models/Project");
const Task_1 = require("@models/Task");
const GitHubRepo_1 = require("@models/GitHubRepo");
/**
 * Simple controller for testing API without complex features
 * No caching, no complex queries - just basic CRUD
 */
class SimpleController {
    /**
     * GET /api/simple/projects - Get all projects (simple)
     */
    async getProjects(req, res) {
        try {
            const projects = await Project_1.Project.findAll({
                order: [['createdAt', 'DESC']]
            });
            res.status(200).json({
                success: true,
                message: 'Projects retrieved successfully',
                data: projects,
                count: projects.length,
                timestamp: new Date().toISOString(),
            });
        }
        catch (error) {
            console.error('Error fetching projects:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch projects',
                error: error.message,
                timestamp: new Date().toISOString(),
            });
        }
    }
    /**
     * GET /api/simple/projects/:id - Get project by ID (simple)
     */
    async getProjectById(req, res) {
        try {
            const { id } = req.params;
            const project = await Project_1.Project.findByPk(parseInt(id));
            if (!project) {
                res.status(404).json({
                    success: false,
                    message: `Project with ID ${id} not found`,
                    timestamp: new Date().toISOString(),
                });
                return;
            }
            res.status(200).json({
                success: true,
                message: 'Project retrieved successfully',
                data: project,
                timestamp: new Date().toISOString(),
            });
        }
        catch (error) {
            console.error('Error fetching project:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch project',
                error: error.message,
                timestamp: new Date().toISOString(),
            });
        }
    }
    /**
     * POST /api/simple/projects - Create new project (simple)
     */
    async createProject(req, res) {
        try {
            const { name, description, status = 'active' } = req.body;
            if (!name) {
                res.status(400).json({
                    success: false,
                    message: 'Project name is required',
                    timestamp: new Date().toISOString(),
                });
                return;
            }
            const project = await Project_1.Project.create({
                name: name.trim(),
                description: description?.trim() || null,
                status,
            });
            res.status(201).json({
                success: true,
                message: 'Project created successfully',
                data: project,
                timestamp: new Date().toISOString(),
            });
        }
        catch (error) {
            console.error('Error creating project:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to create project',
                error: error.message,
                timestamp: new Date().toISOString(),
            });
        }
    }
    /**
     * GET /api/simple/tasks - Get all tasks (simple)
     */
    async getTasks(req, res) {
        try {
            const tasks = await Task_1.Task.findAll({
                order: [['createdAt', 'DESC']]
            });
            res.status(200).json({
                success: true,
                message: 'Tasks retrieved successfully',
                data: tasks,
                count: tasks.length,
                timestamp: new Date().toISOString(),
            });
        }
        catch (error) {
            console.error('Error fetching tasks:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch tasks',
                error: error.message,
                timestamp: new Date().toISOString(),
            });
        }
    }
    /**
     * POST /api/simple/tasks - Create new task (simple)
     */
    async createTask(req, res) {
        try {
            const { title, description, status = 'pending', priority = 'medium', projectId } = req.body;
            if (!title) {
                res.status(400).json({
                    success: false,
                    message: 'Task title is required',
                    timestamp: new Date().toISOString(),
                });
                return;
            }
            // Check if project exists if projectId is provided
            if (projectId) {
                const project = await Project_1.Project.findByPk(projectId);
                if (!project) {
                    res.status(400).json({
                        success: false,
                        message: `Project with ID ${projectId} not found`,
                        timestamp: new Date().toISOString(),
                    });
                    return;
                }
            }
            const task = await Task_1.Task.create({
                title: title.trim(),
                description: description?.trim() || null,
                status,
                priority,
                projectId: projectId || null,
            });
            res.status(201).json({
                success: true,
                message: 'Task created successfully',
                data: task,
                timestamp: new Date().toISOString(),
            });
        }
        catch (error) {
            console.error('Error creating task:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to create task',
                error: error.message,
                timestamp: new Date().toISOString(),
            });
        }
    }
    /**
     * GET /api/simple/repos - Get all GitHub repos (simple)
     */
    async getGitHubRepos(req, res) {
        try {
            const repos = await GitHubRepo_1.GitHubRepo.findAll({
                order: [['createdAt', 'DESC']]
            });
            res.status(200).json({
                success: true,
                message: 'GitHub repositories retrieved successfully',
                data: repos,
                count: repos.length,
                timestamp: new Date().toISOString(),
            });
        }
        catch (error) {
            console.error('Error fetching GitHub repos:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch GitHub repositories',
                error: error.message,
                timestamp: new Date().toISOString(),
            });
        }
    }
    /**
     * GET /api/simple/projects/:id/with-relations - Get project with tasks and repos
     */
    async getProjectWithRelations(req, res) {
        try {
            const { id } = req.params;
            const project = await Project_1.Project.findByPk(parseInt(id), {
                include: [
                    {
                        model: Task_1.Task,
                        as: 'tasks',
                    },
                    {
                        model: GitHubRepo_1.GitHubRepo,
                        as: 'githubRepos',
                    },
                ],
            });
            if (!project) {
                res.status(404).json({
                    success: false,
                    message: `Project with ID ${id} not found`,
                    timestamp: new Date().toISOString(),
                });
                return;
            }
            res.status(200).json({
                success: true,
                message: 'Project with relations retrieved successfully',
                data: project,
                timestamp: new Date().toISOString(),
            });
        }
        catch (error) {
            console.error('Error fetching project with relations:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch project with relations',
                error: error.message,
                timestamp: new Date().toISOString(),
            });
        }
    }
    /**
     * GET /api/simple/health - Health check endpoint
     */
    async healthCheck(req, res) {
        try {
            // Test database connection by counting projects
            const projectCount = await Project_1.Project.count();
            const taskCount = await Task_1.Task.count();
            const repoCount = await GitHubRepo_1.GitHubRepo.count();
            res.status(200).json({
                success: true,
                message: 'API is healthy',
                data: {
                    status: 'healthy',
                    database: 'connected',
                    counts: {
                        projects: projectCount,
                        tasks: taskCount,
                        githubRepos: repoCount,
                    },
                },
                timestamp: new Date().toISOString(),
            });
        }
        catch (error) {
            console.error('Health check failed:', error);
            res.status(500).json({
                success: false,
                message: 'API health check failed',
                error: error.message,
                timestamp: new Date().toISOString(),
            });
        }
    }
}
exports.SimpleController = SimpleController;
//# sourceMappingURL=SimpleController.js.map