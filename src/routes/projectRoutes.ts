import { Router } from 'express';
import { ProjectController } from '@controllers/ProjectController';
import { validateProject, validateParams } from '@middlewares/validation';

const router = Router();
const projectController = new ProjectController();

// Main project routes
router.get(
  '/',
  validateProject.query,
  projectController.getProjects
);

router.get(
  '/stats',
  projectController.getProjectStats
);

router.get(
  '/search',
  projectController.searchProjects
);

router.get(
  '/active',
  projectController.getActiveProjects
);

router.get(
  '/date-range',
  projectController.getProjectsByDateRange
);

router.post(
  '/',
  validateProject.create,
  projectController.createProject
);

router.get(
  '/:id',
  validateParams.id,
  projectController.getProjectById
);

router.put(
  '/:id',
  validateParams.id,
  validateProject.update,
  projectController.updateProject
);

router.delete(
  '/:id',
  validateParams.id,
  projectController.deleteProject
);

// Project tasks routes
router.get(
  '/:id/tasks',
  validateParams.id,
  projectController.getProjectTasks
);

// GitHub integration routes
router.get(
  '/:id/github/:username',
  validateParams.github,
  projectController.getProjectGithubRepos
);

router.get(
  '/:id/github-stats',
  validateParams.id,
  projectController.getProjectGithubStats
);

router.delete(
  '/:id/github-cache',
  validateParams.id,
  projectController.clearProjectGithubCache
);

export default router;
