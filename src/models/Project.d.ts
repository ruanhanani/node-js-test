import { Model } from 'sequelize-typescript';
import { Task } from './Task';
import { GitHubRepo } from './GitHubRepo';
export declare class Project extends Model {
    id: number;
    name: string;
    description?: string;
    status: 'active' | 'inactive' | 'completed';
    startDate?: Date;
    endDate?: Date;
    createdAt: Date;
    updatedAt: Date;
    tasks: Task[];
    githubRepos: GitHubRepo[];
    toJSON(): object;
}
//# sourceMappingURL=Project.d.ts.map