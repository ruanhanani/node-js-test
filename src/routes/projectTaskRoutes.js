"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const TaskController_1 = require("@controllers/TaskController");
const validation_1 = require("@middlewares/validation");
const router = (0, express_1.Router)();
const taskController = new TaskController_1.TaskController();
// Route for creating tasks under projects: POST /api/projects/:projectId/tasks
router.post('/:projectId/tasks', validation_1.validateParams.projectId, validation_1.validateTask.create, taskController.createTask);
exports.default = router;
//# sourceMappingURL=projectTaskRoutes.js.map