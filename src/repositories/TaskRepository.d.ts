import { BaseRepository } from './BaseRepository';
import { Task } from '@models/Task';
export interface ITaskRepository {
    findByProjectId(projectId: number): Promise<Task[]>;
    findWithProject(id: number): Promise<Task | null>;
    findByStatus(status: 'pending' | 'in_progress' | 'completed' | 'cancelled'): Promise<Task[]>;
    findByPriority(priority: 'low' | 'medium' | 'high' | 'critical'): Promise<Task[]>;
    findOverdueTasks(): Promise<Task[]>;
    findTasksDueIn(days: number): Promise<Task[]>;
    countByStatus(projectId?: number): Promise<{
        [key: string]: number;
    }>;
    countByPriority(projectId?: number): Promise<{
        [key: string]: number;
    }>;
    search(query: string, projectId?: number): Promise<Task[]>;
}
export declare class TaskRepository extends BaseRepository<Task> implements ITaskRepository {
    constructor();
    findByProjectId(projectId: number): Promise<Task[]>;
    findWithProject(id: number): Promise<Task | null>;
    findByStatus(status: 'pending' | 'in_progress' | 'completed' | 'cancelled'): Promise<Task[]>;
    findByPriority(priority: 'low' | 'medium' | 'high' | 'critical'): Promise<Task[]>;
    findOverdueTasks(): Promise<Task[]>;
    findTasksDueIn(days: number): Promise<Task[]>;
    countByStatus(projectId?: number): Promise<{
        [key: string]: number;
    }>;
    countByPriority(projectId?: number): Promise<{
        [key: string]: number;
    }>;
    search(query: string, projectId?: number): Promise<Task[]>;
    findAllWithProject(projectId?: number, limit?: number, offset?: number): Promise<{
        rows: Task[];
        count: number;
    }>;
    findTasksForProject(projectId: number, filters?: {
        status?: string;
        priority?: string;
        overdue?: boolean;
    }): Promise<Task[]>;
}
//# sourceMappingURL=TaskRepository.d.ts.map