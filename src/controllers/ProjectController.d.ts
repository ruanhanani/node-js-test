export declare class ProjectController {
    private projectService;
    private githubService;
    constructor();
    /**
     * @route   GET /api/projects
     * @desc    Get all projects with filters and pagination
     * @access  Public
     */
    getProjects: any;
    /**
     * @route   GET /api/projects/:id
     * @desc    Get project by ID with tasks and GitHub repos
     * @access  Public
     */
    getProjectById: any;
    /**
     * @route   POST /api/projects
     * @desc    Create a new project
     * @access  Public
     */
    createProject: any;
    /**
     * @route   PUT /api/projects/:id
     * @desc    Update a project
     * @access  Public
     */
    updateProject: any;
    /**
     * @route   DELETE /api/projects/:id
     * @desc    Delete a project
     * @access  Public
     */
    deleteProject: any;
    /**
     * @route   GET /api/projects/:id/github/:username
     * @desc    Get GitHub repositories for a project and user
     * @access  Public
     */
    getProjectGithubRepos: any;
    /**
     * @route   GET /api/projects/:id/tasks
     * @desc    Get all tasks for a specific project
     * @access  Public
     */
    getProjectTasks: any;
    /**
     * @route   GET /api/projects/stats
     * @desc    Get project statistics
     * @access  Public
     */
    getProjectStats: any;
    /**
     * @route   GET /api/projects/search
     * @desc    Search projects by name or description
     * @access  Public
     */
    searchProjects: any;
    /**
     * @route   GET /api/projects/active
     * @desc    Get active projects
     * @access  Public
     */
    getActiveProjects: any;
    /**
     * @route   GET /api/projects/date-range
     * @desc    Get projects by date range
     * @access  Public
     */
    getProjectsByDateRange: any;
    /**
     * @route   GET /api/projects/:id/github-stats
     * @desc    Get GitHub repository statistics for a project
     * @access  Public
     */
    getProjectGithubStats: any;
    /**
     * @route   DELETE /api/projects/:id/github-cache
     * @desc    Clear GitHub cache for a project
     * @access  Public
     */
    clearProjectGithubCache: any;
}
//# sourceMappingURL=ProjectController.d.ts.map