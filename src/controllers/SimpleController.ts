import { Request, Response } from 'express';
import { Project } from '@models/Project';
import { Task } from '@models/Task';
import { GitHubRepo } from '@models/GitHubRepo';

/**
 * Simple controller for testing API without complex features
 * No caching, no complex queries - just basic CRUD
 */
export class SimpleController {

  /**
   * GET /api/simple/projects - Get all projects (simple)
   */
  async getProjects(req: Request, res: Response): Promise<void> {
    try {
      const projects = await Project.findAll({
        order: [['createdAt', 'DESC']]
      });

      res.status(200).json({
        success: true,
        message: 'Projects retrieved successfully',
        data: projects,
        count: projects.length,
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
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
  async getProjectById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const project = await Project.findByPk(parseInt(id));

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
    } catch (error: any) {
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
  async createProject(req: Request, res: Response): Promise<void> {
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

      const project = await Project.create({
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
    } catch (error: any) {
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
  async getTasks(req: Request, res: Response): Promise<void> {
    try {
      const tasks = await Task.findAll({
        order: [['createdAt', 'DESC']]
      });

      res.status(200).json({
        success: true,
        message: 'Tasks retrieved successfully',
        data: tasks,
        count: tasks.length,
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
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
  async createTask(req: Request, res: Response): Promise<void> {
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
        const project = await Project.findByPk(projectId);
        if (!project) {
          res.status(400).json({
            success: false,
            message: `Project with ID ${projectId} not found`,
            timestamp: new Date().toISOString(),
          });
          return;
        }
      }

      const task = await Task.create({
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
    } catch (error: any) {
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
  async getGitHubRepos(req: Request, res: Response): Promise<void> {
    try {
      const repos = await GitHubRepo.findAll({
        order: [['createdAt', 'DESC']]
      });

      res.status(200).json({
        success: true,
        message: 'GitHub repositories retrieved successfully',
        data: repos,
        count: repos.length,
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
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
  async getProjectWithRelations(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const project = await Project.findByPk(parseInt(id), {
        include: [
          {
            model: Task,
            as: 'tasks',
          },
          {
            model: GitHubRepo,
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
    } catch (error: any) {
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
  async healthCheck(req: Request, res: Response): Promise<void> {
    try {
      // Test database connection by counting projects
      const projectCount = await Project.count();
      const taskCount = await Task.count();
      const repoCount = await GitHubRepo.count();

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
    } catch (error: any) {
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
