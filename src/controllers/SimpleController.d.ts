import { Request, Response } from 'express';
/**
 * Simple controller for testing API without complex features
 * No caching, no complex queries - just basic CRUD
 */
export declare class SimpleController {
    /**
     * GET /api/simple/projects - Get all projects (simple)
     */
    getProjects(req: Request, res: Response): Promise<void>;
    /**
     * GET /api/simple/projects/:id - Get project by ID (simple)
     */
    getProjectById(req: Request, res: Response): Promise<void>;
    /**
     * POST /api/simple/projects - Create new project (simple)
     */
    createProject(req: Request, res: Response): Promise<void>;
    /**
     * GET /api/simple/tasks - Get all tasks (simple)
     */
    getTasks(req: Request, res: Response): Promise<void>;
    /**
     * POST /api/simple/tasks - Create new task (simple)
     */
    createTask(req: Request, res: Response): Promise<void>;
    /**
     * GET /api/simple/repos - Get all GitHub repos (simple)
     */
    getGitHubRepos(req: Request, res: Response): Promise<void>;
    /**
     * GET /api/simple/projects/:id/with-relations - Get project with tasks and repos
     */
    getProjectWithRelations(req: Request, res: Response): Promise<void>;
    /**
     * GET /api/simple/health - Health check endpoint
     */
    healthCheck(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=SimpleController.d.ts.map