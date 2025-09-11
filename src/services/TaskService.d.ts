export interface CreateTaskDTO {
    title: string;
    description?: string;
    status?: 'pending' | 'in_progress' | 'completed' | 'cancelled';
    priority?: 'low' | 'medium' | 'high' | 'critical';
    dueDate?: Date;
    projectId: number;
}
export interface UpdateTaskDTO {
    title?: string;
    description?: string;
    status?: 'pending' | 'in_progress' | 'completed' | 'cancelled';
    priority?: 'low' | 'medium' | 'high' | 'critical';
    dueDate?: Date;
}
export interface TaskFilters {
    status?: 'pending' | 'in_progress' | 'completed' | 'cancelled';
    priority?: 'low' | 'medium' | 'high' | 'critical';
    projectId?: number;
    overdue?: boolean;
    dueInDays?: number;
}
export declare class TaskService {
    private taskRepository;
    private projectRepository;
    constructor();
    /**
     * Create a new task
     */
    createTask(data: CreateTaskDTO): Promise<any>;
    /**
     * Get all tasks with optional filters and caching
     */
    getTasks(filters?: TaskFilters, page?: number, limit?: number): Promise<{
        tasks: any[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    }>;
    /**
     * Get task by ID
     */
    getTaskById(id: number): Promise<any>;
    /**
     * Update task
     */
    updateTask(id: number, data: UpdateTaskDTO): Promise<any>;
    /**
     * Delete task
     */
    deleteTask(id: number): Promise<void>;
    /**
     * Get tasks for a specific project
     */
    getTasksByProjectId(projectId: number, filters?: Omit<TaskFilters, 'projectId'>): Promise<any[]>;
    /**
     * Get task statistics
     */
    getTaskStats(projectId?: number): Promise<{
        totalTasks: number;
        statusCounts: {
            [key: string]: number;
        };
        priorityCounts: {
            [key: string]: number;
        };
        overdueTasks: number;
        recentTasks: any[];
    }>;
    /**
     * Search tasks by title or description
     */
    searchTasks(query: string, projectId?: number): Promise<any[]>;
    /**
     * Get overdue tasks
     */
    getOverdueTasks(): Promise<any[]>;
    /**
     * Get tasks due in specific number of days
     */
    getTasksDueIn(days: number): Promise<any[]>;
    /**
     * Validate task data for creation
     */
    private validateTaskData;
    /**
     * Validate task data for update
     */
    private validateTaskUpdateData;
    /**
     * Mark task as completed
     */
    completeTask(id: number): Promise<any>;
    /**
     * Mark task as in progress
     */
    startTask(id: number): Promise<any>;
    /**
     * Cancel task
     */
    cancelTask(id: number): Promise<any>;
}
//# sourceMappingURL=TaskService.d.ts.map