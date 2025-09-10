import { Router } from 'express';
import { TaskController } from '@controllers/TaskController';
import { validateTask, validateParams } from '@middlewares/validation';

const router = Router();
const taskController = new TaskController();

// Route for creating tasks under projects: POST /api/projects/:projectId/tasks
router.post(
  '/:projectId/tasks',
  validateParams.projectId,
  validateTask.create,
  taskController.createTask
);

export default router;
