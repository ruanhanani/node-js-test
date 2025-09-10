import { Router } from 'express';
import { TaskController } from '@controllers/TaskController';
import { validateTask, validateParams } from '@middlewares/validation';

const router = Router();
const taskController = new TaskController();

// Main task routes
router.get(
  '/',
  validateTask.query,
  taskController.getTasks
);

router.get(
  '/stats',
  taskController.getTaskStats
);

router.get(
  '/search',
  taskController.searchTasks
);

router.get(
  '/overdue',
  taskController.getOverdueTasks
);

router.get(
  '/due-in/:days',
  taskController.getTasksDueIn
);

router.get(
  '/by-status/:status',
  taskController.getTasksByStatus
);

router.get(
  '/by-priority/:priority',
  taskController.getTasksByPriority
);

router.get(
  '/:id',
  validateParams.id,
  taskController.getTaskById
);

router.put(
  '/:id',
  validateParams.id,
  validateTask.update,
  taskController.updateTask
);

router.delete(
  '/:id',
  validateParams.id,
  taskController.deleteTask
);

// Task action routes
router.patch(
  '/:id/complete',
  validateParams.id,
  taskController.completeTask
);

router.patch(
  '/:id/start',
  validateParams.id,
  taskController.startTask
);

router.patch(
  '/:id/cancel',
  validateParams.id,
  taskController.cancelTask
);

export default router;
