"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ProjectController_1 = require("@controllers/ProjectController");
const validation_1 = require("@middlewares/validation");
const router = (0, express_1.Router)();
const projectController = new ProjectController_1.ProjectController();
// Main project routes
router.get('/', validation_1.validateProject.query, projectController.getProjects);
router.get('/stats', projectController.getProjectStats);
router.get('/search', projectController.searchProjects);
router.get('/active', projectController.getActiveProjects);
router.get('/date-range', projectController.getProjectsByDateRange);
router.post('/', validation_1.validateProject.create, projectController.createProject);
router.get('/:id', validation_1.validateParams.id, projectController.getProjectById);
router.put('/:id', validation_1.validateParams.id, validation_1.validateProject.update, projectController.updateProject);
router.delete('/:id', validation_1.validateParams.id, projectController.deleteProject);
// Project tasks routes
router.get('/:id/tasks', validation_1.validateParams.id, projectController.getProjectTasks);
// GitHub integration routes
router.get('/:id/github/:username', validation_1.validateParams.github, projectController.getProjectGithubRepos);
router.get('/:id/github-stats', validation_1.validateParams.id, projectController.getProjectGithubStats);
router.delete('/:id/github-cache', validation_1.validateParams.id, projectController.clearProjectGithubCache);
exports.default = router;
//# sourceMappingURL=projectRoutes.js.map