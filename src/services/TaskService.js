"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskService = void 0;
const TaskRepository_1 = require("@repositories/TaskRepository");
const ProjectRepository_1 = require("@repositories/ProjectRepository");
const cache_mock_1 = require("@utils/cache-mock");
class TaskService {
    constructor() {
        this.taskRepository = new TaskRepository_1.TaskRepository();
        this.projectRepository = new ProjectRepository_1.ProjectRepository();
    }
    /**
     * Create a new task
     */
    async createTask(data) {
        await this.validateTaskData(data);
        const task = await this.taskRepository.create(data);
        // Invalidate cache
        await cache_mock_1.cacheManager.invalidateTaskCache(task.id, data.projectId);
        return await this.getTaskById(task.id);
    }
    /**
     * Get all tasks with optional filters and caching
     */
    async getTasks(filters, page = 1, limit = 10) {
        const cacheKey = cache_mock_1.cacheManager.generateKey('tasks', JSON.stringify(filters || {}), page, limit);
        return await cache_mock_1.cacheManager.getOrSet(cacheKey, async () => {
            const offset = (page - 1) * limit;
            let tasks;
            let total;
            if (filters?.overdue) {
                tasks = await this.taskRepository.findOverdueTasks();
                total = tasks.length;
                tasks = tasks.slice(offset, offset + limit);
            }
            else if (filters?.dueInDays) {
                tasks = await this.taskRepository.findTasksDueIn(filters.dueInDays);
                total = tasks.length;
                tasks = tasks.slice(offset, offset + limit);
            }
            else if (filters?.projectId) {
                tasks = await this.taskRepository.findTasksForProject(filters.projectId, {
                    status: filters.status,
                    priority: filters.priority,
                    overdue: filters.overdue,
                });
                total = tasks.length;
                tasks = tasks.slice(offset, offset + limit);
            }
            else if (filters?.status) {
                tasks = await this.taskRepository.findByStatus(filters.status);
                total = tasks.length;
                tasks = tasks.slice(offset, offset + limit);
            }
            else if (filters?.priority) {
                tasks = await this.taskRepository.findByPriority(filters.priority);
                total = tasks.length;
                tasks = tasks.slice(offset, offset + limit);
            }
            else {
                const result = await this.taskRepository.findAllWithProject(undefined, limit, offset);
                tasks = result.rows;
                total = result.count;
            }
            return {
                tasks: tasks.map(t => t.toJSON()),
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit),
                },
            };
        }, 300 // 5 minutes TTL
        );
    }
    /**
     * Get task by ID
     */
    async getTaskById(id) {
        const cacheKey = cache_mock_1.cacheManager.generateKey('task', id);
        return await cache_mock_1.cacheManager.getOrSet(cacheKey, async () => {
            const task = await this.taskRepository.findWithProject(id);
            if (!task) {
                throw new Error(`Task with ID ${id} not found`);
            }
            return task.toJSON();
        }, 300 // 5 minutes TTL
        );
    }
    /**
     * Update task
     */
    async updateTask(id, data) {
        const existingTask = await this.taskRepository.findById(id);
        if (!existingTask) {
            throw new Error(`Task with ID ${id} not found`);
        }
        this.validateTaskUpdateData(data);
        const [affectedRows] = await this.taskRepository.update(id, data);
        if (affectedRows === 0) {
            throw new Error(`Failed to update task with ID ${id}`);
        }
        // Invalidate cache
        await cache_mock_1.cacheManager.invalidateTaskCache(id, existingTask.projectId);
        return await this.getTaskById(id);
    }
    /**
     * Delete task
     */
    async deleteTask(id) {
        const task = await this.taskRepository.findById(id);
        if (!task) {
            throw new Error(`Task with ID ${id} not found`);
        }
        await this.taskRepository.delete(id);
        // Invalidate cache
        await cache_mock_1.cacheManager.invalidateTaskCache(id, task.projectId);
    }
    /**
     * Get tasks for a specific project
     */
    async getTasksByProjectId(projectId, filters) {
        // Verify project exists
        const project = await this.projectRepository.findById(projectId);
        if (!project) {
            throw new Error(`Project with ID ${projectId} not found`);
        }
        const cacheKey = cache_mock_1.cacheManager.generateKey('project', projectId, 'tasks', JSON.stringify(filters || {}));
        return await cache_mock_1.cacheManager.getOrSet(cacheKey, async () => {
            const tasks = await this.taskRepository.findTasksForProject(projectId, {
                status: filters?.status,
                priority: filters?.priority,
                overdue: filters?.overdue,
            });
            return tasks.map(t => t.toJSON());
        }, 300 // 5 minutes TTL
        );
    }
    /**
     * Get task statistics
     */
    async getTaskStats(projectId) {
        const cacheKey = cache_mock_1.cacheManager.generateKey('task_stats', projectId || 'all');
        return await cache_mock_1.cacheManager.getOrSet(cacheKey, async () => {
            const [statusCounts, priorityCounts, overdueTasks, recentTasks] = await Promise.all([
                this.taskRepository.countByStatus(projectId),
                this.taskRepository.countByPriority(projectId),
                this.taskRepository.findOverdueTasks(),
                this.taskRepository.findAll({
                    where: projectId ? { projectId } : undefined,
                    limit: 5,
                    order: [['createdAt', 'DESC']],
                    include: [{
                            model: this.taskRepository['model'].associations.project.target,
                            as: 'project',
                            attributes: ['id', 'name', 'status'],
                        }],
                }),
            ]);
            const filteredOverdue = projectId
                ? overdueTasks.filter(task => task.projectId === projectId)
                : overdueTasks;
            const totalTasks = Object.values(statusCounts).reduce((sum, count) => sum + count, 0);
            return {
                totalTasks,
                statusCounts,
                priorityCounts,
                overdueTasks: filteredOverdue.length,
                recentTasks: recentTasks.map(t => t.toJSON()),
            };
        }, 300 // 5 minutes TTL
        );
    }
    /**
     * Search tasks by title or description
     */
    async searchTasks(query, projectId) {
        if (!query || query.trim().length < 2) {
            throw new Error('Search query must be at least 2 characters long');
        }
        const tasks = await this.taskRepository.search(query.trim(), projectId);
        return tasks.map(t => t.toJSON());
    }
    /**
     * Get overdue tasks
     */
    async getOverdueTasks() {
        const cacheKey = cache_mock_1.cacheManager.generateKey('overdue_tasks');
        return await cache_mock_1.cacheManager.getOrSet(cacheKey, async () => {
            const tasks = await this.taskRepository.findOverdueTasks();
            return tasks.map(t => t.toJSON());
        }, 300 // 5 minutes TTL
        );
    }
    /**
     * Get tasks due in specific number of days
     */
    async getTasksDueIn(days) {
        if (days < 0) {
            throw new Error('Days must be a positive number');
        }
        const cacheKey = cache_mock_1.cacheManager.generateKey('tasks_due_in', days);
        return await cache_mock_1.cacheManager.getOrSet(cacheKey, async () => {
            const tasks = await this.taskRepository.findTasksDueIn(days);
            return tasks.map(t => t.toJSON());
        }, 300 // 5 minutes TTL
        );
    }
    /**
     * Validate task data for creation
     */
    async validateTaskData(data) {
        if (!data.title) {
            throw new Error('Task title is required');
        }
        if (data.title.trim().length < 2) {
            throw new Error('Task title must be at least 2 characters long');
        }
        if (data.title.length > 255) {
            throw new Error('Task title must not exceed 255 characters');
        }
        if (data.description && data.description.length > 5000) {
            throw new Error('Task description must not exceed 5000 characters');
        }
        if (data.status && !['pending', 'in_progress', 'completed', 'cancelled'].includes(data.status)) {
            throw new Error('Task status must be pending, in_progress, completed, or cancelled');
        }
        if (data.priority && !['low', 'medium', 'high', 'critical'].includes(data.priority)) {
            throw new Error('Task priority must be low, medium, high, or critical');
        }
        if (!data.projectId) {
            throw new Error('Project ID is required');
        }
        // Verify project exists
        const project = await this.projectRepository.findById(data.projectId);
        if (!project) {
            throw new Error(`Project with ID ${data.projectId} not found`);
        }
    }
    /**
     * Validate task data for update
     */
    validateTaskUpdateData(data) {
        if (data.title && data.title.trim().length < 2) {
            throw new Error('Task title must be at least 2 characters long');
        }
        if (data.title && data.title.length > 255) {
            throw new Error('Task title must not exceed 255 characters');
        }
        if (data.description && data.description.length > 5000) {
            throw new Error('Task description must not exceed 5000 characters');
        }
        if (data.status && !['pending', 'in_progress', 'completed', 'cancelled'].includes(data.status)) {
            throw new Error('Task status must be pending, in_progress, completed, or cancelled');
        }
        if (data.priority && !['low', 'medium', 'high', 'critical'].includes(data.priority)) {
            throw new Error('Task priority must be low, medium, high, or critical');
        }
    }
    /**
     * Mark task as completed
     */
    async completeTask(id) {
        return await this.updateTask(id, { status: 'completed' });
    }
    /**
     * Mark task as in progress
     */
    async startTask(id) {
        return await this.updateTask(id, { status: 'in_progress' });
    }
    /**
     * Cancel task
     */
    async cancelTask(id) {
        return await this.updateTask(id, { status: 'cancelled' });
    }
}
exports.TaskService = TaskService;
//# sourceMappingURL=TaskService.js.map