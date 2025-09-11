"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.simpleRoutes = void 0;
const express_1 = require("express");
const SimpleController_1 = require("@controllers/SimpleController");
const router = (0, express_1.Router)();
exports.simpleRoutes = router;
const simpleController = new SimpleController_1.SimpleController();
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
//# sourceMappingURL=simple.js.map