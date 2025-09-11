import { BaseRepository } from './BaseRepository';
import { Project } from '@models/Project';
export interface IProjectRepository {
    findWithTasks(id: number): Promise<Project | null>;
    findWithGithubRepos(id: number): Promise<Project | null>;
    findWithTasksAndRepos(id: number): Promise<Project | null>;
    findByStatus(status: 'active' | 'inactive' | 'completed'): Promise<Project[]>;
    findActiveProjects(): Promise<Project[]>;
    findByDateRange(startDate: Date, endDate: Date): Promise<Project[]>;
    countByStatus(): Promise<{
        [key: string]: number;
    }>;
    search(query: string): Promise<Project[]>;
}
export declare class ProjectRepository extends BaseRepository<Project> implements IProjectRepository {
    constructor();
    findWithTasks(id: number): Promise<Project | null>;
    findWithGithubRepos(id: number): Promise<Project | null>;
    findWithTasksAndRepos(id: number): Promise<Project | null>;
    findByStatus(status: 'active' | 'inactive' | 'completed'): Promise<Project[]>;
    findActiveProjects(): Promise<Project[]>;
    findByDateRange(startDate: Date, endDate: Date): Promise<Project[]>;
    countByStatus(): Promise<{
        [key: string]: number;
    }>;
    search(query: string): Promise<Project[]>;
    findAllWithCounts(limit?: number, offset?: number): Promise<{
        rows: Project[];
        count: number;
    }>;
}
//# sourceMappingURL=ProjectRepository.d.ts.map