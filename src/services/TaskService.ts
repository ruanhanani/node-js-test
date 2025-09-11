import { TaskRepository } from '@repositories/TaskRepository';
import { ProjectRepository } from '@repositories/ProjectRepository';
import { cacheManager } from '@utils/cache-mock';

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

export class TaskService {
  private taskRepository: TaskRepository;
  private projectRepository: ProjectRepository;

  constructor() {
    this.taskRepository = new TaskRepository();
    this.projectRepository = new ProjectRepository();
  }

  /**
   * Create a new task
   */
  async createTask(data: CreateTaskDTO): Promise<any> {
    await this.validateTaskData(data);

    const task = await this.taskRepository.create(data);
    
    // Invalidate cache
    await cacheManager.invalidateTaskCache(task.id, data.projectId);
    
    return await this.getTaskById(task.id);
  }

  /**
   * Get all tasks with optional filters and caching
   */
  async getTasks(filters?: TaskFilters, page: number = 1, limit: number = 10): Promise<{
    tasks: any[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  }> {
    console.log('🔍 getTasks called with:', { filters, page, limit });
    
    try {
      // ULTRA SIMPLE VERSION - no offset, no limit, no complex queries
      console.log('📊 Calling taskRepository.findAll() - ultra simple');
      const allTasks = await this.taskRepository.findAll();
      console.log('📋 Found total tasks:', allTasks.length);
      
      // Manual pagination
      const total = allTasks.length;
      const offset = (page - 1) * limit;
      const paginatedTasks = allTasks.slice(offset, offset + limit);
      
      console.log('📋 Paginated tasks:', paginatedTasks.length);
      
      return {
        tasks: paginatedTasks.map(t => {
          try {
            return t.toJSON();
          } catch (jsonError) {
            console.error('⚠️ Error converting task to JSON:', jsonError);
            return {
              id: t.id,
              title: t.title,
              description: t.description,
              status: t.status,
              priority: t.priority,
              projectId: t.projectId
            };
          }
        }),
        pagination: {
          page: parseInt(String(page)),
          limit: parseInt(String(limit)),
          total,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      console.error('❌ DETAILED Error in getTasks:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      throw error;
    }
  }

  /**
   * Get task by ID
   */
  async getTaskById(id: number): Promise<any> {
    const cacheKey = cacheManager.generateKey('task', id);
    
    return await cacheManager.getOrSet(
      cacheKey,
      async () => {
        const task = await this.taskRepository.findWithProject(id);
        if (!task) {
          throw new Error(`Task with ID ${id} not found`);
        }
        return task.toJSON();
      },
      300 // 5 minutes TTL
    );
  }

  /**
   * Update task
   */
  async updateTask(id: number, data: UpdateTaskDTO): Promise<any> {
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
    await cacheManager.invalidateTaskCache(id, existingTask.projectId);
    
    return await this.getTaskById(id);
  }

  /**
   * Delete task
   */
  async deleteTask(id: number): Promise<void> {
    const task = await this.taskRepository.findById(id);
    if (!task) {
      throw new Error(`Task with ID ${id} not found`);
    }

    await this.taskRepository.delete(id);
    
    // Invalidate cache
    await cacheManager.invalidateTaskCache(id, task.projectId);
  }

  /**
   * Get tasks for a specific project
   */
  async getTasksByProjectId(projectId: number, filters?: Omit<TaskFilters, 'projectId'>): Promise<any[]> {
    // Verify project exists
    const project = await this.projectRepository.findById(projectId);
    if (!project) {
      throw new Error(`Project with ID ${projectId} not found`);
    }

    const cacheKey = cacheManager.generateKey('project', projectId, 'tasks', JSON.stringify(filters || {}));
    
    return await cacheManager.getOrSet(
      cacheKey,
      async () => {
        const tasks = await this.taskRepository.findTasksForProject(projectId, {
          status: filters?.status,
          priority: filters?.priority,
          overdue: filters?.overdue,
        });
        return tasks.map(t => t.toJSON());
      },
      300 // 5 minutes TTL
    );
  }

  /**
   * Get task statistics
   */
  async getTaskStats(projectId?: number): Promise<{
    totalTasks: number;
    statusCounts: { [key: string]: number };
    priorityCounts: { [key: string]: number };
    overdueTasks: number;
    recentTasks: any[];
  }> {
    const cacheKey = cacheManager.generateKey('task_stats', projectId || 'all');
    
    return await cacheManager.getOrSet(
      cacheKey,
      async () => {
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
      },
      300 // 5 minutes TTL
    );
  }

  /**
   * Search tasks by title or description
   */
  async searchTasks(query: string, projectId?: number): Promise<any[]> {
    if (!query || query.trim().length < 2) {
      throw new Error('Search query must be at least 2 characters long');
    }

    const tasks = await this.taskRepository.search(query.trim(), projectId);
    return tasks.map(t => t.toJSON());
  }

  /**
   * Get overdue tasks
   */
  async getOverdueTasks(): Promise<any[]> {
    const cacheKey = cacheManager.generateKey('overdue_tasks');
    
    return await cacheManager.getOrSet(
      cacheKey,
      async () => {
        const tasks = await this.taskRepository.findOverdueTasks();
        return tasks.map(t => t.toJSON());
      },
      300 // 5 minutes TTL
    );
  }

  /**
   * Get tasks due in specific number of days
   */
  async getTasksDueIn(days: number): Promise<any[]> {
    if (days < 0) {
      throw new Error('Days must be a positive number');
    }

    const cacheKey = cacheManager.generateKey('tasks_due_in', days);
    
    return await cacheManager.getOrSet(
      cacheKey,
      async () => {
        const tasks = await this.taskRepository.findTasksDueIn(days);
        return tasks.map(t => t.toJSON());
      },
      300 // 5 minutes TTL
    );
  }

  /**
   * Validate task data for creation
   */
  private async validateTaskData(data: CreateTaskDTO): Promise<void> {
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
  private validateTaskUpdateData(data: UpdateTaskDTO): void {
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
  async completeTask(id: number): Promise<any> {
    return await this.updateTask(id, { status: 'completed' });
  }

  /**
   * Mark task as in progress
   */
  async startTask(id: number): Promise<any> {
    return await this.updateTask(id, { status: 'in_progress' });
  }

  /**
   * Cancel task
   */
  async cancelTask(id: number): Promise<any> {
    return await this.updateTask(id, { status: 'cancelled' });
  }
}
