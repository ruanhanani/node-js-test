export declare class TaskController {
    private taskService;
    constructor();
    /**
     * @route   GET /api/tasks
     * @desc    Get all tasks with filters and pagination
     * @access  Public
     */
    getTasks: any;
    /**
     * @route   GET /api/tasks/:id
     * @desc    Get task by ID
     * @access  Public
     */
    getTaskById: any;
    /**
     * @route   POST /api/projects/:projectId/tasks
     * @desc    Create a new task for a project
     * @access  Public
     */
    createTask: any;
    /**
     * @route   PUT /api/tasks/:id
     * @desc    Update a task
     * @access  Public
     */
    updateTask: any;
    /**
     * @route   DELETE /api/tasks/:id
     * @desc    Delete a task
     * @access  Public
     */
    deleteTask: any;
    /**
     * @route   GET /api/tasks/stats
     * @desc    Get task statistics
     * @access  Public
     */
    getTaskStats: any;
    /**
     * @route   GET /api/tasks/search
     * @desc    Search tasks by title or description
     * @access  Public
     */
    searchTasks: any;
    /**
     * @route   GET /api/tasks/overdue
     * @desc    Get overdue tasks
     * @access  Public
     */
    getOverdueTasks: any;
    /**
     * @route   GET /api/tasks/due-in/:days
     * @desc    Get tasks due in specific number of days
     * @access  Public
     */
    getTasksDueIn: any;
    /**
     * @route   PATCH /api/tasks/:id/complete
     * @desc    Mark task as completed
     * @access  Public
     */
    completeTask: any;
    /**
     * @route   PATCH /api/tasks/:id/start
     * @desc    Mark task as in progress
     * @access  Public
     */
    startTask: any;
    /**
     * @route   PATCH /api/tasks/:id/cancel
     * @desc    Cancel task
     * @access  Public
     */
    cancelTask: any;
    /**
     * @route   GET /api/tasks/by-status/:status
     * @desc    Get tasks by status
     * @access  Public
     */
    getTasksByStatus: any;
    /**
     * @route   GET /api/tasks/by-priority/:priority
     * @desc    Get tasks by priority
     * @access  Public
     */
    getTasksByPriority: any;
}
//# sourceMappingURL=TaskController.d.ts.map