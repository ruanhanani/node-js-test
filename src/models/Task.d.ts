import { Model } from 'sequelize-typescript';
import { Project } from './Project';
export declare class Task extends Model {
    id: number;
    title: string;
    description?: string;
    status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
    priority: 'low' | 'medium' | 'high' | 'critical';
    dueDate?: Date;
    projectId: number;
    createdAt: Date;
    updatedAt: Date;
    project: Project;
    toJSON(): object;
}
//# sourceMappingURL=Task.d.ts.map