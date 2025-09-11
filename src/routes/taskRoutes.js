"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const TaskController_1 = require("@controllers/TaskController");
const validation_1 = require("@middlewares/validation");
const router = (0, express_1.Router)();
const taskController = new TaskController_1.TaskController();
// Main task routes
router.get('/', validation_1.validateTask.query, taskController.getTasks);
router.get('/stats', taskController.getTaskStats);
router.get('/search', taskController.searchTasks);
router.get('/overdue', taskController.getOverdueTasks);
router.get('/due-in/:days', taskController.getTasksDueIn);
router.get('/by-status/:status', taskController.getTasksByStatus);
router.get('/by-priority/:priority', taskController.getTasksByPriority);
router.get('/:id', validation_1.validateParams.id, taskController.getTaskById);
router.put('/:id', validation_1.validateParams.id, validation_1.validateTask.update, taskController.updateTask);
router.delete('/:id', validation_1.validateParams.id, taskController.deleteTask);
// Task action routes
router.patch('/:id/complete', validation_1.validateParams.id, taskController.completeTask);
router.patch('/:id/start', validation_1.validateParams.id, taskController.startTask);
router.patch('/:id/cancel', validation_1.validateParams.id, taskController.cancelTask);
exports.default = router;
//# sourceMappingURL=taskRoutes.js.map