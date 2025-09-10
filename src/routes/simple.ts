import { Router } from 'express';
import { SimpleController } from '@controllers/SimpleController';

const router = Router();
const simpleController = new SimpleController();

/**
 * Simple API routes for testing
 * No complex middleware, caching, or validation
 */

// Health check
router.get('/health', simpleController.healthCheck.bind(simpleController));

// Projects
router.get('/projects', simpleController.getProjects.bind(simpleController));
router.get('/projects/:id', simpleController.getProjectById.bind(simpleController));
router.get('/projects/:id/with-relations', simpleController.getProjectWithRelations.bind(simpleController));
router.post('/projects', simpleController.createProject.bind(simpleController));

// Tasks
router.get('/tasks', simpleController.getTasks.bind(simpleController));
router.post('/tasks', simpleController.createTask.bind(simpleController));

// GitHub Repos
router.get('/repos', simpleController.getGitHubRepos.bind(simpleController));

export { router as simpleRoutes };
